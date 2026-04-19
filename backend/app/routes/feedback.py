from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.feedback_service import FeedbackService

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/', methods=['POST'])
@jwt_required()
def submit_feedback():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    plan_id = data.get('plan_id')
    if not plan_id:
        return jsonify({'error': 'plan_id is required'}), 400

    result, status_code = FeedbackService.submit_feedback(plan_id, user_id, data)
    return jsonify(result), status_code


@feedback_bp.route('/plan/<plan_id>', methods=['GET'])
@jwt_required()
def get_plan_feedback(plan_id):
    result, status_code = FeedbackService.get_plan_feedback(plan_id)
    return jsonify(result), status_code
