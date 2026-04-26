import { useState } from "react";
import "./App.css";
import Login from "./components/Login";
import GetAllStudents from "./components/GetAllStudents";
import GetStudentById from "./components/GetStudentById";
import AddStudent from "./components/AddStudent";
import UpdateStudent from "./components/UpdateStudent";
import DeleteStudent from "./components/DeleteStudent";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Student API Tester</h1>
        <p>
          Perform all CRUD operations against
          <span> https://localhost:44319/api/student</span>
        </p>
        <button onClick={handleLogout} style={{ marginTop: '10px' }}>
          Logout
        </button>
      </header>

      <section className="grid-layout">
        <GetAllStudents />
        <GetStudentById />
        <AddStudent />
        <UpdateStudent />
        <DeleteStudent />
      </section>
    </main>
  );
}

export default App;