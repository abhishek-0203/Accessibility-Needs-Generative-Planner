"""Unit tests for feedback routes and services."""
import pytest
from unittest.mock import patch
from bson.objectid import ObjectId
from datetime import datetime


def get_token(client):
    fake_id = ObjectId()
    fake_user = {
        '_id': fake_id, 'email': 'fb_user@test.com',
        'full_name': 'Feedback User', 'role': 'user',
        'created_at': datetime.utcnow(),
    }
    with patch('app.models.user.UserModel.find_by_email', return_value=None), \
         patch('app.models.user.UserModel.create_user', return_value=str(fake_id)), \
         patch('app.models.user.UserModel.find_by_id', return_value=fake_user):
        resp = client.post('/api/v1/auth/register', json={
            'email': 'fb_user@test.com',
            'password': 'Valid123',
            'full_name': 'Feedback User',
        })
    return resp.get_json()['access_token']


class TestFeedbackServiceValidation:
    def test_invalid_rating_too_high(self):
        from app.services.feedback_service import FeedbackService
        result, code = FeedbackService.submit_feedback(
            str(ObjectId()), 'user123',
            {'plan_id': str(ObjectId()), 'rating': 6, 'thumbs': 'up'}
        )
        assert code == 400
        assert 'Rating' in result['error']

    def test_invalid_rating_too_low(self):
        from app.services.feedback_service import FeedbackService
        result, code = FeedbackService.submit_feedback(
            str(ObjectId()), 'user123',
            {'plan_id': str(ObjectId()), 'rating': 0, 'thumbs': 'up'}
        )
        assert code == 400

    def test_valid_feedback_no_rating(self):
        from app.services.feedback_service import FeedbackService
        fake_id = str(ObjectId())
        with patch('app.models.feedback.FeedbackModel.create_feedback',
                   return_value=fake_id):
            result, code = FeedbackService.submit_feedback(
                str(ObjectId()), 'user123',
                {'thumbs': 'up', 'comment': 'Great plan!'}
            )
            assert code == 201
            assert 'feedback_id' in result

    def test_get_plan_feedback(self):
        from app.services.feedback_service import FeedbackService
        plan_id = str(ObjectId())
        fake_feedbacks = [
            {
                '_id': ObjectId(), 'plan_id': ObjectId(plan_id),
                'user_id': ObjectId(), 'rating': 4, 'thumbs': 'up',
                'comment': 'Helpful', 'created_at': datetime.utcnow(),
            }
        ]
        with patch('app.models.feedback.FeedbackModel.get_by_plan_id',
                   return_value=fake_feedbacks), \
             patch('app.models.feedback.FeedbackModel.get_plan_avg_rating',
                   return_value={'avg_rating': 4.0, 'count': 1}):
            result, code = FeedbackService.get_plan_feedback(plan_id)
            assert code == 200
            assert result['stats']['avg_rating'] == 4.0
            assert result['stats']['count'] == 1


class TestFeedbackRoute:
    def test_submit_feedback_no_auth_returns_401(self, client):
        response = client.post('/api/v1/feedback/', json={})
        assert response.status_code == 401

    def test_get_feedback_no_auth_returns_401(self, client):
        response = client.get(f'/api/v1/feedback/plan/{str(ObjectId())}')
        assert response.status_code == 401

    def test_submit_feedback_missing_plan_id_returns_400(self, client):
        token = get_token(client)
        response = client.post('/api/v1/feedback/',
            headers={'Authorization': f'Bearer {token}'},
            json={'rating': 4, 'thumbs': 'up'})
        assert response.status_code == 400
        assert 'plan_id' in response.get_json()['error']

    def test_submit_feedback_success(self, client):
        token = get_token(client)
        plan_id = str(ObjectId())
        fake_fb_id = str(ObjectId())
        with patch('app.models.feedback.FeedbackModel.create_feedback',
                   return_value=fake_fb_id):
            response = client.post('/api/v1/feedback/',
                headers={'Authorization': f'Bearer {token}'},
                json={
                    'plan_id': plan_id,
                    'rating': 5,
                    'thumbs': 'up',
                    'comment': 'Excellent accessibility plan!',
                    'useful_steps': [1, 2],
                    'problematic_steps': [],
                })
            assert response.status_code == 201
            data = response.get_json()
            assert data['feedback_id'] == fake_fb_id

    def test_get_plan_feedback_success(self, client):
        token = get_token(client)
        plan_id = str(ObjectId())
        fake_feedbacks = []
        with patch('app.models.feedback.FeedbackModel.get_by_plan_id',
                   return_value=fake_feedbacks), \
             patch('app.models.feedback.FeedbackModel.get_plan_avg_rating',
                   return_value={'avg_rating': 0, 'count': 0}):
            response = client.get(f'/api/v1/feedback/plan/{plan_id}',
                headers={'Authorization': f'Bearer {token}'})
            assert response.status_code == 200
            data = response.get_json()
            assert 'feedbacks' in data
            assert 'stats' in data
