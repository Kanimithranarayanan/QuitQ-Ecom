import axios from "axios";

export const getAllData = (page) => {

    return async (dispatch) => {

        const api =
            `https://rickandmortyapi.com/api/character/?page=${page}`;

        const response = await axios.get(api);

        let action = {
            type: "GET_ALL",
            payload: response.data.results
        };

        dispatch(action);
    };
};