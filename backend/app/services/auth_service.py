from flask_jwt_extended import create_access_token, create_refresh_token

from app.models.user import UserModel
from app.utils.validators import validate_email, validate_password
from app.utils.helpers import serialize_doc


class AuthService:

    @staticmethod
    def register(email, password, full_name):
        if not validate_email(email):
            return {'error': 'Invalid email format'}, 400

        if not validate_password(password):
            return {'error': 'Password must be at least 8 characters with letters and numbers'}, 400

        if not full_name or len(full_name.strip()) < 2:
            return {'error': 'Full name is required'}, 400

        existing = UserModel.find_by_email(email)
        if existing:
            return {'error': 'Email already registered'}, 409

        user_id = UserModel.create_user(email, password, full_name)
        user = UserModel.find_by_id(user_id)

        access_token = create_access_token(identity=str(user['_id']))
        refresh_token = create_refresh_token(identity=str(user['_id']))

        return {
            'message': 'User registered successfully',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': serialize_doc({
                '_id': user['_id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user.get('role', 'user'),
                'created_at': user['created_at'],
            }),
        }, 201

    @staticmethod
    def login(email, password):
        user = UserModel.find_by_email(email)
        if not user:
            return {'error': 'Invalid email or password'}, 401

        if not user.get('is_active', True):
            return {'error': 'Account is deactivated'}, 403

        if not UserModel.verify_password(user['password'], password):
            return {'error': 'Invalid email or password'}, 401

        UserModel.update_last_login(str(user['_id']))

        access_token = create_access_token(identity=str(user['_id']))
        refresh_token = create_refresh_token(identity=str(user['_id']))

        return {
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': serialize_doc({
                '_id': user['_id'],
                'email': user['email'],
                'full_name': user['full_name'],
                'role': user.get('role', 'user'),
            }),
        }, 200

    @staticmethod
    def refresh_token(identity):
        access_token = create_access_token(identity=identity)
        return {
            'access_token': access_token,
            'message': 'Token refreshed successfully',
        }, 200
