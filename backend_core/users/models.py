"""
User model abstraction for the ResolvIT portal.

Since djongo is not compatible with Python 3.13, we use pymongo directly.
This module provides a UserDocument class that wraps MongoDB CRUD operations
for the `users` collection, plus a lightweight UserAuth class that is compatible
with Django REST Framework's request.user interface (without Django ORM).
"""
import bcrypt
from bson import ObjectId
from datetime import datetime
from backend_core.mongo import get_collection

ROLE_CHOICES      = ('user', 'manager', 'admin')
PORTFOLIO_CHOICES = (
    'Events', 'Marketing', 'Corporate Relations',
    'Hospitality', 'Operations', 'Design', 'Web and Tech', 'Media',
)


class UserDocument:
    """
    Thin wrapper around the MongoDB `users` collection.
    All returned user dicts have `_id` converted to a string `id` field.
    """
    COLLECTION = 'users'

    @classmethod
    def _col(cls):
        return get_collection(cls.COLLECTION)

    @classmethod
    def _clean(cls, doc):
        """Convert ObjectId _id to string id and remove the raw _id field."""
        if doc is None:
            return None
        doc['id'] = str(doc.pop('_id'))
        return doc

    @classmethod
    def find_by_email(cls, email: str, include_password: bool = False):
        """Fetch a single user document by email (case-insensitive)."""
        projection = None if include_password else {'password': 0}
        doc = cls._col().find_one({'email': email.lower()}, projection)
        return cls._clean(doc)

    @classmethod
    def find_by_id(cls, user_id: str):
        """Fetch a single user document by its MongoDB ObjectId string."""
        try:
            doc = cls._col().find_one({'_id': ObjectId(user_id)}, {'password': 0})
        except Exception:
            return None
        return cls._clean(doc)

    @classmethod
    def create(cls, name: str, email: str, password: str,
               role: str = 'user', domain=None) -> dict:
        """
        Insert a new user document.

        Password is hashed with bcrypt before storage.
        Raises ValueError if the email is already taken.
        """
        if role not in ROLE_CHOICES:
            raise ValueError(f'Invalid role: {role}')
        if domain is not None and domain not in PORTFOLIO_CHOICES:
            raise ValueError(f'Invalid domain: {domain}')

        email = email.lower().strip()
        if cls._col().find_one({'email': email}):
            raise ValueError('An account with this email already exists')

        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12))
        doc = {
            'name': name.strip(),
            'email': email,
            'password': hashed.decode('utf-8'),
            'role': role,
            'domain': domain,
            'is_active': True,
            'date_joined': datetime.utcnow(),
        }
        result = cls._col().insert_one(doc)
        doc['id'] = str(result.inserted_id)
        doc.pop('_id', None)
        doc.pop('password', None)
        return doc

    @classmethod
    def check_password(cls, email: str, raw_password: str) -> dict | None:
        """
        Verify a plaintext password against the stored bcrypt hash.
        Returns the user dict (without password) on success, None on failure.
        """
        doc = cls.find_by_email(email, include_password=True)
        if doc is None:
            return None
        stored_hash = doc.pop('password', None)
        if stored_hash and bcrypt.checkpw(raw_password.encode('utf-8'),
                                          stored_hash.encode('utf-8')):
            return doc
        return None

    @classmethod
    def find_all(cls) -> list[dict]:
        """Fetch all users."""
        cursor = cls._col().find({}, {'password': 0}).sort('date_joined', -1)
        return [cls._clean(d) for d in cursor]

    @classmethod
    def update(cls, user_id: str, updates: dict) -> bool:
        """Update arbitrary user fields (e.g. role, domain, is_active)."""
        if not updates:
            return False
            
        if 'role' in updates and updates['role'] not in ROLE_CHOICES:
            raise ValueError(f'Invalid role: {updates["role"]}')
        if 'domain' in updates and updates['domain'] is not None and updates['domain'] not in PORTFOLIO_CHOICES:
            raise ValueError(f'Invalid domain: {updates["domain"]}')

        result = cls._col().update_one(
            {'_id': ObjectId(user_id)},
            {'$set': updates}
        )
        return result.modified_count > 0


class UserProxy:
    """
    A lightweight, non-ORM user object compatible with DRF's request.user.

    simplejwt sets request.user via its authentication backend; we override
    that backend (see authentication.py) to return a UserProxy instance instead
    of a Django ORM user.
    """

    def __init__(self, user_dict: dict):
        self._data = user_dict
        self.id = user_dict.get('id')
        self.email = user_dict.get('email', '')
        self.name = user_dict.get('name', '')
        self.role = user_dict.get('role', 'user')
        self.domain = user_dict.get('domain')
        self.is_active = user_dict.get('is_active', True)
        self.date_joined = user_dict.get('date_joined')

    # DRF / Django compatibility
    @property
    def is_authenticated(self):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def pk(self):
        return self.id

    def __str__(self):
        return f'{self.name} <{self.email}>'
