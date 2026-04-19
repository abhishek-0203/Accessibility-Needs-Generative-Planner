from datetime import datetime

from bson.objectid import ObjectId

from app.extensions import mongo


class PlanModel:

    @staticmethod
    def create_plan(user_id, activity_input, generated_plan, ai_model_used, generation_time_ms):
        plan_doc = {
            'user_id': ObjectId(user_id),
            'activity_input': activity_input,
            'generated_plan': generated_plan,
            'ai_model_used': ai_model_used,
            'generation_time_ms': generation_time_ms,
            'created_at': datetime.utcnow(),
            'updated_at': datetime.utcnow(),
        }
        result = mongo.db.plans.insert_one(plan_doc)
        return str(result.inserted_id)

    @staticmethod
    def get_by_id(plan_id):
        return mongo.db.plans.find_one({'_id': ObjectId(plan_id)})

    @staticmethod
    def get_user_plans(user_id, page=1, per_page=10):
        skip = (page - 1) * per_page
        cursor = mongo.db.plans.find({'user_id': ObjectId(user_id)}) \
            .sort('created_at', -1) \
            .skip(skip) \
            .limit(per_page)
        total = mongo.db.plans.count_documents({'user_id': ObjectId(user_id)})
        plans = list(cursor)
        return {
            'plans': plans,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page,
        }

    @staticmethod
    def delete_plan(plan_id, user_id):
        result = mongo.db.plans.delete_one({
            '_id': ObjectId(plan_id),
            'user_id': ObjectId(user_id),
        })
        return result.deleted_count > 0
