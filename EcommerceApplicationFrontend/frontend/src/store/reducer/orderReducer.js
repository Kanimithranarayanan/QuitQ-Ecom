// Define Initial State
const initialState = {
    orders: []
}

// Inject state and action in reducer and initialize state with initial value
export const orderReducer = (state = initialState, action) => {

    if (action.type === 'ORDER_GET_ALL') {
        return {
            ...state,
            orders: action.payload
        }
    }

    if (action.type === 'ORDER_GET_MY_ORDERS') {
        return {
            ...state,
            orders: action.payload
        }
    }

    return state
}
