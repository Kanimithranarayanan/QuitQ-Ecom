import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import UserList from "./components/UserList";
import AddUser from "./components/AddUser";

import CharacterList from "./components/CharacterList";

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
          className="btn btn-success me-2"
        >
          Add User
        </Link>

        <Link
          to="/characters"
          className="btn btn-warning"
        >
          Characters
        </Link>

      </div>

      <Routes>

        <Route
          path="/"
          element={<UserList />}
        />

        <Route
          path="/users"
          element={<UserList />}
        />

        <Route
          path="/add-user"
          element={<AddUser />}
        />

        <Route
          path="/characters"
          element={<CharacterList />}
        />

      </Routes>

    </BrowserRouter>

  );
}

export default App;