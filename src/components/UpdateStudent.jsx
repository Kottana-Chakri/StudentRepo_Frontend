import { useState, useEffect } from "react";
import { updateStudent, getCourses } from "../api";

const initialFormState = {
  id: "",
  name: "",
  age: "",
  email: "",
  phoneNumber: "",
  course: "",
};

function UpdateStudent() {
  const [formData, setFormData] = useState(initialFormState);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "id" || name === "age") {
      setFormData((prev) => ({ ...prev, [name]: value.replace(/\D/g, "") }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedId = formData.id.trim();

    if (!trimmedId) {
      setFeedback("Student ID is required.");
      setIsError(true);
      return;
    }

    if (!/^\d+$/.test(trimmedId) || Number(trimmedId) <= 0) {
      setFeedback("Student ID must be a positive number.");
      setIsError(true);
      return;
    }

    if (formData.age.trim() && Number(formData.age) <= 0) {
      setFeedback("Age must be a positive number.");
      setIsError(true);
      return;
    }

    if (formData.email.trim() && !formData.email.trim().includes("@")) {
      setFeedback("Email must contain @.");
      setIsError(true);
      return;
    }

    if (formData.phoneNumber.trim() && !/^\d{10}$/.test(formData.phoneNumber.trim())) {
      setFeedback("Phone number must be exactly 10 digits.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setFeedback("");
    setIsError(false);

    try {
      const payload = {
        id: Number(trimmedId),
      };

      if (formData.name.trim()) {
        payload.name = formData.name.trim();
      }

      if (formData.age.trim()) {
        payload.age = Number(formData.age.trim());
      }

      if (formData.email.trim()) {
        payload.email = formData.email.trim();
      }

      if (formData.phoneNumber.trim()) {
        payload.phoneNumber = formData.phoneNumber.trim();
      }

      if (formData.course.trim()) {
        payload.course = formData.course.trim();
      }

      await updateStudent(payload);
      setFeedback("Student updated successfully.");
      setFormData(initialFormState);
    } catch (err) {
      setFeedback(err.message || "Failed to update student.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>4. Update a student</h2>
      <form className="stack-form" onSubmit={handleSubmit}>
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="id"
          value={formData.id}
          onChange={handleChange}
          placeholder="ID (required)"
          required
        />
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Updated name"
        />
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          name="age"
          value={formData.age}
          onChange={handleChange}
          placeholder="Updated age"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Updated email"
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Updated phone number"
        />
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
        >
          <option value="">Select a course</option>
          {courses.map((course) => (
            <option key={course.id} value={course.name}>
              {course.name}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>

      {feedback && (
        <p className={isError ? "error-text" : "success-text"}>{feedback}</p>
      )}
    </section>
  );
}

export default UpdateStudent;
