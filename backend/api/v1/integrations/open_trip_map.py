import requests
from requests.exceptions import HTTPError
from geopy.geocoders import Nominatim
import os


BASE_URL = os.environ.get("OPENTRIPMAP_BASE_URL")
API_KEY = os.environ.get("OPENTRIPMAP_API_KEY")


def get_location_by_area():
    geolocator = Nominatim(user_agent="Tembea")
    location = geolocator.geocode("Abuja,Nigeria")

    print("{}".format(location.latitude))
    print("{}".format(location.longitude))


def get_destination_by_bbox(bbox):
    """Get destinations by Bounding Box"""
    bbox_url = "{}/en/places/bbox".format(BASE_URL)
    try:
        response = requests.get(
            bbox_url,
            params={
                "apikey": API_KEY,
                "lon_min": bbox[0],
                "lon_max": bbox[2],
                "lat_min": bbox[1],
                "lat_max": bbox[3],
                "kinds": "amusements,cultural,tourist_facilities,natural",
                "limit": 100,
            },
        )
        return {"data": response.json()}
    except HTTPError as http_err:
        print(f"Error {http_err}")
        return http_err
    except Exception as err:
        print(f"Error {err}")
        return err


def get_destination_by_id(id):
    """Get destinations by Bounding Box"""
    request_url = f"{BASE_URL}/en/places/xid/{id}"
    try:
        response = requests.get(
            request_url,
            params={
                "apikey": API_KEY,
            },
        )
        return {"data": response.json()}
    except HTTPError as http_err:
        print(f"Error {http_err}")
        return http_err
    except Exception as err:
        print(f"Error {err}")
        return err
