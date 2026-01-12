from flask import Blueprint, jsonify
from data.Student import students
from data.rooms import rooms

from algorithms.graph_coloring import apply_graph_coloring
from algorithms.seating_algo import generate_seating
from algorithms.constraints import validate_seating

seating = Blueprint("seating", __name__, url_prefix="/api/seating")

@seating.route("/generate", methods=["GET"])
def generate():
    colored_students = apply_graph_coloring(students)
    plan = generate_seating(colored_students, rooms)

    if not validate_seating(plan, rooms):
        return jsonify({
            "status": "fail",
            "message": "Invalid seating"
        })

    return jsonify({
        "status": "success",
        "seating_plan": plan
    })
