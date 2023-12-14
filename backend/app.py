# #!/usr/bin/python3
# # Libraries for Google Authentication using Flask Blueprint
# import pathlib
# import os
# from dotenv import load_dotenv
# from google.oauth2 import id_token
# from google_auth_oauthlib.flow import Flow
# from pip._vendor import cachecontrol
# import google.auth.transport.requests

# # from oauthlib.oauth2 import WebApplicationClient
# # Flask libraries
# # Flask libraries
# from flask import Flask, Blueprint, redirect, render_template, request, session, abort
# from flask_login import current_user, login_user, logout_user
# import requests

# # Models libraries
# from api.v1.models import db
# from api.v1.models.user import User

# # Define Blueprint
# auth = Blueprint("auth", __name__, url_prefix="/auth")

# load_dotenv()

# # Load environment variables
# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
# GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
# GOOGLE_CLIENT_SECRET = os.environ.get("GOOGLE_CLIENT_SECRET", None)
# GOOGLE_DISCOVERY_URL = "https://accounts.google.com/.well-known/openid-configuration"


# # Initialize app
# app = Flask(__name__)
# # app.secret_key = GOOGLE_CLIENT_SECRET
# app.secret_key = os.environ.get("SECRET_KEY") or os.urandom(24)

# # Allow http traffic for local dev
# os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

# # Define Google client ID, secrets file, and flow object for authentication
# GOOGLE_CLIENT_ID = GOOGLE_CLIENT_ID
# client_secrets_file = os.path.join(pathlib.Path(__file__).parent, "client_secret.json")

# flow = Flow.from_client_secrets_file(
#     client_secrets_file=client_secrets_file,
#     scopes=[
#         "https://www.googleapis.com/auth/userinfo.profile",
#         "https://www.googleapis.com/auth/userinfo.email",
#         "openid",
#     ],
#     redirect_uri="http://127.0.0.1:5000/login/callback",
# )


# @auth.get("/home-page")
# def signin():
#     print(auth)
#     return render_template("home-page.html", user=current_user)


# # Initiate Google Auth
# @auth.get("/login", strict_slashes=False)
# def login():
#     """Check user login"""
#     authorization_url, state = flow.authorization_url()
#     session["state"] = state
#     return redirect(authorization_url)


# # Google OAuth2 callback function to login user
# @auth.route("/login/callback")
# def callback():
#     """Initiate Google OAuth2 flow"""
#     flow.fetch_token(authorization_response=request.url)

#     if not session["state"] == request.args["state"]:
#         abort(500)  # State does not match!

#     credentials = flow.credentials
#     request_session = requests.session()
#     cached_session = cachecontrol.CacheControl(request_session)
#     token_request = google.auth.transport.requests.Request(session=cached_session)

#     id_info = id_token.verify_oauth2_token(
#         id_token=credentials._id_token, request=token_request, audience=GOOGLE_CLIENT_ID
#     )

#     # Check if user with same google id already exists
#     user = User.query.filter_by(google_id=id_info.get("sub")).first()

#     # Log in user if user exists
#     if user:
#         login_user(user)
#         return redirect("/")

#     # Create a new User if google_id is not in database
#     new_user = User(
#         google_id=id_info.get("sub"),
#         name=id_info.get("name"),
#         email=id_info.get("email"),
#         avatar_url=id_info.get("picture"),
#     )
#     db.session.add(new_user)
#     db.session.commit()

#     # Log in new user
#     login_user(new_user)
#     return redirect("/")


# # Route to log out user
# @auth.route("/logout")
# def logout():
#     logout_user()
#     return redirect("/")


# @auth.route("/")
# def index():
#     if "google_id" in session:
#         return redirect("/")
#     else:
#         return render_template("index.html", user=current_user)

from api.v1 import create_app, db

if __name__ == "__main__":
    create_app()
    db.create_all()
else:
    app = create_app()
    # app.run(host="0.0.0.0", port=5000, debug=True, load_dotenv=True)
