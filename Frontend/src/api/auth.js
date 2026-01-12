const BASE_URL = "http://127.0.0.1:5000/api";

// ADMIN LOGIN
export const adminLogin = async (data) => {
  const res = await fetch(`${BASE_URL}/login/admin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
};

// GET STAFF
export const getStaff = async () => {
  const res = await fetch(`${BASE_URL}/staff`);
  return res.json();
};

// GET STUDENTS
export const getStudents = async () => {
  const res = await fetch(`${BASE_URL}/students`);
  return res.json();
};

// GENERATE SEATING
export const generateSeating = async () => {
  const res = await fetch(`${BASE_URL}/seating/generate`);
  return res.json();
};
