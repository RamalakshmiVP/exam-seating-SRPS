from flask import Blueprint, jsonify, request
from database import get_connection

students_bp = Blueprint("students", __name__, url_prefix="/api")

# ================= FETCH ALL STUDENTS =================
@students_bp.route("/students", methods=["GET"])
@students_bp.route("/students/", methods=["GET"])
def get_students():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT
            student_id,
            "Register_No",
            "Student_Name",
            "DOB",
            "Mobile",
            "Semester",
            "Section",
            "Department_Name",
            "Gender",
            "Degree",
            "Batch"
        FROM student
        ORDER BY student_id;
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    students = [
        {
            "id": r[0],
            "register_no": r[1],
            "student_name": r[2],
            "dob": str(r[3]) if r[3] else None,
            "mobile": r[4],
            "semester": r[5],
            "section": r[6],
            "department_name": r[7],
            "gender": r[8],
            "degree": r[9],
            "batch": r[10]
        }
        for r in rows
    ]

    return jsonify({
        "status": "success",
        "count": len(students),
        "students": students
    })


# ================= UPDATE STUDENT =================
@students_bp.route("/students/<int:id>", methods=["PUT"])
def update_student(id):
    data = request.json

    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        UPDATE student
        SET
            "Student_Name" = %s,
            "Mobile" = %s,
            "Semester" = %s
        WHERE student_id = %s
    """, (
        data.get("student_name"),
        data.get("mobile"),
        data.get("semester"),
        id
    ))

    conn.commit()
    cur.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Student updated"
    })


# ================= FETCH DEPARTMENTS =================
@students_bp.route("/students/departments", methods=["GET"])
def get_departments():
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("""
        SELECT DISTINCT "Department_Name"
        FROM student
        ORDER BY "Department_Name";
    """)

    rows = cur.fetchall()
    cur.close()
    conn.close()

    departments = [r[0] for r in rows]

    return jsonify({
        "status": "success",
        "departments": departments
    })


# ================= DELETE STUDENT =================
@students_bp.route("/students/<int:id>", methods=["DELETE"])
def delete_student(id):
    conn = get_connection()
    cur = conn.cursor()

    cur.execute("DELETE FROM student WHERE student_id = %s", (id,))
    conn.commit()

    cur.close()
    conn.close()

    return jsonify({
        "status": "success",
        "message": "Student deleted"
    })