from flask import Blueprint
from flask_jwt_extended import jwt_required
from api.v1.controllers.places import PlacesController


places = Blueprint("places", __name__, url_prefix="/api/v1/places")


@places.get("/countries")
def get_countries():
    """Get All African Countries"""
    return PlacesController.get_countries()


@places.get("/destinations")
def get_destinations():
    """Get list of destinations for a particular country"""
    return PlacesController.get_destinations()


@places.get("/destinations/<id>")
def get_destinations_by_id(id):
    """Get list of destinations for a particular country"""
    return PlacesController.get_destination_by_id(id)


@places.post("/destinations")
@jwt_required()
def save_destination():
    """Save a destination for a user"""
    return PlacesController.save_destination()


@places.get("/destinations/saved")
@jwt_required()
def get_saved_destination():
    """Get users Saved destinations"""
    return PlacesController.get_saved_destination()

@places.get("/destinations/booking")
def get_booking_sites():
    """Get booking sites route"""
    return PlacesController.get_booking_sites()