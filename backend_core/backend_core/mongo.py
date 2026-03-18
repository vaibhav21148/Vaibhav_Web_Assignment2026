"""
MongoDB connection helper for the ResolvIT backend.

Usage:
    from backend_core.mongo import get_db, get_collection

    db = get_db()
    users = get_collection('users')
"""
from pymongo import MongoClient
from django.conf import settings
import threading

_client = None
_lock = threading.Lock()


def get_client():
    """Return a singleton MongoClient instance (thread-safe)."""
    global _client
    if _client is None:
        with _lock:
            if _client is None:
                _client = MongoClient(settings.MONGO_URI)
    return _client


def get_db():
    """Return the primary resolvit database handle."""
    return get_client()[settings.MONGO_DB_NAME]


def get_collection(name: str):
    """Return a named collection from the resolvit database."""
    return get_db()[name]
