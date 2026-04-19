from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS

from app.config import config
from app.extensions import mongo, jwt


def create_app(config_name='development'):
    load_dotenv()

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    CORS(app)
    mongo.init_app(app)
    jwt.init_app(app)

    from app.routes.auth import auth_bp
    from app.routes.profile import profile_bp
    from app.routes.plans import plans_bp
    from app.routes.feedback import feedback_bp
    from app.routes.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/api/v1/auth')
    app.register_blueprint(profile_bp, url_prefix='/api/v1/profile')
    app.register_blueprint(plans_bp, url_prefix='/api/v1/plans')
    app.register_blueprint(feedback_bp, url_prefix='/api/v1/feedback')
    app.register_blueprint(admin_bp, url_prefix='/api/v1/admin')

    return app
