"""
Serializers for the users app.

These are simple dataclass-style serializers working with plain Python dicts
(from pymongo) rather than Django ORM model instances.
"""
from rest_framework import serializers

ROLE_CHOICES      = ['user', 'manager', 'admin']
PORTFOLIO_CHOICES = [
    'Events', 'Marketing', 'Corporate Relations',
    'Hospitality', 'Operations', 'Design', 'Web and Tech', 'Media',
]


class RegisterSerializer(serializers.Serializer):
    """Validates the registration payload before passing to UserDocument.create()."""
    name     = serializers.CharField(max_length=150)
    email    = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    role     = serializers.ChoiceField(choices=ROLE_CHOICES, default='user', required=False)
    domain   = serializers.CharField(
        allow_null=True, allow_blank=True, required=False, default=None
    )


class UserSerializer(serializers.Serializer):
    """
    Read-only representation of a user dict returned by pymongo.
    Used in registration responses and the /me endpoint.
    """
    id = serializers.CharField(read_only=True)
    email = serializers.EmailField(read_only=True)
    name = serializers.CharField(read_only=True)
    role = serializers.CharField(read_only=True)
    domain = serializers.CharField(read_only=True, allow_null=True)
    is_active = serializers.BooleanField(read_only=True)
    date_joined = serializers.DateTimeField(read_only=True)
