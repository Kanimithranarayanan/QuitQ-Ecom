import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

function App() {
  return (
    <BrowserRouter>

      <div className="container mt-3">

        <Link
          to="/users"
          className="btn btn-primary me-2"
        >
          User List
        </Link>

        <Link
          to="/add-user"
          className="btn btn-success"
        >
          Add User
        </Link>

      </div>

      <Routes>
        <Route path="/" element={<UserList />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/add-user" element={<AddUser />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;