import time

from app.models.plan import PlanModel
from app.models.profile import ProfileModel
from app.ai.engine import AIEngine
from app.utils.helpers import serialize_doc
from app.utils.validators import validate_activity_type


class PlanService:

    @staticmethod
    def generate_plan(user_id, activity_input):
        activity_type = activity_input.get('activity_type', 'custom')
        if not validate_activity_type(activity_type):
            return {'error': f'Invalid activity type: {activity_type}'}, 400

        profile = ProfileModel.get_by_user_id(user_id)
        if not profile:
            return {'error': 'Please create a profile before generating plans'}, 400

        try:
            engine = AIEngine()
            result = engine.generate_plan(profile, activity_input)

            plan_id = PlanModel.create_plan(
                user_id=user_id,
                activity_input=activity_input,
                generated_plan=result['plan'],
                ai_model_used=result['model_used'],
                generation_time_ms=result['generation_time_ms'],
            )

            plan = PlanModel.get_by_id(plan_id)
            return {
                'message': 'Plan generated successfully',
                'plan': serialize_doc(plan),
            }, 201

        except Exception as e:
            return {'error': f'Failed to generate plan: {str(e)}'}, 500

    @staticmethod
    def get_plan(plan_id, user_id):
        plan = PlanModel.get_by_id(plan_id)
        if not plan:
            return {'error': 'Plan not found'}, 404
        if str(plan['user_id']) != user_id:
            return {'error': 'Unauthorized'}, 403
        return {'plan': serialize_doc(plan)}, 200

    @staticmethod
    def get_user_plans(user_id, page=1, per_page=10):
        result = PlanModel.get_user_plans(user_id, page, per_page)
        result['plans'] = [serialize_doc(p) for p in result['plans']]
        return result, 200

    @staticmethod
    def delete_plan(plan_id, user_id):
        deleted = PlanModel.delete_plan(plan_id, user_id)
        if not deleted:
            return {'error': 'Plan not found or unauthorized'}, 404
        return {'message': 'Plan deleted successfully'}, 200
