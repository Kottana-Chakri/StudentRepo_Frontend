import { useState } from "react";
import { getStudentById } from "../api";

function GetStudentById() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!studentId.trim()) {
      setError("Please enter a student ID.");
      setStudent(null);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await getStudentById(studentId);
      setStudent(data);
    } catch (err) {
      setError(err.message || "Failed to fetch student.");
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>2. Get student by ID</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          type="number"
          min="1"
          value={studentId}
          onChange={(event) => setStudentId(event.target.value)}
          placeholder="Student ID"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Loading..." : "GET By ID"}
        </button>
      </form>

      {error && <p className="error-text">{error}</p>}

      {student && (
        <div className="student-result">
          <p>
            <strong>ID:</strong> {student.id}
          </p>
          <p>
            <strong>Name:</strong> {student.name}
          </p>
          <p>
            <strong>Age:</strong> {student.age}
          </p>
          <p>
            <strong>Email:</strong> {student.email}
          </p>
          <p>
            <strong>Phone:</strong> {student.phoneNumber}
          </p>
          <p>
            <strong>Course:</strong> {student.course || "N/A"}
          </p>
        </div>
      )}
    </section>
  );
}

export default GetStudentById;
