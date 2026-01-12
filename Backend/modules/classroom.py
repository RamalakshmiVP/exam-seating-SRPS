from flask import Blueprint, jsonify
from data.rooms import rooms

rooms_bp = Blueprint("rooms", __name__, url_prefix="/api/rooms")

@rooms_bp.route("", methods=["GET"])
def get_rooms():
    return jsonify(rooms)
