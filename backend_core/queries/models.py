"""
Query and Attachment models for the ResolvIT portal.

Since we use pymongo directly (no Django ORM), this module provides:
  - QueryDocument  — CRUD operations on the `queries` MongoDB collection
  - AttachmentDocument — stores attachment metadata in the `attachments` collection
  - generate_query_id() — auto-generates a unique QID like RIT-0001

Priority/Status constants are centralised here for easy import.
"""
import uuid
from bson import ObjectId
from datetime import datetime
from backend_core.mongo import get_collection

# ---------------------------------------------------------------------------
# Choice constants
# ---------------------------------------------------------------------------
PRIORITY_CHOICES = ('low', 'medium', 'high', 'critical')
STATUS_CHOICES   = ('open', 'in-progress', 'resolved', 'closed')
DOMAIN_CHOICES   = (
    'Events', 'Marketing', 'Corporate Relations',
    'Hospitality', 'Operations', 'Design', 'Web and Tech', 'Media',
)
CATEGORY_CHOICES   = (
    'General', 'Bug Report', 'Feature Request',
    'Access Issue', 'Billing', 'Other',
)


def generate_query_id() -> str:
    """
    Generate a short unique query ID in the format RIT-XXXX.
    Uses an atomic counter stored in the `counters` collection.
    """
    counters = get_collection('counters')
    result = counters.find_one_and_update(
        {'_id': 'query_counter'},
        {'$inc': {'seq': 1}},
        upsert=True,
        return_document=True,
    )
    seq = result.get('seq', 1)
    return f'RIT-{seq:04d}'


class QueryDocument:
    """Wrapper around the MongoDB `queries` collection."""
    COLLECTION = 'queries'

    @classmethod
    def _col(cls):
        return get_collection(cls.COLLECTION)

    @classmethod
    def _clean(cls, doc):
        if doc is None:
            return None
        doc['id'] = str(doc.pop('_id'))
        return doc

    @classmethod
    def create(cls, title: str, description: str, domain: str,
               author_id: str, priority: str = 'medium',
               category: str = '', assignee_id: str = None) -> dict:
        """
        Insert a new query document.
        Returns the full document dict (with generated query_id).
        """
        if priority not in PRIORITY_CHOICES:
            raise ValueError(f'Invalid priority: {priority}')
        if domain not in DOMAIN_CHOICES:
            raise ValueError(f'Invalid domain: {domain}')

        query_id = generate_query_id()
        doc = {
            'query_id':    query_id,
            'title':       title.strip(),
            'description': description.strip(),
            'domain':      domain,
            'category':    category or 'General',
            'priority':    priority,
            'status':      'open',
            'author_id':   author_id,
            'assignee_id': assignee_id,
            'created_at':  datetime.utcnow(),
            'updated_at':  datetime.utcnow(),
        }
        result = cls._col().insert_one(doc)
        doc['id'] = str(result.inserted_id)
        doc.pop('_id', None)
        return doc

    @classmethod
    def find_by_id(cls, query_id: str) -> dict | None:
        try:
            doc = cls._col().find_one({'_id': ObjectId(query_id)})
        except Exception:
            return None
        return cls._clean(doc)

    @classmethod
    def find_by_author(cls, author_id: str) -> list[dict]:
        cursor = cls._col().find(
            {'author_id': author_id},
            sort=[('created_at', -1)],
        )
        return [cls._clean(d) for d in cursor]

    @classmethod
    def find_by_domain(cls, domain: str) -> list[dict]:
        cursor = cls._col().find(
            {'domain': domain},
            sort=[('created_at', -1)],
        )
        return [cls._clean(d) for d in cursor]

    @classmethod
    def find_all(cls) -> list[dict]:
        cursor = cls._col().find({}, sort=[('created_at', -1)])
        return [cls._clean(d) for d in cursor]

    @classmethod
    def update(cls, mongo_id: str, updates: dict) -> bool:
        """Update arbitrary fields on a query."""
        if not updates:
            return False
            
        if 'priority' in updates and updates['priority'] not in PRIORITY_CHOICES:
            raise ValueError(f'Invalid priority: {updates["priority"]}')
        if 'status' in updates and updates['status'] not in STATUS_CHOICES:
            raise ValueError(f'Invalid status: {updates["status"]}')
        
        updates['updated_at'] = datetime.utcnow()
        result = cls._col().update_one(
            {'_id': ObjectId(mongo_id)},
            {'$set': updates},
        )
        return result.modified_count > 0


class AttachmentDocument:
    """Wrapper around the MongoDB `attachments` collection."""
    COLLECTION = 'attachments'

    @classmethod
    def _col(cls):
        return get_collection(cls.COLLECTION)

    @classmethod
    def _clean(cls, doc):
        if doc is None:
            return None
        doc['id'] = str(doc.pop('_id'))
        return doc

    @classmethod
    def create(cls, query_mongo_id: str, file_name: str,
               file_path: str, file_size: int) -> dict:
        doc = {
            'query_id':   query_mongo_id,
            'file_name':  file_name,
            'file_path':  file_path,
            'file_size':  file_size,
            'uploaded_at': datetime.utcnow(),
        }
        result = cls._col().insert_one(doc)
        doc['id'] = str(result.inserted_id)
        doc.pop('_id', None)
        return doc

    @classmethod
    def find_by_query(cls, query_mongo_id: str) -> list[dict]:
        cursor = cls._col().find({'query_id': query_mongo_id})
        return [cls._clean(d) for d in cursor]


class CommentDocument:
    """Wrapper around the MongoDB `comments` collection."""
    COLLECTION = 'comments'

    @classmethod
    def _col(cls):
        return get_collection(cls.COLLECTION)

    @classmethod
    def _clean(cls, doc):
        if doc is None:
            return None
        doc['id'] = str(doc.pop('_id'))
        return doc

    @classmethod
    def create(cls, query_mongo_id: str, author_id: str,
               text: str, is_internal_note: bool = False) -> dict:
        doc = {
            'query_id':         query_mongo_id,
            'author_id':        author_id,
            'text':             text.strip(),
            'is_internal_note': bool(is_internal_note),
            'created_at':       datetime.utcnow(),
        }
        result = cls._col().insert_one(doc)
        doc['id'] = str(result.inserted_id)
        doc.pop('_id', None)
        return doc

    @classmethod
    def find_by_query(cls, query_mongo_id: str, exclude_internal: bool = False) -> list[dict]:
        query = {'query_id': query_mongo_id}
        if exclude_internal:
            query['is_internal_note'] = False
            
        cursor = cls._col().find(query, sort=[('created_at', 1)]) # Sort oldest first for timeline
        return [cls._clean(d) for d in cursor]
