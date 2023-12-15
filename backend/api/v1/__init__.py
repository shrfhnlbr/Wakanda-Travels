from flask import Flask
import os
from api.v1.routes.auth import auth
from api.v1.routes.review import review
from api.v1.routes.places import places
from api.v1.models import db
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from dotenv import load_dotenv


def create_app(test_config=None):
    """Initialize app creation"""
    app = Flask(__name__, instance_relative_config=True)
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    load_dotenv('.env')
    if test_config is None:
        app.config.from_mapping(
            SECRET_KEY=os.environ.get("SECRET_KEY"),
            SQLALCHEMY_DATABASE_URI=os.environ.get("SQLALCHEMY_DATABASE_URI"),
            SQLALCHEMY_TRACK_MODIFICATIONS=False,
            JWT_SECRET_KEY=os.environ.get("JWT_SECRET_KEY"),
        )

    else:
        app.config.from_mapping(test_config)

    db.app = app
    db.init_app(app)

    JWTManager(app)

    app.register_blueprint(auth)
    app.register_blueprint(review)
    app.register_blueprint(places)

    return app
