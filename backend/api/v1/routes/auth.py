from flask import Blueprint
from api.v1.models.user import User
from api.v1.models import db
from api.v1.controllers.auth import AuthController
from flask_jwt_extended import jwt_required


# Define Blueprint
auth = Blueprint("auth", __name__, url_prefix="/api/v1/auth")


@auth.post("/register", strict_slashes=False)
def register():
    return AuthController.signup()


@auth.post("/login")
def login():
    return AuthController.login()


@auth.get("/me")
@jwt_required()
def me():
    return AuthController.me()


@auth.get("/token/refresh")
@jwt_required(refresh=True)
def refresh():
    return AuthController.refresh()