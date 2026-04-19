import redis
from flask_pymongo import PyMongo
from flask_jwt_extended import JWTManager

mongo = PyMongo()
jwt = JWTManager()

_redis_client = None


def get_redis():
    global _redis_client
    if _redis_client is None:
        import os
        _redis_client = redis.from_url(os.getenv('REDIS_URL', 'redis://localhost:6379/0'))
    return _redis_client
