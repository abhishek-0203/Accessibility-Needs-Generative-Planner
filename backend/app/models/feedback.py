from datetime import datetime

from bson.objectid import ObjectId

from app.extensions import mongo


class FeedbackModel:

    @staticmethod
    def create_feedback(plan_id, user_id, rating, thumbs, comment, useful_steps, problematic_steps):
        feedback_doc = {
            'plan_id': ObjectId(plan_id),
            'user_id': ObjectId(user_id),
            'rating': rating,
            'thumbs': thumbs,
            'comment': comment,
            'useful_steps': useful_steps or [],
            'problematic_steps': problematic_steps or [],
            'created_at': datetime.utcnow(),
        }
        result = mongo.db.feedback.insert_one(feedback_doc)
        return str(result.inserted_id)

    @staticmethod
    def get_by_plan_id(plan_id):
        return list(mongo.db.feedback.find({'plan_id': ObjectId(plan_id)}))

    @staticmethod
    def get_plan_avg_rating(plan_id):
        pipeline = [
            {'$match': {'plan_id': ObjectId(plan_id)}},
            {'$group': {
                '_id': '$plan_id',
                'avg_rating': {'$avg': '$rating'},
                'count': {'$sum': 1},
            }},
        ]
        result = list(mongo.db.feedback.aggregate(pipeline))
        if result:
            return {'avg_rating': result[0]['avg_rating'], 'count': result[0]['count']}
        return {'avg_rating': 0, 'count': 0}
