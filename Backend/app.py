from flask import Flask
from flask_cors import CORS

from modules.users import users
from modules.seating import seating
from modules.staff import staff
from modules.students import students_bp
from modules.classroom import rooms_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(users)
app.register_blueprint(seating)
app.register_blueprint(staff)
app.register_blueprint(students_bp)
app.register_blueprint(rooms_bp) 
@app.route("/")
def home():
    return {"status": "Backend Running"}

if __name__ == "__main__":
    app.run(debug=True)
