from flask import jsonify, request
from api.v1.constants.http_status_code import (
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_409_CONFLICT,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK,
    HTTP_401_UNAUTHORIZED,
)
import validators
from api.v1.models.user import User
from bcrypt import hashpw, checkpw, gensalt
from api.v1.models import db
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt_identity,
)
from api.v1.integrations.open_trip_map import get_location_by_area


class AuthService:
    """Services for all Auth endpoints"""

    @staticmethod
    def signup():
        try:
            username = request.json.get("username")
            email = request.json.get("email")
            password = request.json.get("password")
            confirm_password = request.json.get("c_password")

            if (
                username is None
                or email is None
                or password is None
                or confirm_password is None
            ):
                return (
                    jsonify({"error": "Incomplete request parameters!"}),
                    HTTP_400_BAD_REQUEST,
                )

            if confirm_password != password:
                return (
                    jsonify({"error": "Password does not match."}),
                    HTTP_400_BAD_REQUEST,
                )
            elif len(password) < 6:
                return (
                    jsonify({"error": "Password is too short."}),
                    HTTP_400_BAD_REQUEST,
                )

            if len(username) < 4:
                return (
                    jsonify({"error": "Username is too short."}),
                    HTTP_400_BAD_REQUEST,
                )

            if not username.isalnum():
                return (
                    jsonify({"error": "Username should be alphanumeric."}),
                    HTTP_400_BAD_REQUEST,
                )
            if not validators.email(email):
                return jsonify({"error": "Email is not valid"}), HTTP_400_BAD_REQUEST

            if User.query.filter_by(email=email).first() is not None:
                return jsonify({"error": "Email is taken"}), HTTP_409_CONFLICT

            if User.query.filter_by(username=username).first() is not None:
                return jsonify({"error": "Username is taken"}), HTTP_409_CONFLICT

            pwd_hash = hashpw(password.encode("utf-8"), gensalt())
            user = User(email=email, username=username, password=pwd_hash)

            db.session.add(user)
            db.session.commit()
            return (
                jsonify(
                    {
                        "message": "User created",
                        "data": {"username": username, "email": email},
                    }
                ),
                HTTP_201_CREATED,
            )
        except Exception as e:
            print(e)
            return (
                jsonify({"error": "An error occured!"}),
                HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def login():
        get_location_by_area()
        try:
            email = request.json.get("email", "")
            password = request.json.get("password", "")
            user = User.query.filter_by(email=email).first()
            if user:
                check_password = checkpw(
                    bytes(password, "utf-8"), bytes(user.password, "utf-8")
                )

                if check_password:
                    refresh_token = create_refresh_token(user.id)
                    access_token = create_access_token(user.id)
                return (
                    jsonify(
                        {
                            "data": {
                                "refresh": refresh_token,
                                "access": access_token,
                                "username": user.username,
                                "email": user.email,
                            }
                        }
                    ),
                    HTTP_200_OK,
                )
            return jsonify({"error": "Invalid Credentials."}), HTTP_401_UNAUTHORIZED

        except Exception as e:
            print(e)
            return (
                jsonify({"error": "An error occured!"}),
                HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def me():
        try:
            user_id = get_jwt_identity()

            user = User.query.filter_by(id=user_id).first()
            return (
                jsonify({"username": user.username, "email": user.email}),
                HTTP_200_OK,
            )
        except Exception as e:
            print(e)
            return (
                jsonify({"error": "An error occured!"}),
                HTTP_500_INTERNAL_SERVER_ERROR,
            )

    @staticmethod
    def refresh():
        identity = get_jwt_identity()
        access_token = create_access_token(identity)

        return jsonify({"access": access_token}), HTTP_200_OK
