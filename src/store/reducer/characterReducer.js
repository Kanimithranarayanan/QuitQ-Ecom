const initialState = {
    characters: [],
    totalPages: 0
};

export const characterReducer = (state = initialState, action) => {

    switch (action.type) {

        case "GET_ALL":
            return {
                ...state,
                characters: action.payload.characters,
                totalPages: action.payload.totalPages
            };

        default:
            return state;
    }
};
