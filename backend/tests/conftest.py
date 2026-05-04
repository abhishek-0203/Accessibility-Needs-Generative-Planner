"""
Shared pytest fixtures for all test modules.
Uses mongomock to mock MongoDB — no real DB required.
"""
import pytest
import mongomock
from unittest.mock import patch

from app import create_app


@pytest.fixture(scope='session')
def app():
    """Create a test Flask app with mongomock patched in."""
    with patch('flask_pymongo.PyMongo.init_app'):
        application = create_app('testing')
        application.config.update({
            'TESTING': True,
            'JWT_SECRET_KEY': 'test-jwt-secret',
            'SECRET_KEY': 'test-secret',
        })
        yield application


@pytest.fixture
def client(app):
    return app.test_client()


@pytest.fixture
def mongo_client():
    """Return a fresh mongomock client for each test."""
    return mongomock.MongoClient()


@pytest.fixture
def mock_db(mongo_client):
    """Return a fresh test database."""
    return mongo_client['accessibility_planner_test']


@pytest.fixture
def runner(app):
    return app.test_cli_runner()
