from flask import Blueprint, jsonify
from database import get_connection

staff = Blueprint("staff", __name__, url_prefix="/api/staff")

@staff.route("", methods=["GET"])
@staff.route("/", methods=["GET"])
def get_staff():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            staff_name,
            gender,
            department_name,
            mail,
            mobile
        FROM staff
        ORDER BY staff_name;
    """)

    rows = cur.fetchall()

    cur.close()
    conn.close()

    staff_list = []
    for r in rows:
        staff_list.append({
            "id": r[0],
            "staff_name": r[1],
            "gender": r[2],
            "department_name": r[3],
            "mail": r[4],
            "mobile": r[5]
        })

    return jsonify({"staff": staff_list})