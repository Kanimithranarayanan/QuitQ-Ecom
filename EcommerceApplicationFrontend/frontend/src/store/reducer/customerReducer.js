// Define Initial State
const initialState = {
    customers: []
}

// Inject state and action in reducer and initialize state with initial value
export const customerReducer = (state = initialState, action) => {

    if (action.type === 'CUSTOMER_GET_ALL') {
        return {
            ...state,
            customers: action.payload
        }
    }

    if (action.type === 'CUSTOMER_SOFT_DELETE') {
        // Filter out the deleted customer from local state (no API refetch needed)
        return {
            ...state,
            customers: [...state.customers].filter(c => c.customerId !== action.payload)
        }
    }

    return state
}

/**
 * action is expected to have following structure
 * action = {
 *    type: ''
 *    payload: ''
 * }
 *
 * Soft delete from array:
 * customers = [c1, c2, c3]
 * delete c2 → customers = [...state.customers].filter(c => c.customerId !== action.payload)
 * → new array with [c1, c3]
 */
