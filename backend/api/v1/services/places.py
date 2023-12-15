from api.v1.constants.countries import countries
from flask import jsonify, request
from api.v1.constants.http_status_code import (
    HTTP_200_OK,
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
)
from country_bounding_boxes import country_subunits_by_iso_code
from api.v1.integrations.open_trip_map import (
    get_destination_by_bbox,
    get_destination_by_id,
)
from api.v1.models.place import Place
from api.v1.models import db
from flask_jwt_extended import get_jwt_identity
from api.v1.models.user import User
from api.v1.constants.booking import bookings


class PlacesService:
    """Services for all place and destination related endpoint"""

    @staticmethod
    def get_countries():
        """Get All African Countries"""
        # return jsonify(countries)
        country_list = []
        for key, value in countries.items():
            country_list.append(
                {
                    "country_code": key,
                    "country_name": value.get("Country Name"),
                }
            )
        return (
            jsonify(
                {"data": country_list, "message": "Country List Fetched Sucessfully"}
            ),
            HTTP_200_OK,
        )

    @staticmethod
    def get_destinations():
        """Get Destinations within country bbox"""
        country_code = request.args.get("country_code")
        coordinates = [c.bbox for c in country_subunits_by_iso_code(country_code)]
        print(coordinates)
        return get_destination_by_bbox(coordinates[0])

    @staticmethod
    def get_destination_by_id(id):
        """Get Destinations within country bbox"""
        return get_destination_by_id(id)

    @staticmethod
    def save_destination():
        """Save a destination for a user"""
        user_id = get_jwt_identity()
        try:
            user = User.query.filter_by(id=user_id).first()
            id = request.json.get("id")
            print(id)
            if id is None:
                return jsonify({"error": "id is required"}), HTTP_400_BAD_REQUEST
            response = get_destination_by_id(id).get("data")
            error = response.get("error")
            if response.get("error"):
                raise Exception(f"{error}")

            place = Place(
                place_id=response.get("xid"),
                location=response["address"]["country"],
                name=response["name"],
                user_id=user.id,
            )
            db.session.add(place)
            db.session.commit()

            return (
                jsonify(
                    {"status": "Success", "message": "Destination saved successfully"}
                ),
                HTTP_201_CREATED,
            )
        except Exception as e:
            return jsonify({"error": f"{e}"})

    @staticmethod
    def get_saved_destination():
        """Get a users saved destination"""
        user_id = get_jwt_identity()

        places = Place.query.filter_by(user_id=user_id).all()
        places = [place.serialize for place in places]
        if places is None:
            return jsonify({"data": []})

        print(places)
        return jsonify(data=places)

    @staticmethod
    def get_booking_sites():
        return jsonify({"data": bookings}), HTTP_200_OK
