"""Unit tests for profile routes and services."""
import pytest
from unittest.mock import patch
from bson.objectid import ObjectId
from datetime import datetime


def make_fake_profile(user_id=None):
    uid = user_id or ObjectId()
    return {
        '_id': ObjectId(),
        'user_id': uid,
        'disabilities': [
            {'type': 'mobility', 'severity': 'moderate', 'specific_needs': 'Wheelchair user'}
        ],
        'preferences': {'preferred_transport': 'public', 'high_contrast': True},
        'location': {'city': 'Mumbai', 'default_address': 'Andheri West'},
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
    }


def get_token(client):
    """Helper: register and return an access token."""
    fake_id = ObjectId()
    fake_user = {
        '_id': fake_id, 'email': 'profile_user@test.com',
        'full_name': 'Profile User', 'role': 'user',
        'created_at': datetime.utcnow(),
    }
    with patch('app.models.user.UserModel.find_by_email', return_value=None), \
         patch('app.models.user.UserModel.create_user', return_value=str(fake_id)), \
         patch('app.models.user.UserModel.find_by_id', return_value=fake_user):
        resp = client.post('/api/v1/auth/register', json={
            'email': 'profile_user@test.com',
            'password': 'Valid123',
            'full_name': 'Profile User',
        })
    return resp.get_json()['access_token']


class TestProfileServiceValidation:
    def test_create_profile_invalid_disability_type(self):
        from app.services.profile_service import ProfileService
        with patch('app.models.profile.ProfileModel.get_by_user_id', return_value=None):
            result, code = ProfileService.create_profile('user123', {
                'disabilities': [{'type': 'unknown', 'severity': 'mild'}]
            })
            assert code == 400
            assert 'Invalid disability type' in result['error']

    def test_create_profile_invalid_severity(self):
        from app.services.profile_service import ProfileService
        with patch('app.models.profile.ProfileModel.get_by_user_id', return_value=None):
            result, code = ProfileService.create_profile('user123', {
                'disabilities': [{'type': 'mobility', 'severity': 'extreme'}]
            })
            assert code == 400
            assert 'Invalid severity' in result['error']

    def test_create_profile_duplicate_returns_409(self):
        from app.services.profile_service import ProfileService
        with patch('app.models.profile.ProfileModel.get_by_user_id',
                   return_value=make_fake_profile()):
            result, code = ProfileService.create_profile('user123', {
                'disabilities': [{'type': 'mobility', 'severity': 'mild'}]
            })
            assert code == 409

    def test_get_profile_not_found_returns_404(self):
        from app.services.profile_service import ProfileService
        with patch('app.models.profile.ProfileModel.get_by_user_id', return_value=None):
            result, code = ProfileService.get_profile('user123')
            assert code == 404

    def test_get_profile_success(self):
        from app.services.profile_service import ProfileService
        fake = make_fake_profile()
        with patch('app.models.profile.ProfileModel.get_by_user_id', return_value=fake):
            result, code = ProfileService.get_profile('user123')
            assert code == 200
            assert 'profile' in result


class TestProfileRoute:
    def test_get_profile_no_auth_returns_401(self, client):
        response = client.get('/api/v1/profile/')
        assert response.status_code == 401

    def test_create_profile_no_auth_returns_401(self, client):
        response = client.post('/api/v1/profile/', json={})
        assert response.status_code == 401

    def test_create_profile_authenticated_success(self, client):
        token = get_token(client)
        fake_id = ObjectId()
        fake_profile = make_fake_profile(fake_id)
        with patch('app.models.profile.ProfileModel.get_by_user_id',
                   side_effect=[None, fake_profile]), \
             patch('app.models.profile.ProfileModel.create_profile',
                   return_value=str(ObjectId())):
            response = client.post('/api/v1/profile/',
                headers={'Authorization': f'Bearer {token}'},
                json={
                    'disabilities': [{'type': 'visual', 'severity': 'mild',
                                      'specific_needs': 'Low vision'}],
                    'preferences': {'high_contrast': True},
                    'location': {'city': 'Delhi'},
                })
            assert response.status_code == 201
            data = response.get_json()
            assert 'profile' in data

    def test_get_profile_authenticated_success(self, client):
        token = get_token(client)
        fake_profile = make_fake_profile()
        with patch('app.models.profile.ProfileModel.get_by_user_id',
                   return_value=fake_profile):
            response = client.get('/api/v1/profile/',
                headers={'Authorization': f'Bearer {token}'})
            assert response.status_code == 200
            assert 'profile' in response.get_json()

    def test_get_profile_not_found_returns_404(self, client):
        token = get_token(client)
        with patch('app.models.profile.ProfileModel.get_by_user_id', return_value=None):
            response = client.get('/api/v1/profile/',
                headers={'Authorization': f'Bearer {token}'})
            assert response.status_code == 404

    def test_update_preferences_no_auth_returns_401(self, client):
        response = client.patch('/api/v1/profile/preferences', json={})
        assert response.status_code == 401
