from api.v1.services.auth import AuthService


class AuthController:
    """Controller for all Auth endpoints"""

    @staticmethod
    def signup():
        return AuthService.signup()

    @staticmethod
    def login():
        return AuthService.login()

    @staticmethod
    def me():
        return AuthService.me()

    @staticmethod
    def refresh():
        return AuthService.refresh()
