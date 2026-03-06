from flask import Blueprint, jsonify
from database import get_connection

from algorithms.graph_coloring import apply_graph_coloring
from algorithms.seating_algo import generate_seating
from algorithms.constraints import validate_seating

seating = Blueprint("seating", __name__, url_prefix="/api/seating")


# ================= FETCH STUDENTS FROM DB =================
def fetch_students():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            student_id,
            "Register_No",
            "Department_Name",
            "Semester",
            "Gender"
        FROM student
        ORDER BY student_id;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    students = []
    for r in rows:
        students.append({
            "id": r[0],
            "register_no": r[1],
            "department": r[2],
            "semester": r[3],
            "gender": r[4]
        })

    return students


# ================= FETCH ROOMS FROM DB =================
def fetch_rooms():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            hall_name,
            "A","B","C","D","E","F","G","H","I","J",
            capacity
        FROM rooms
        ORDER BY hall_name;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    rooms = []
    for r in rows:
        rooms.append({
            "hall_name": r[0],
            "A": r[1],
            "B": r[2],
            "C": r[3],
            "D": r[4],
            "E": r[5],
            "F": r[6],
            "G": r[7],
            "H": r[8],
            "I": r[9],
            "J": r[10],
            "capacity": r[11]
        })

    return rooms


# ================= GENERATE SEATING =================
@seating.route("/generate", methods=["GET"])
def generate():
    students = fetch_students()
    rooms = fetch_rooms()

    if len(students) == 0 or len(rooms) == 0:
        return jsonify({
            "status": "fail",
            "message": "Students or Rooms data missing"
        }), 400

    # STEP 1: Graph Coloring
    colored_students = apply_graph_coloring(students)

    # STEP 2: Seating Allocation
    seating_plan = generate_seating(colored_students, rooms)

    # STEP 3: Constraint Validation
    if not validate_seating(seating_plan, rooms):
        return jsonify({
            "status": "fail",
            "message": "Invalid seating arrangement"
        }), 400

    return jsonify({
        "status": "success",
        "total_students": len(students),
        "total_rooms": len(rooms),
        "seating_plan": seating_plan
    })