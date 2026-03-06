from flask import Blueprint, jsonify, request
from database import get_connection

timetable_bp = Blueprint("timetable", __name__, url_prefix="/api/timetable")

@timetable_bp.route("", methods=["GET"])
@timetable_bp.route("/", methods=["GET"])
def get_timetable():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            id,
            exam_date,
            exam_time,
            department_name,
            semester,
            subject_name,
            hall_name
        FROM timetable
        ORDER BY exam_date, exam_time;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    timetable = [
        {
            "id": r[0],
            "date": str(r[1]) if r[1] else None,
            "time": str(r[2]) if r[2] else None,
            "department": r[3],
            "semester": r[4],
            "subject": r[5],
            "hall": r[6]
        }
        for r in rows
    ]

    return jsonify({
        "status": "success",
        "timetable": timetable
    })


@timetable_bp.route("", methods=["POST"])
def add_timetable():
    data = request.json
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        INSERT INTO timetable (exam_date, exam_time, department_name, semester, subject_name, hall_name)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id;
    """, (
        data.get("date"),
        data.get("time"),
        data.get("department"),
        data.get("semester"),
        data.get("subject"),
        data.get("hall")
    ))

    new_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Timetable entry added",
        "id": new_id
    })


@timetable_bp.route("/<int:id>", methods=["PUT"])
def update_timetable(id):
    data = request.json
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE timetable
        SET exam_date = %s,
            exam_time = %s,
            department_name = %s,
            semester = %s,
            subject_name = %s,
            hall_name = %s
        WHERE id = %s
    """, (
        data.get("date"),
        data.get("time"),
        data.get("department"),
        data.get("semester"),
        data.get("subject"),
        data.get("hall"),
        id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Timetable entry updated"
    })


@timetable_bp.route("/<int:id>", methods=["DELETE"])
def delete_timetable(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM timetable WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Timetable entry deleted"
    })

