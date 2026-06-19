import axios from "axios";

export const getAllData = (page) => {

    return async (dispatch) => {

        const api =
            `https://rickandmortyapi.com/api/character?page=${page}`;

        const response = await axios.get(api);

        dispatch({
            type: "GET_ALL",
            payload: {
                characters: response.data.results,
                totalPages: response.data.info.pages
            }
        });
    };
};
