from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.services.plan_service import PlanService

plans_bp = Blueprint('plans', __name__)


@plans_bp.route('/generate', methods=['POST'])
@jwt_required()
def generate_plan():
    user_id = get_jwt_identity()
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    result, status_code = PlanService.generate_plan(user_id, data)
    return jsonify(result), status_code


@plans_bp.route('/<plan_id>', methods=['GET'])
@jwt_required()
def get_plan(plan_id):
    user_id = get_jwt_identity()
    result, status_code = PlanService.get_plan(plan_id, user_id)
    return jsonify(result), status_code


@plans_bp.route('/history', methods=['GET'])
@jwt_required()
def get_history():
    user_id = get_jwt_identity()
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    result, status_code = PlanService.get_user_plans(user_id, page, per_page)
    return jsonify(result), status_code


@plans_bp.route('/<plan_id>', methods=['DELETE'])
@jwt_required()
def delete_plan(plan_id):
    user_id = get_jwt_identity()
    result, status_code = PlanService.delete_plan(plan_id, user_id)
    return jsonify(result), status_code
