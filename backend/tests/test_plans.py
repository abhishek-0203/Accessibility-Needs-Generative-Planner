"""Unit tests for plan routes and services."""
import pytest
from unittest.mock import patch, MagicMock
from bson.objectid import ObjectId
from datetime import datetime


def make_fake_plan(user_id=None):
    uid = user_id or ObjectId()
    return {
        '_id': ObjectId(),
        'user_id': uid,
        'activity_input': {'description': 'Visit hospital', 'activity_type': 'medical'},
        'generated_plan': {
            'title': 'Hospital Visit Plan',
            'summary': 'Accessible plan for hospital visit.',
            'steps': [
                {
                    'step_number': 1,
                    'title': 'Prepare',
                    'description': 'Charge wheelchair, pack documents.',
                    'time_estimate': '15 min',
                    'accessibility_notes': 'Keep medical ID accessible.',
                    'tools_needed': ['Wheelchair'],
                }
            ],
            'alternative_options': [],
            'recommended_tools': ['AccessRide App'],
            'weather_advisory': 'Clear skies expected.',
        },
        'ai_model_used': 'gpt-4o',
        'generation_time_ms': 1234,
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
    }


def make_fake_profile():
    return {
        '_id': ObjectId(),
        'user_id': ObjectId(),
        'disabilities': [{'type': 'mobility', 'severity': 'moderate', 'specific_needs': ''}],
        'preferences': {'preferred_transport': 'public'},
        'location': {'city': 'Mumbai'},
    }


def get_token(client):
    fake_id = ObjectId()
    fake_user = {
        '_id': fake_id, 'email': 'plan_user@test.com',
        'full_name': 'Plan User', 'role': 'user',
        'created_at': datetime.utcnow(),
    }
    with patch('app.models.user.UserModel.find_by_email', return_value=None), \
         patch('app.models.user.UserModel.create_user', return_value=str(fake_id)), \
         patch('app.models.user.UserModel.find_by_id', return_value=fake_user):
        resp = client.post('/api/v1/auth/register', json={
            'email': 'plan_user@test.com',
            'password': 'Valid123',
            'full_name': 'Plan User',
        })
    return resp.get_json()['access_token'], str(fake_id)


class TestPlanServiceValidation:
    def test_invalid_activity_type_returns_400(self):
        from app.services.plan_service import PlanService
        result, code = PlanService.generate_plan('user123', {'activity_type': 'invalid_type'})
        assert code == 400
        assert 'Invalid activity type' in result['error']

    def test_no_profile_returns_400(self):
        from app.services.plan_service import PlanService
        with patch('app.models.profile.ProfileModel.get_by_user_id', return_value=None):
            result, code = PlanService.generate_plan('user123', {'activity_type': 'medical'})
            assert code == 400
            assert 'profile' in result['error'].lower()

    def test_get_plan_not_found_returns_404(self):
        from app.services.plan_service import PlanService
        with patch('app.models.plan.PlanModel.get_by_id', return_value=None):
            result, code = PlanService.get_plan(str(ObjectId()), 'user123')
            assert code == 404

    def test_get_plan_wrong_user_returns_403(self):
        from app.services.plan_service import PlanService
        fake_plan = make_fake_plan(ObjectId())
        with patch('app.models.plan.PlanModel.get_by_id', return_value=fake_plan):
            result, code = PlanService.get_plan(str(fake_plan['_id']), str(ObjectId()))
            assert code == 403

    def test_delete_plan_not_found_returns_404(self):
        from app.services.plan_service import PlanService
        with patch('app.models.plan.PlanModel.delete_plan', return_value=False):
            result, code = PlanService.delete_plan(str(ObjectId()), 'user123')
            assert code == 404

    def test_delete_plan_success(self):
        from app.services.plan_service import PlanService
        with patch('app.models.plan.PlanModel.delete_plan', return_value=True):
            result, code = PlanService.delete_plan(str(ObjectId()), 'user123')
            assert code == 200
            assert 'deleted' in result['message'].lower()


class TestPlanRoute:
    def test_generate_plan_no_auth_returns_401(self, client):
        response = client.post('/api/v1/plans/generate', json={})
        assert response.status_code == 401

    def test_get_plan_no_auth_returns_401(self, client):
        response = client.get(f'/api/v1/plans/{str(ObjectId())}')
        assert response.status_code == 401

    def test_get_history_no_auth_returns_401(self, client):
        response = client.get('/api/v1/plans/history')
        assert response.status_code == 401

    def test_generate_plan_no_body_returns_400(self, client):
        token, _ = get_token(client)
        response = client.post('/api/v1/plans/generate',
            headers={'Authorization': f'Bearer {token}'},
            data='not json',
            content_type='application/json')
        assert response.status_code == 400

    def test_generate_plan_with_ai_mock(self, client):
        token, user_id = get_token(client)
        fake_plan = make_fake_plan(ObjectId(user_id))
        fake_profile = make_fake_profile()
        mock_ai_result = {
            'plan': fake_plan['generated_plan'],
            'model_used': 'gpt-4o',
            'generation_time_ms': 999,
        }
        with patch('app.models.profile.ProfileModel.get_by_user_id',
                   return_value=fake_profile), \
             patch('app.ai.engine.AIEngine.generate_plan', return_value=mock_ai_result), \
             patch('app.models.plan.PlanModel.create_plan', return_value=str(fake_plan['_id'])), \
             patch('app.models.plan.PlanModel.get_by_id', return_value=fake_plan):
            response = client.post('/api/v1/plans/generate',
                headers={'Authorization': f'Bearer {token}'},
                json={
                    'description': 'Visit hospital',
                    'activity_type': 'medical',
                    'date': '2026-04-20',
                    'destination': 'City Hospital',
                })
            assert response.status_code == 201
            data = response.get_json()
            assert 'plan' in data

    def test_get_plan_history_returns_paginated_result(self, client):
        token, user_id = get_token(client)
        fake_plan = make_fake_plan(ObjectId(user_id))
        mock_result = {
            'plans': [fake_plan],
            'total': 1,
            'page': 1,
            'per_page': 10,
            'pages': 1,
        }
        with patch('app.models.plan.PlanModel.get_user_plans', return_value=mock_result):
            response = client.get('/api/v1/plans/history',
                headers={'Authorization': f'Bearer {token}'})
            assert response.status_code == 200
            data = response.get_json()
            assert 'plans' in data
            assert data['total'] == 1

    def test_delete_plan_authenticated(self, client):
        token, user_id = get_token(client)
        plan_id = str(ObjectId())
        with patch('app.models.plan.PlanModel.delete_plan', return_value=True):
            response = client.delete(f'/api/v1/plans/{plan_id}',
                headers={'Authorization': f'Bearer {token}'})
            assert response.status_code == 200
