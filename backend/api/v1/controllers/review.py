from api.v1.services.review import ReviewService


class ReviewController:
    """Controller for all Auth endpoints"""

    @staticmethod
    def add_review():
        return ReviewService.add_review()

    @staticmethod
    def get_review():
        return ReviewService.get_review()
