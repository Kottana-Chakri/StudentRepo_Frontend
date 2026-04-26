import { useState } from "react";
import { deleteStudentById, getStudentById } from "../api";

function DeleteStudent() {
  const [studentId, setStudentId] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedId = studentId.trim();

    if (!trimmedId) {
      setFeedback("Please enter a student ID.");
      setIsError(true);
      return;
    }

    if (!/^\d+$/.test(trimmedId) || Number(trimmedId) <= 0) {
      setFeedback("Student ID must be a positive number.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setFeedback("");
    setIsError(false);

    try {
      await getStudentById(trimmedId);
      await deleteStudentById(trimmedId);
      setFeedback("Student deleted successfully.");
      setStudentId("");
    } catch (err) {
      if (err.status === 404) {
        setFeedback("Student ID not found. Please enter the correct ID to delete data.");
      } else {
        setFeedback(err.message || "Failed to delete student.");
      }
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>5. Delete a student</h2>
      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          id="delete-student-id"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={studentId}
          onChange={(event) =>
            setStudentId(event.target.value.replace(/\D/g, ""))
          }
          placeholder="Student ID"
        />
        <button type="submit" disabled={loading}>
          {loading ? "Deleting..." : "DELETE"}
        </button>
      </form>

      {feedback && (
        <p className={isError ? "error-text" : "success-text"}>{feedback}</p>
      )}
    </section>
  );
}

export default DeleteStudent;
