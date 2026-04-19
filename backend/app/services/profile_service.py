from app.models.profile import ProfileModel
from app.utils.validators import validate_disability_type, validate_severity
from app.utils.helpers import serialize_doc


class ProfileService:

    @staticmethod
    def create_profile(user_id, data):
        existing = ProfileModel.get_by_user_id(user_id)
        if existing:
            return {'error': 'Profile already exists. Use PUT to update.'}, 409

        disabilities = data.get('disabilities', [])
        for d in disabilities:
            if not validate_disability_type(d.get('type', '')):
                return {'error': f"Invalid disability type: {d.get('type')}"}, 400
            if not validate_severity(d.get('severity', '')):
                return {'error': f"Invalid severity: {d.get('severity')}"}, 400

        profile_id = ProfileModel.create_profile(user_id, data)
        profile = ProfileModel.get_by_user_id(user_id)

        return {
            'message': 'Profile created successfully',
            'profile': serialize_doc(profile),
        }, 201

    @staticmethod
    def get_profile(user_id):
        profile = ProfileModel.get_by_user_id(user_id)
        if not profile:
            return {'error': 'Profile not found'}, 404
        return {'profile': serialize_doc(profile)}, 200

    @staticmethod
    def update_profile(user_id, data):
        existing = ProfileModel.get_by_user_id(user_id)
        if not existing:
            return {'error': 'Profile not found'}, 404

        disabilities = data.get('disabilities', [])
        for d in disabilities:
            if not validate_disability_type(d.get('type', '')):
                return {'error': f"Invalid disability type: {d.get('type')}"}, 400
            if not validate_severity(d.get('severity', '')):
                return {'error': f"Invalid severity: {d.get('severity')}"}, 400

        ProfileModel.update_profile(user_id, data)
        profile = ProfileModel.get_by_user_id(user_id)

        return {
            'message': 'Profile updated successfully',
            'profile': serialize_doc(profile),
        }, 200

    @staticmethod
    def update_preferences(user_id, preferences):
        existing = ProfileModel.get_by_user_id(user_id)
        if not existing:
            return {'error': 'Profile not found'}, 404

        ProfileModel.update_preferences(user_id, preferences)
        profile = ProfileModel.get_by_user_id(user_id)

        return {
            'message': 'Preferences updated successfully',
            'profile': serialize_doc(profile),
        }, 200
