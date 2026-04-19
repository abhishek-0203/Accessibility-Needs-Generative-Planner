from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from bson.objectid import ObjectId

from app.extensions import mongo
from app.utils.decorators import admin_required
from app.utils.helpers import serialize_doc

admin_bp = Blueprint('admin', __name__)


@admin_bp.route('/stats', methods=['GET'])
@jwt_required()
@admin_required
def get_stats():
    stats = {
        'users': mongo.db.users.count_documents({}),
        'plans': mongo.db.plans.count_documents({}),
        'feedbacks': mongo.db.feedback.count_documents({}),
    }
    return jsonify({'stats': stats}), 200


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_required
def list_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    skip = (page - 1) * per_page

    users = list(
        mongo.db.users.find({}, {'password': 0})
        .sort('created_at', -1)
        .skip(skip)
        .limit(per_page)
    )
    total = mongo.db.users.count_documents({})

    return jsonify({
        'users': [serialize_doc(u) for u in users],
        'total': total,
        'page': page,
        'per_page': per_page,
        'pages': (total + per_page - 1) // per_page,
    }), 200


@admin_bp.route('/users/<user_id>', methods=['PUT'])
@jwt_required()
@admin_required
def update_user(user_id):
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    allowed_fields = {'is_active', 'role'}
    update_data = {k: v for k, v in data.items() if k in allowed_fields}

    if not update_data:
        return jsonify({'error': 'No valid fields to update'}), 400

    result = mongo.db.users.update_one(
        {'_id': ObjectId(user_id)},
        {'$set': update_data}
    )

    if result.matched_count == 0:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({'message': 'User updated successfully'}), 200
