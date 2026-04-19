from datetime import datetime

from bson.objectid import ObjectId

from app.extensions import mongo


class ProfileModel:

    @staticmethod
    def create_profile(user_id, data):
        profile_doc = {
            'user_id': ObjectId(user_id),
            'disabilities': data.get('disabilities', []),
            'preferences': data.get('preferences', {}),
            'location': data.get('location', {}),
            'assistive_devices': data.get('assistive_devices', []),
            'emergency_contact': data.get('emergency_contact', {}),
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        }
        result = mongo.db.profiles.insert_one(profile_doc)
        return str(result.inserted_id)

    @staticmethod
    def get_by_user_id(user_id):
        return mongo.db.profiles.find_one({'user_id': ObjectId(user_id)})

    @staticmethod
    def update_profile(user_id, data):
        protected_fields = {'_id', 'user_id', 'created_at'}
        safe_data = {k: v for k, v in data.items() if k not in protected_fields}
        safe_data['updated_at'] = datetime.utcnow()
        result = mongo.db.profiles.update_one(
            {'user_id': ObjectId(user_id)},
            {'$set': safe_data}
        )
        return result.modified_count > 0

    @staticmethod
    def update_preferences(user_id, preferences):
        update_fields = {f'preferences.{k}': v for k, v in preferences.items()}
        update_fields['updated_at'] = datetime.utcnow()
        result = mongo.db.profiles.update_one(
            {'user_id': ObjectId(user_id)},
            {'$set': update_fields}
        )
        return result.modified_count > 0
