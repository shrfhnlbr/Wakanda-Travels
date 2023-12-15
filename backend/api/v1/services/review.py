from flask import jsonify, request
from api.v1.constants.http_status_code import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK,
    HTTP_401_UNAUTHORIZED,
)
from api.v1.models.user import User
from api.v1.models.review import Review
from flask_jwt_extended import get_jwt_identity


class ReviewService:
    """Services for all Auth endpoints"""

    @staticmethod
    def add_review():
        try:
            review = request.json.get("review")
            place_id = request.json.get("place_id")
            return (
                jsonify(),
                HTTP_201_CREATED,
            )
        except Exception as e:
            return (
                jsonify({"error": "An error occured!"}),
                HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def get_review():
        user_id = get_jwt_identity()
        try:
            return jsonify({"error": "Invalid Credentials."}), HTTP_401_UNAUTHORIZED

        except Exception as e:
            return (
                jsonify({"error": "An error occured!"}),
                HTTP_500_INTERNAL_SERVER_ERROR,
            )
