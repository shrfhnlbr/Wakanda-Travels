from api.v1.models import db
from datetime import datetime


class Review(db.Model):
    """Review Model"""

    id = db.Column(
        db.Integer, nullable=False, primary_key=True, unique=True, autoincrement=True
    )
    user = db.Column(db.String(20), nullable=False, default="Anonymous")
    place_id = db.Column(db.Integer, db.ForeignKey("place.id"), nullable=False)
    text = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())
