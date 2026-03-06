from flask import Blueprint, jsonify
from database import get_connection

rooms_bp = Blueprint("rooms", __name__, url_prefix="/api/rooms")

@rooms_bp.route("", methods=["GET"])
@rooms_bp.route("/", methods=["GET"])
def get_rooms():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            hall_name,
            col_a, col_b, col_c, col_d, col_e,
            col_f, col_g, col_h, col_i, col_j,
            total
        FROM rooms
        ORDER BY id;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    rooms = [
        {
            "id": r[0],
            "room_no": r[1],
            "hall_name": r[1],  # Include hall_name for frontend compatibility
            "A": r[2],
            "B": r[3],
            "C": r[4],
            "D": r[5],
            "E": r[6],
            "F": r[7],
            "G": r[8],
            "H": r[9],
            "I": r[10],
            "J": r[11],
            "capacity": r[12]
        }
        for r in rows
    ]

    return jsonify({
        "status": "success",
        "count": len(rooms),
        "rooms": rooms
    })