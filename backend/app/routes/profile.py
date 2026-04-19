from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.profile_service import ProfileService

profile_bp = Blueprint('profile', __name__)


@profile_bp.route('/', methods=['POST'])
@jwt_required()
def create_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = ProfileService.create_profile(user_id, data)
    return jsonify(result), status_code


@profile_bp.route('/', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    result, status_code = ProfileService.get_profile(user_id)
    return jsonify(result), status_code


@profile_bp.route('/', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = ProfileService.update_profile(user_id, data)
    return jsonify(result), status_code


@profile_bp.route('/preferences', methods=['PATCH'])
@jwt_required()
def update_preferences():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = ProfileService.update_preferences(user_id, data)
    return jsonify(result), status_code
