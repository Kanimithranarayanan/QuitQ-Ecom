import axios from "axios";

export const getAllData = (page) => {
  //gets page num
  return async (dispatch) => {
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?page=${page + 1}`
    ); 
    let action = {
      type: "GET_ALL",
      payload: response.data, 
    };
    dispatch(action); 
  };
};
