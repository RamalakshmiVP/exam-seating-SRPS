import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentLogin() {
  const [regNo, setRegNo] = useState("");
  const [dob, setDob] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://127.0.0.1:5000/api/login/student", {
        reg_no: regNo,
        dob: dob
      });

      navigate("/student-dashboard", {
        state: { name: res.data.name }
      });
    } catch {
      alert("Invalid Credentials");
    }
  };

  return (
    <>
      <input placeholder="Register No" onChange={e => setRegNo(e.target.value)} />
      <input type="date" onChange={e => setDob(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </>
  );
}
