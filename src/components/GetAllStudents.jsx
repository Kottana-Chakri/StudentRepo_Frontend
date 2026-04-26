import { useState, useEffect } from "react";
import { getAllStudents } from "../api";

function GetAllStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getAllStudents()
      .then((data) => setStudents(data))
      .catch((error) => setError(error.message));
  }, []);

  const handleGetAll = () => {
    setLoading(true);
    setError("");
    getAllStudents()
      .then((data) => {
        setStudents(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  };

  return (
    <section className="panel">
      <h2>1. Get all students</h2>
      {error && <p className="error-text">{error}</p>}

      <button onClick={handleGetAll} disabled={loading} style={{ marginBottom: '15px', width: '100%' }}>
        {loading ? 'Loading...' : 'GET ALL'}
      </button>

      {students.length > 0 && (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Age</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Course</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.id}</td>
                  <td>{student.name}</td>
                  <td>{student.age}</td>
                  <td>{student.email}</td>
                  <td>{student.phoneNumber}</td>
                  <td>{student.course || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default GetAllStudents;
