from datetime import datetime

import bcrypt
from bson.objectid import ObjectId

from app.extensions import mongo


class UserModel:

    @staticmethod
    def create_user(email, password, full_name):
        hashed = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user_doc = {
            'email': email.lower().strip(),
            'password': hashed,
            'full_name': full_name,
            'role': 'user',
            'is_active': True,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
            'last_login': None,
        }
        result = mongo.db.users.insert_one(user_doc)
        return str(result.inserted_id)

    @staticmethod
    def find_by_email(email):
        return mongo.db.users.find_one({'email': email.lower().strip()})

    @staticmethod
    def find_by_id(user_id):
        return mongo.db.users.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def verify_password(stored_hash, password):
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode('utf-8')
        return bcrypt.checkpw(password.encode('utf-8'), stored_hash)

    @staticmethod
    def update_last_login(user_id):
        mongo.db.users.update_one(
            {'_id': ObjectId(user_id)},
            {'$set': {'last_login': datetime.utcnow()}}
        )
