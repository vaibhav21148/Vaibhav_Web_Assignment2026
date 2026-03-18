"""
Custom JWT Authentication backend for DRF + pymongo.

Instead of using simplejwt's default ORM-backed user lookup, this backend:
  1. Validates the JWT token using simplejwt's internals.
  2. Extracts the `user_id` claim (MongoDB ObjectId string).
  3. Fetches the user from MongoDB using UserDocument.find_by_id().
  4. Returns a UserProxy instance compatible with request.user.
"""
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed
from .models import UserDocument, UserProxy


class MongoJWTAuthentication(JWTAuthentication):
    """
    Override get_user() to load from MongoDB instead of the Django ORM.
    """

    def get_user(self, validated_token):
        try:
            user_id = str(validated_token['user_id'])
        except KeyError:
            raise InvalidToken('Token contained no recognizable user identification')

        user_dict = UserDocument.find_by_id(user_id)
        if user_dict is None:
            raise AuthenticationFailed('User not found', code='user_not_found')
        if not user_dict.get('is_active', True):
            raise AuthenticationFailed('User account is deactivated', code='user_inactive')

        return UserProxy(user_dict)
