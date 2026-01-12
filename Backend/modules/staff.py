from flask import Blueprint, jsonify
from data.Staff import staff_list

staff = Blueprint("staff", __name__, url_prefix="/api/staff")

@staff.route("/", methods=["GET"])
def get_staff():
    return jsonify({"staff": staff_list})
