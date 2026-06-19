import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddUser = () => {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: "",
        email: "",
        phone: "",
        company: ""
    });

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const resp = await axios.post(
                "https://jsonplaceholder.typicode.com/users",
                user
            );

            const newUser = {
                ...resp.data,
                id: Date.now(),
                company: {
                    name: user.company
                }
            };

            const existingUsers =
                JSON.parse(localStorage.getItem("users")) || [];

            existingUsers.push(newUser);

            localStorage.setItem(
                "users",
                JSON.stringify(existingUsers)
            );

            alert("User Added Successfully");

            navigate("/users");

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-4">

            <h2>Add User</h2>

            <form onSubmit={handleSubmit}>

                <div className="mb-3">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={user.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={user.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        className="form-control"
                        value={user.phone}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Company Name</label>
                    <input
                        type="text"
                        name="company"
                        className="form-control"
                        value={user.company}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="btn btn-success"
                >
                    Add User
                </button>

            </form>

        </div>
    );
};

export default AddUser;