const initialState = {
  characters: [],
  totalPages: 0,
};
export const characterReducer = (state = initialState, action) => {
  if (action.type === "GET_ALL") {
    //updating the data
    return {
      ...state,
      characters: action.payload.results,
      totalPages: action.payload.info.pages,
    };
  }
  return state;
};
