// Define Initial State
const initialState = {
    sellers: []
}

// Inject state and action in reducer and initialize state with initial value
export const sellerReducer = (state = initialState, action) => {

    if (action.type === 'SELLER_GET_ALL') {
        return {
            ...state,
            sellers: action.payload
        }
    }

    if (action.type === 'SELLER_SOFT_DELETE') {
        // Filter out the deleted seller from local state (no API refetch needed)
        return {
            ...state,
            sellers: [...state.sellers].filter(s => s.sellerId !== action.payload)
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
 * sellers = [s1, s2, s3]
 * delete s2 → sellers = [...state.sellers].filter(s => s.sellerId !== action.payload)
 * → new array with [s1, s3]
 */
