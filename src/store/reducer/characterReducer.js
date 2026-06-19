const initialState = {
    characters: []
};

export const characterReducer = (
    state = initialState,
    action
) => {

    if(action.type === "GET_ALL"){

        return {
            ...state,
            characters: action.payload
        };
    }

    return state;
};