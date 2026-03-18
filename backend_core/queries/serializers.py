"""
Serializers for the queries app.
"""
from rest_framework import serializers
from .models import PRIORITY_CHOICES, STATUS_CHOICES, DOMAIN_CHOICES, CATEGORY_CHOICES


class CreateQuerySerializer(serializers.Serializer):
    """Validates multipart/form-data for POST /api/queries/."""
    title       = serializers.CharField(max_length=255)
    description = serializers.CharField()
    domain      = serializers.ChoiceField(choices=DOMAIN_CHOICES)
    priority    = serializers.ChoiceField(choices=PRIORITY_CHOICES, default='medium', required=False)
    category    = serializers.ChoiceField(choices=CATEGORY_CHOICES, default='General', required=False)
    assignee_id = serializers.CharField(required=False, allow_blank=True, allow_null=True, default=None)


class AttachmentSerializer(serializers.Serializer):
    """Read-only representation of a saved attachment."""
    id          = serializers.CharField(read_only=True)
    query_id    = serializers.CharField(read_only=True)
    file_name   = serializers.CharField(read_only=True)
    file_path   = serializers.CharField(read_only=True)
    file_size   = serializers.IntegerField(read_only=True)
    uploaded_at = serializers.DateTimeField(read_only=True)


class UserSubSerializer(serializers.Serializer):
    """Deep serialization of user for queries."""
    id     = serializers.CharField(read_only=True)
    name   = serializers.CharField(read_only=True)
    email  = serializers.CharField(read_only=True)
    role   = serializers.CharField(read_only=True)
    domain = serializers.CharField(read_only=True, allow_null=True)


class CommentSerializer(serializers.Serializer):
    """Read-only representation of a query comment."""
    id               = serializers.CharField(read_only=True)
    query_id         = serializers.CharField(read_only=True)
    author           = UserSubSerializer(read_only=True)
    text             = serializers.CharField(read_only=True)
    is_internal_note = serializers.BooleanField(read_only=True)
    created_at       = serializers.DateTimeField(read_only=True)


class QuerySerializer(serializers.Serializer):
    """Read-only representation of a query document."""
    id          = serializers.CharField(read_only=True)
    query_id    = serializers.CharField(read_only=True)
    title       = serializers.CharField(read_only=True)
    description = serializers.CharField(read_only=True)
    domain      = serializers.CharField(read_only=True)
    category    = serializers.CharField(read_only=True)
    priority    = serializers.CharField(read_only=True)
    status      = serializers.CharField(read_only=True)
    author      = UserSubSerializer(read_only=True)
    assignee    = UserSubSerializer(read_only=True, allow_null=True)
    created_at  = serializers.DateTimeField(read_only=True)
    updated_at  = serializers.DateTimeField(read_only=True)
    attachments = AttachmentSerializer(many=True, read_only=True, required=False)
    comments    = CommentSerializer(many=True, read_only=True, required=False)
