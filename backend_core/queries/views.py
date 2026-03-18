"""
Views for the queries app — Stage 2: Query Creation & File Uploads.

Endpoints:
  POST   /api/queries/       — Protected. Create a query with optional file attachments.
  GET    /api/queries/       — Protected. List queries (scope depends on user role).
  GET    /api/queries/<id>/  — Protected. Retrieve a single query with attachments.
"""
import os
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated

from .models import QueryDocument, AttachmentDocument, CommentDocument
from .serializers import CreateQuerySerializer, QuerySerializer
from users.models import UserDocument
from users.permissions import IsManager, IsAdmin


def enrich_queries(queries, exclude_internal_comments=False):
    """
    Populates attachments, comments, author, and assignee dicts for a list of queries.
    """
    user_ids = set()
    for q in queries:
        if q.get('author_id'): user_ids.add(q['author_id'])
        if q.get('assignee_id'): user_ids.add(q['assignee_id'])
        
        # Load comments
        q['comments'] = CommentDocument.find_by_query(q['id'], exclude_internal=exclude_internal_comments)
        for c in q['comments']:
            if c.get('author_id'): user_ids.add(c['author_id'])
    
    users_cache = {}
    for uid in user_ids:
        users_cache[uid] = UserDocument.find_by_id(uid)
        
    for q in queries:
        q['attachments'] = AttachmentDocument.find_by_query(q['id'])
        q['author'] = users_cache.get(q.get('author_id'))
        q['assignee'] = users_cache.get(q.get('assignee_id')) if q.get('assignee_id') else None
        
        for c in q.get('comments', []):
            c['author'] = users_cache.get(c.get('author_id'))
        
    return queries


def _save_file(uploaded_file) -> tuple[str, str, int]:
    """
    Save an uploaded InMemoryUploadedFile to MEDIA_ROOT/attachments/.
    Returns (file_name, relative_file_path, file_size).
    """
    upload_dir = os.path.join(settings.MEDIA_ROOT, 'attachments')
    os.makedirs(upload_dir, exist_ok=True)

    safe_name = uploaded_file.name.replace(' ', '_')
    dest_path = os.path.join(upload_dir, safe_name)

    # If file with same name exists add a UUID prefix
    if os.path.exists(dest_path):
        import uuid
        safe_name = f'{uuid.uuid4().hex[:8]}_{safe_name}'
        dest_path = os.path.join(upload_dir, safe_name)

    with open(dest_path, 'wb+') as f:
        for chunk in uploaded_file.chunks():
            f.write(chunk)

    relative_path = f'attachments/{safe_name}'
    return safe_name, relative_path, uploaded_file.size


class QueryListCreateView(APIView):
    """
    GET  /api/queries/  — list queries scoped to role
    POST /api/queries/  — create a query, with optional file attachments
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Role-based query listing:
          admin   → all queries across all domains
          manager → queries in their assigned domain
          user    → only their own queries
        """
        user = request.user
        if user.role == 'admin':
            queries = QueryDocument.find_all()
        elif user.role == 'manager' and user.domain:
            queries = QueryDocument.find_by_domain(user.domain)
        else:
            queries = QueryDocument.find_by_author(user.id)

        # Enrich with attachments and user objects
        enrich_queries(queries)

        serializer = QuerySerializer(queries, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        """
        Accepts multipart/form-data.

        Required fields : title, description, domain
        Optional fields : priority, category, assignee_id
        Optional files  : files[] (multiple allowed)
        """
        serializer = CreateQuerySerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data

        try:
            query = QueryDocument.create(
                title=data['title'],
                description=data['description'],
                domain=data['domain'],
                author_id=request.user.id,
                priority=data.get('priority', 'medium'),
                category=data.get('category', 'General'),
                assignee_id=data.get('assignee_id') or None,
            )
        except ValueError as exc:
            return Response({'message': str(exc)}, status=status.HTTP_400_BAD_REQUEST)

        # Save uploaded files and create attachment records
        saved_attachments = []
        uploaded_files = request.FILES.getlist('files')
        for uploaded_file in uploaded_files:
            try:
                file_name, file_path, file_size = _save_file(uploaded_file)
                attachment = AttachmentDocument.create(
                    query_mongo_id=query['id'],
                    file_name=file_name,
                    file_path=file_path,
                    file_size=file_size,
                )
                saved_attachments.append(attachment)
            except Exception as exc:
                # File saving failure should not abort the whole request
                pass

        query['attachments'] = saved_attachments
        enrich_queries([query])  # Enrich for response (fetch user dicts)
        
        return Response(
            {
                'message': f'Query {query["query_id"]} created successfully',
                'query': QuerySerializer(query).data,
            },
            status=status.HTTP_201_CREATED,
        )


class QueryDetailView(APIView):
    """GET /api/queries/<id>/"""
    permission_classes = [IsAuthenticated]

    def get(self, request, query_id):
        query = QueryDocument.find_by_id(query_id)
        if query is None:
            return Response({'message': 'Query not found'}, status=status.HTTP_404_NOT_FOUND)

        # Access control: users can only read their own queries unless manager/admin
        user = request.user
        if user.role == 'user' and query.get('author_id') != user.id:
            return Response({'message': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
        if user.role == 'manager' and query.get('domain') != user.domain:
            return Response({'message': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)

        exclude_internal = (user.role == 'user')
        enrich_queries([query], exclude_internal_comments=exclude_internal)
        return Response(QuerySerializer(query).data, status=status.HTTP_200_OK)

    def patch(self, request, query_id):
        """Managers and Admins can update status, priority, and assignee."""
        user = request.user
        if user.role not in ('manager', 'admin'):
            return Response({'message': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
            
        query = QueryDocument.find_by_id(query_id)
        if query is None:
            return Response({'message': 'Query not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Domain check for managers
        if user.role == 'manager' and query.get('domain') != user.domain:
            return Response({'message': 'Forbidden'}, status=status.HTTP_403_FORBIDDEN)
            
        allowed_fields = ('status', 'priority', 'assignee_id')
        updates = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        if updates:
            try:
                QueryDocument.update(query['id'], updates)
            except ValueError as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        # Re-fetch and enrich to return updated data
        updated_query = QueryDocument.find_by_id(query_id)
        enrich_queries([updated_query], exclude_internal_comments=False)
        return Response(QuerySerializer(updated_query).data, status=status.HTTP_200_OK)

class QueryCommentCreateView(APIView):
    """POST /api/queries/<id>/comments/"""
    permission_classes = [IsAuthenticated]

    def post(self, request, query_id):
        query = QueryDocument.find_by_id(query_id)
        if query is None:
            return Response({'message': 'Query not found'}, status=status.HTTP_404_NOT_FOUND)
            
        text = request.data.get('text', '').strip()
        if not text:
            return Response({'message': 'Comment text is required'}, status=status.HTTP_400_BAD_REQUEST)

        is_internal = request.data.get('is_internal_note', False)
        # Only managers/admins can create internal notes
        if is_internal and request.user.role == 'user':
            is_internal = False

        CommentDocument.create(
            query_mongo_id=query['id'],
            author_id=request.user.id,
            text=text,
            is_internal_note=is_internal
        )
        
        # Return the whole refreshed query
        updated_query = QueryDocument.find_by_id(query_id)
        exclude_internal = (request.user.role == 'user')
        enrich_queries([updated_query], exclude_internal_comments=exclude_internal)
        return Response(QuerySerializer(updated_query).data, status=status.HTTP_201_CREATED)
