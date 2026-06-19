import axios from "axios";
import { useEffect, useState } from "react";

const UserList = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, []);

    const getUsers = async () => {

        try {

            const resp = await axios.get(
                "https://jsonplaceholder.typicode.com/users"
            );

            const apiUsers = resp.data;

            const localUsers =
                JSON.parse(localStorage.getItem("users")) || [];

            setUsers([...apiUsers, ...localUsers]);

        } catch (err) {
            console.log(err);
        }
    };

    const deleteUser = async (id) => {

        try {

            await axios.delete(
                `https://jsonplaceholder.typicode.com/users/${id}`
            );

            const updatedUsers =
                users.filter(user => user.id !== id);

            setUsers(updatedUsers);

            const localUsers =
                JSON.parse(localStorage.getItem("users")) || [];

            const updatedLocalUsers =
                localUsers.filter(user => user.id !== id);

            localStorage.setItem(
                "users",
                JSON.stringify(updatedLocalUsers)
            );

        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container mt-4">

            <h1>User List</h1>

            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Company</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>

                    {users.map((user) => (

                        <tr key={user.id}>

                            <td>{user.name}</td>

                            <td>{user.email}</td>

                            <td>{user.phone}</td>

                            <td>{user.company?.name}</td>

                            <td>
                                <button
                                    className="btn btn-danger"
                                    onClick={() => deleteUser(user.id)}
                                >
                                    Delete
                                </button>
                            </td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </div>
    );
};

export default UserList;