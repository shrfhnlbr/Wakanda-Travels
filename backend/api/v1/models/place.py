from api.v1.models import db
from datetime import datetime


class Place(db.Model):
    """Review Model"""

    id = db.Column(
        db.Integer, nullable=False, primary_key=True, unique=True, autoincrement=True
    )
    name = db.Column(db.String(400), nullable=False)
    location = db.Column(db.Text, nullable=False)
    place_id = db.Column(db.String(20), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    created_at = db.Column(db.DateTime, default=datetime.now())
    updated_at = db.Column(db.DateTime, onupdate=datetime.now())

    @property
    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "location": self.location,
            "place_id": self.place_id,
        }
