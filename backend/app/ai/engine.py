import json
import time

from openai import OpenAI
from flask import current_app

from app.ai.prompt_builder import PromptBuilder
from app.ai.context_builder import ContextBuilder
from app.ai.response_parser import ResponseParser
from app.ai.plan_enricher import PlanEnricher


class AIEngine:

    def __init__(self):
        self.client = OpenAI(api_key=current_app.config.get('OPENAI_API_KEY'))
        self.model = 'gpt-4o'
        self.prompt_builder = PromptBuilder()
        self.context_builder = ContextBuilder()
        self.response_parser = ResponseParser()
        self.plan_enricher = PlanEnricher()

    def generate_plan(self, user_profile, activity_input):
        start_time = time.time()

        try:
            context = self.context_builder.build_context(user_profile, activity_input)
            messages = self.prompt_builder.build_prompt(context)

            response = self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                temperature=0.7,
                response_format={'type': 'json_object'},
            )

            raw_response = response.choices[0].message.content
            parsed_plan = self.response_parser.parse_response(raw_response)
            enriched_plan = self.plan_enricher.enrich_plan(parsed_plan, activity_input)

            generation_time_ms = int((time.time() - start_time) * 1000)

            return {
                'plan': enriched_plan,
                'model_used': self.model,
                'generation_time_ms': generation_time_ms,
            }

        except Exception as e:
            generation_time_ms = int((time.time() - start_time) * 1000)
            return {
                'plan': {
                    'title': 'Plan Generation Failed',
                    'summary': f'Unable to generate plan: {str(e)}',
                    'steps': [],
                    'error': True,
                },
                'model_used': self.model,
                'generation_time_ms': generation_time_ms,
            }
