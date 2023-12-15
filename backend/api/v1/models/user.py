# from models import Base
from api.v1.models import db
from datetime import datetime


class User(db.Model):
    """User Model"""

    id = db.Column(
        db.Integer, nullable=False, primary_key=True, unique=True, autoincrement=True
    )
    email = db.Column(db.String(250), nullable=False, unique=True)
    username = db.Column(db.String(100), nullable=False, unique=True)
    password = db.Column(db.String(250), nullable=True)
    reset_token = db.Column(db.String(250), nullable=True)
    saved_places = db.relationship('Place', backref='user')
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
