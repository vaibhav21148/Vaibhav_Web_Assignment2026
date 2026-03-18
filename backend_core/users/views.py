"""
Views for the users app — Authentication & Identity.

All database access happens through UserDocument (pymongo), not Django ORM.
JWT tokens are generated via rest_framework_simplejwt's RefreshToken.

Endpoints:
  POST /api/auth/register/  — Public. Create account, return tokens + user.
  POST /api/auth/login/     — Public. Verify credentials, return tokens + user.
  POST /api/auth/token/refresh/ — Public. Refresh access token.
  GET  /api/auth/me/        — Protected. Return current user's profile.
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserDocument, UserProxy
from .serializers import RegisterSerializer, UserSerializer
from .permissions import IsAdmin


def _make_tokens(user_id: str) -> dict:
    """
    Generate a simplejwt RefreshToken / AccessToken pair for a MongoDB user.

    We manually set `user_id` on the token payload because simplejwt normally
    derives it from a Django ORM user's pk.  The MongoJWTAuthentication backend
    (authentication.py) reads this same claim to load the user from MongoDB.
    """
    refresh = RefreshToken()
    refresh['user_id'] = user_id
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }


class RegisterView(APIView):
    """
    POST /api/auth/register/

    Creates a new account, hashes the password via bcrypt, and returns
    a JWT pair so the client can authenticate immediately without a
    separate login request.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        try:
            user_dict = UserDocument.create(
                name=data['name'],
                email=data['email'],
                password=data['password'],
                role=data.get('role', 'user'),
                domain=data.get('domain'),
            )
        except ValueError as exc:
            return Response({'message': str(exc)}, status=status.HTTP_409_CONFLICT)

        tokens = _make_tokens(user_dict['id'])
        return Response(
            {
                'message': 'Account created successfully',
                'user': UserSerializer(user_dict).data,
                **tokens,
            },
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    """
    POST /api/auth/login/

    Validates credentials against the bcrypt hash stored in MongoDB.
    Returns a JWT pair and user profile on success.
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip()
        password = request.data.get('password', '')

        if not email or not password:
            return Response(
                {'message': 'Email and password are required'},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user_dict = UserDocument.check_password(email, password)
        if user_dict is None:
            return Response(
                {'message': 'Invalid email or password'},
                status=status.HTTP_401_UNAUTHORIZED,
            )

        if not user_dict.get('is_active', True):
            return Response(
                {'message': 'Your account has been deactivated. Contact an administrator.'},
                status=status.HTTP_403_FORBIDDEN,
            )

        tokens = _make_tokens(user_dict['id'])
        return Response(
            {
                'message': 'Login successful',
                'user': UserSerializer(user_dict).data,
                **tokens,
            },
            status=status.HTTP_200_OK,
        )


class MeView(APIView):
    """
    GET /api/auth/me/

    Returns the profile of the currently authenticated user.
    Authentication is handled by MongoJWTAuthentication which populates
    request.user with a UserProxy instance.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        user_dict = UserDocument.find_by_id(user.id)
        if user_dict is None:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'user': UserSerializer(user_dict).data}, status=status.HTTP_200_OK)


class AdminUserListView(APIView):
    """GET /api/admin/users/ - List all users (Admins only)"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        users = UserDocument.find_all()
        return Response(users, status=status.HTTP_200_OK)


class AdminUserDetailView(APIView):
    """PATCH /api/admin/users/<id>/ - Update role, domain, is_active"""
    permission_classes = [IsAuthenticated, IsAdmin]

    def patch(self, request, user_id):
        user = UserDocument.find_by_id(user_id)
        if not user:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
        # Prevent admin from deactivating themselves
        if user_id == request.user.id and request.data.get('is_active') is False:
            return Response({'message': 'Cannot deactivate yourself'}, status=status.HTTP_400_BAD_REQUEST)

        allowed_fields = ('role', 'domain', 'is_active')
        updates = {k: v for k, v in request.data.items() if k in allowed_fields}
        
        # Domain can be explicitly set to None if role is changed to admin
        if 'domain' in request.data and request.data['domain'] == '':
            updates['domain'] = None
            
        if updates:
            try:
                UserDocument.update(user_id, updates)
            except ValueError as e:
                return Response({'message': str(e)}, status=status.HTTP_400_BAD_REQUEST)
                
        updated_user = UserDocument.find_by_id(user_id)
        return Response(updated_user, status=status.HTTP_200_OK)
