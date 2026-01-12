from flask import Blueprint, jsonify
from data.Student import students

students_bp = Blueprint("students", __name__, url_prefix="/api/students")

@students_bp.route("/", methods=["GET"])
def get_students():
    return jsonify({"students": students})
