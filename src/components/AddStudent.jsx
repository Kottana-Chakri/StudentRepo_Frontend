import { useState, useEffect } from "react";
import { addStudent, getCourses } from "../api";

const initialFormState = {
  name: "",
  age: "",
  email: "",
  phoneNumber: "",
  course: "",
};

function AddStudent() {
  const [formData, setFormData] = useState(initialFormState);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isError, setIsError] = useState(false);
  const [courseLoading, setCourseLoading] = useState(true);
  const [courseError, setCourseError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      setCourseLoading(true);
      setCourseError("");
      try {
        const coursesData = await getCourses();
        console.log("✓ Courses loaded:", coursesData);
        console.log("📊 Number of courses:", coursesData?.length);
        setCourses(coursesData || []);
        if (!coursesData || coursesData.length === 0) {
          setCourseError("No courses available from server");
        }
      } catch (err) {
        console.error("❌ Course loading error:", err);
        setCourseError(err.message || "Failed to load courses");
      } finally {
        setCourseLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const age = formData.age.trim();
    const email = formData.email.trim();
    const phoneNumber = formData.phoneNumber.trim();
    const course = formData.course.trim();

    if (!name || !age || !email || !phoneNumber || !course) {
      setFeedback("All fields are required.");
      setIsError(true);
      return;
    }

    if (!/^\d+$/.test(age) || Number(age) <= 0) {
      setFeedback("Age must be a positive number.");
      setIsError(true);
      return;
    }

    if (!email.includes("@")) {
      setFeedback("Email must contain @.");
      setIsError(true);
      return;
    }

    if (!/^\d{10}$/.test(phoneNumber)) {
      setFeedback("Phone number must be exactly 10 digits.");
      setIsError(true);
      return;
    }

    setLoading(true);
    setFeedback("");
    setIsError(false);

    try {
      const payload = {
        name,
        age: Number(age),
        email,
        phoneNumber,
        course,
      };

      await addStudent(payload);
      setFeedback("Student added successfully.");
      setFormData(initialFormState);
    } catch (err) {
      setFeedback(err.message || "Failed to add student.");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="panel">
      <h2>3. Add a student</h2>
      
      {courseLoading && <p style={{ color: "#0069a8", fontSize: "0.9rem" }}>⏳ Loading courses...</p>}
      {courseError && <p style={{ color: "#bb1e1e", fontSize: "0.9rem" }}>⚠️ {courseError}</p>}
      
      <form className="stack-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          required
        />
        <input
          type="number"
          name="age"
          min="1"
          value={formData.age}
          onChange={handleChange}
          placeholder="Age"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <input
          type="text"
          name="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="Phone number"
          required
        />
        <select
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
          disabled={courseLoading || courses.length === 0}
        >
          <option value="">
            {courseLoading ? "Loading courses..." : courses.length === 0 ? "No courses available" : "Select a course"}
          </option>
          {courses.map((course) => (
            <option key={course.id || course.courseId} value={course.name || course.courseName}>
              {course.name || course.courseName}
            </option>
          ))}
        </select>
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "POST"}
        </button>
      </form>

      {feedback && (
        <p className={isError ? "error-text" : "success-text"}>{feedback}</p>
      )}
    </section>
  );
}

export default AddStudent;
