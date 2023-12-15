from flask import Blueprint
from api.v1.controllers.review import ReviewController

review = Blueprint("review", __name__, url_prefix="/api/v1/review")


@review.post("/", strict_slashes=False)
def add_review():
    return ReviewController.add_review()


@review.get("/")
def get_review():
    return ReviewController.get_review()
