"""Unit tests for authentication routes and services."""
import pytest
import mongomock
from unittest.mock import patch, MagicMock
from bson.objectid import ObjectId
from datetime import datetime


# ── Validator tests (no DB needed) ─────────────────────────────────────────

class TestAuthValidation:
    """Test input validation at the service layer."""

    def test_register_rejects_invalid_email(self):
        from app.services.auth_service import AuthService
        result, code = AuthService.register('not-an-email', 'Valid123', 'Test User')
        assert code == 400
        assert 'Invalid email' in result['error']

    def test_register_rejects_weak_password(self):
        from app.services.auth_service import AuthService
        result, code = AuthService.register('user@test.com', 'weak', 'Test User')
        assert code == 400
        assert 'Password' in result['error']

    def test_register_rejects_short_name(self):
        from app.services.auth_service import AuthService
        result, code = AuthService.register('user@test.com', 'Valid123', 'A')
        assert code == 400
        assert 'Full name' in result['error']


# ── Route-level tests (with mongomock) ─────────────────────────────────────

@pytest.fixture
def mock_mongo_db():
    return mongomock.MongoClient().db


class TestRegisterRoute:
    def test_register_missing_fields_returns_400(self, client):
        response = client.post('/api/v1/auth/register', json={
            'email': 'user@test.com',
        })
        assert response.status_code == 400
        assert 'required' in response.get_json()['error'].lower()

    def test_register_no_body_returns_400(self, client):
        response = client.post('/api/v1/auth/register',
                               data='not json',
                               content_type='application/json')
        assert response.status_code == 400

    def test_register_invalid_email_returns_400(self, client):
        with patch('app.models.user.UserModel.find_by_email', return_value=None), \
             patch('app.models.user.UserModel.create_user', return_value=str(ObjectId())), \
             patch('app.models.user.UserModel.find_by_id', return_value={
                 '_id': ObjectId(), 'email': 'bad', 'full_name': 'Test',
                 'role': 'user', 'created_at': datetime.utcnow(),
             }):
            response = client.post('/api/v1/auth/register', json={
                'email': 'not-an-email',
                'password': 'Valid123',
                'full_name': 'Test User',
            })
            assert response.status_code == 400

    def test_register_success_returns_201_with_tokens(self, client):
        fake_id = ObjectId()
        fake_user = {
            '_id': fake_id,
            'email': 'newuser@test.com',
            'full_name': 'New User',
            'role': 'user',
            'created_at': datetime.utcnow(),
        }
        with patch('app.models.user.UserModel.find_by_email', return_value=None), \
             patch('app.models.user.UserModel.create_user', return_value=str(fake_id)), \
             patch('app.models.user.UserModel.find_by_id', return_value=fake_user):
            response = client.post('/api/v1/auth/register', json={
                'email': 'newuser@test.com',
                'password': 'Valid123',
                'full_name': 'New User',
            })
            data = response.get_json()
            assert response.status_code == 201
            assert 'access_token' in data
            assert 'refresh_token' in data
            assert data['user']['email'] == 'newuser@test.com'

    def test_register_duplicate_email_returns_409(self, client):
        existing_user = {
            '_id': ObjectId(), 'email': 'existing@test.com',
            'full_name': 'Existing', 'role': 'user',
            'created_at': datetime.utcnow(),
        }
        with patch('app.models.user.UserModel.find_by_email', return_value=existing_user):
            response = client.post('/api/v1/auth/register', json={
                'email': 'existing@test.com',
                'password': 'Valid123',
                'full_name': 'Test User',
            })
            data = response.get_json()
            assert response.status_code == 409
            assert 'already registered' in data['error']


class TestLoginRoute:
    def test_login_missing_fields_returns_400(self, client):
        response = client.post('/api/v1/auth/login', json={'email': 'a@b.com'})
        assert response.status_code == 400

    def test_login_user_not_found_returns_401(self, client):
        with patch('app.models.user.UserModel.find_by_email', return_value=None):
            response = client.post('/api/v1/auth/login', json={
                'email': 'ghost@test.com',
                'password': 'Valid123',
            })
            assert response.status_code == 401
            assert 'Invalid' in response.get_json()['error']

    def test_login_wrong_password_returns_401(self, client):
        fake_user = {
            '_id': ObjectId(), 'email': 'user@test.com',
            'password': b'hashed', 'is_active': True,
            'full_name': 'Test', 'role': 'user',
            'created_at': datetime.utcnow(),
        }
        with patch('app.models.user.UserModel.find_by_email', return_value=fake_user), \
             patch('app.models.user.UserModel.verify_password', return_value=False):
            response = client.post('/api/v1/auth/login', json={
                'email': 'user@test.com',
                'password': 'WrongPass1',
            })
            assert response.status_code == 401

    def test_login_success_returns_tokens(self, client):
        fake_id = ObjectId()
        fake_user = {
            '_id': fake_id, 'email': 'user@test.com',
            'password': b'hashed', 'is_active': True,
            'full_name': 'Test User', 'role': 'user',
            'created_at': datetime.utcnow(),
        }
        with patch('app.models.user.UserModel.find_by_email', return_value=fake_user), \
             patch('app.models.user.UserModel.verify_password', return_value=True), \
             patch('app.models.user.UserModel.update_last_login', return_value=None):
            response = client.post('/api/v1/auth/login', json={
                'email': 'user@test.com',
                'password': 'Valid123',
            })
            data = response.get_json()
            assert response.status_code == 200
            assert 'access_token' in data
            assert 'refresh_token' in data
            assert data['user']['email'] == 'user@test.com'

    def test_login_inactive_account_returns_403(self, client):
        fake_user = {
            '_id': ObjectId(), 'email': 'inactive@test.com',
            'password': b'hashed', 'is_active': False,
            'full_name': 'Inactive', 'role': 'user',
        }
        with patch('app.models.user.UserModel.find_by_email', return_value=fake_user):
            response = client.post('/api/v1/auth/login', json={
                'email': 'inactive@test.com',
                'password': 'Valid123',
            })
            assert response.status_code == 403

    def test_logout_requires_auth(self, client):
        response = client.post('/api/v1/auth/logout')
        assert response.status_code == 401
