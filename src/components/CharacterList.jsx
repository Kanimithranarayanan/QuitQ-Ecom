import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllData } from "../store/action/characterAction";

function Character() {

    const dispatch = useDispatch();

    const characters =
        useSelector(state => state.characters.characters);

    const totalPages =
        useSelector(state => state.characters.totalPages);

    const [currentPage, setCurrentPage] = useState(1);

    const size = 20;

    useEffect(() => {
        dispatch(getAllData(currentPage));
    }, [dispatch, currentPage]);

    return (
        <div className="container mt-4">

            <h2 className="mb-3">All Characters</h2>

            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Species</th>
                        <th>Origin Name</th>
                        <th>Location Name</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        characters.map((c, index) => (
                            <tr key={c.id}>
                                <td>
                                    {index + 1 + ((currentPage - 1) * size)}
                                </td>
                                <td>{c.name}</td>
                                <td>{c.status}</td>
                                <td>{c.species}</td>
                                <td>{c.origin.name}</td>
                                <td>{c.location.name}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>

            <nav>
                <ul className="pagination justify-content-center">

                    <li className="page-item">
                        <button
                            className="page-link"
                            disabled={currentPage === 1}
                            onClick={() =>
                                setCurrentPage(currentPage - 1)
                            }
                        >
                            Previous
                        </button>
                    </li>

                    <li className="page-item active">
                        <button className="page-link">
                            {currentPage}
                        </button>
                    </li>

                    <li className="page-item">
                        <button
                            className="page-link"
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                setCurrentPage(currentPage + 1)
                            }
                        >
                            Next
                        </button>
                    </li>

                </ul>
            </nav>

        </div>
    );
}

export default Character;
