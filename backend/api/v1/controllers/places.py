from api.v1.services.places import PlacesService


class PlacesController:
    """Controller for all place and destination related endpoint"""

    @staticmethod
    def get_countries():
        """Get All African Countries"""
        return PlacesService.get_countries()

    @staticmethod
    def get_destinations():
        """Get All African Countries"""
        return PlacesService.get_destinations()

    @staticmethod
    def get_destination_by_id(id):
        """Get All African Countries"""
        return PlacesService.get_destination_by_id(id)

    @staticmethod
    def save_destination():
        """Get All African Countries"""
        return PlacesService.save_destination()

    @staticmethod
    def get_saved_destination():
        """Get User Saved Destination"""
        return PlacesService.get_saved_destination()

    @staticmethod
    def get_booking_sites():
        return PlacesService.get_booking_sites()
