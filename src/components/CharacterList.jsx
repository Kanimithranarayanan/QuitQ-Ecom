import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllData } from "../store/action/characterAction";

const CharacterList = () => {
    const dispatch = useDispatch();
    const {characters} =
    useSelector(state => state.characters);
    const [page, setPage] = useState(1);
    const totalPages = 20;

 useEffect(() => {
     dispatch(getAllData(page));
    }, [page]);
    return (
        <div className="container mt-4">
            <h1>All Characters</h1>
       <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Status</th>
                        <th>Species</th>
                        <th>Origin</th>
                        <th>Location</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        characters.map((c, index) => (

                            <tr key={index}>

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

            <div className="d-flex justify-content-center mt-3">

                <button
                    className="btn btn-primary"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                >
                    Previous
                </button>
                {
                    [...Array(totalPages)].map((_, index) => (

                        <button
                            key={index}
                            className={`btn me-1 ${
                                page === index + 1
                                    ? "btn-dark"
                                    : "btn-secondary"
                            }`}
                            onClick={() => setPage(index + 1)}
                        >
                            {index + 1}
                        </button>

                    ))
                }

                <button
                    className="btn btn-primary"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                >
                    Next
                </button>

            </div>

        </div>
    );
};

export default CharacterList;