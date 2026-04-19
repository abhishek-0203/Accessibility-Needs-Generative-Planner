from app.models.feedback import FeedbackModel
from app.utils.helpers import serialize_doc


class FeedbackService:

    @staticmethod
    def submit_feedback(plan_id, user_id, data):
        rating = data.get('rating')
        if rating is not None and (not isinstance(rating, (int, float)) or rating < 1 or rating > 5):
            return {'error': 'Rating must be between 1 and 5'}, 400

        feedback_id = FeedbackModel.create_feedback(
            plan_id=plan_id,
            user_id=user_id,
            rating=rating,
            thumbs=data.get('thumbs'),
            comment=data.get('comment', ''),
            useful_steps=data.get('useful_steps', []),
            problematic_steps=data.get('problematic_steps', []),
        )

        return {
            'message': 'Feedback submitted successfully',
            'feedback_id': feedback_id,
        }, 201

    @staticmethod
    def get_plan_feedback(plan_id):
        feedbacks = FeedbackModel.get_by_plan_id(plan_id)
        avg_rating = FeedbackModel.get_plan_avg_rating(plan_id)

        return {
            'feedbacks': [serialize_doc(f) for f in feedbacks],
            'stats': avg_rating,
        }, 200
