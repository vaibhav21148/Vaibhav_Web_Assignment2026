"""
URL routes for the queries app.

Mounted at /api/queries/ in the root urls.py:
  GET  /api/queries/        — list queries (role-scoped)
  POST /api/queries/        — create a new query
  GET  /api/queries/<id>/   — retrieve a single query with attachments
"""
from django.urls import path
from .views import QueryListCreateView, QueryDetailView, QueryCommentCreateView

urlpatterns = [
    path('', QueryListCreateView.as_view(), name='query-list-create'),
    path('<str:query_id>/', QueryDetailView.as_view(), name='query-detail'),
    path('<str:query_id>/comments/', QueryCommentCreateView.as_view(), name='query-comments'),
]
