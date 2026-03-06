from flask import Blueprint, request, jsonify
from data.admin import admin
from data.Staff import staff_list
# from data.Student import students

users = Blueprint("users", __name__, url_prefix="/api")

# 🔐 TEMP ADMIN CREDENTIALS
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD = "admin123"

@users.route("/login/admin", methods=["POST"])
def admin_login():
    data = request.json

    if not data:
        return jsonify({"status": "fail", "message": "No data"}), 400

    if (
        data.get("username") == ADMIN_USERNAME
        and data.get("password") == ADMIN_PASSWORD
    ):
        return jsonify({
            "status": "success",
            "role": "admin",
            "name": "Administrator"
        })

    return jsonify({
        "status": "fail",
        "message": "Invalid username or password"
    }), 401
# ================= STAFF LOGIN =================
@users.route("/login/staff", methods=["POST"])
def staff_login():
    data = request.json

    for staff in staff_list:
        if (
            staff["phone"] == data.get("phone")
            and staff["password"] == data.get("password")
        ):
            return jsonify({
                "status": "success",
                "role": "staff",
                "name": staff["name"]
            })

    return jsonify({"status": "fail", "message": "Invalid credentials"}), 401


# ============ STAFF CHANGE PASSWORD ============
@users.route("/change-password/staff", methods=["POST"])
def change_staff_password():
    data = request.json

    for staff in staff_list:
        if (
            staff["phone"] == data.get("phone")
            and staff["password"] == data.get("old_password")
        ):
            staff["password"] = data.get("new_password")
            return jsonify({"status": "success"})

    return jsonify({
        "status": "fail",
        "message": "Old password incorrect"
    }), 401


# ================= STUDENT LOGIN =================
# @users.route("/login/student", methods=["POST"])
# def student_login():
#     data = request.json

#     for s in students:
#         if (
#             s["register_no"] == data.get("reg_no")
#             and s["dob"] == data.get("dob")
#         ):
#             return jsonify({
#                 "status": "success",
#                 "role": "student",
#                 "name": s["student_name"]
#             })

#     return jsonify({"status": "fail", "message": "Invalid credentials"}), 401
