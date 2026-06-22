// Define Initial State
const initialState = {
    reviews: []
}

// Inject state and action in reducer and initialize state with initial value
export const reviewReducer = (state = initialState, action) => {

    if (action.type === 'REVIEW_GET_BY_PRODUCT') {
        return {
            ...state,
            reviews: action.payload
        }
    }

    if (action.type === 'REVIEW_GET_MY') {
        return {
            ...state,
            reviews: action.payload
        }
    }

    if (action.type === 'REVIEW_SOFT_DELETE') {
        // Filter out the deleted review from local state (no API refetch needed)
        return {
            ...state,
            reviews: [...state.reviews].filter(r => r.reviewId !== action.payload)
        }
    }

    if (action.type === 'REVIEW_ADD') {
        // Add new review to top of array
        return {
            ...state,
            reviews: [action.payload, ...state.reviews]
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
 * reviews = [r1, r2, r3]
 * delete r2 → reviews = [...state.reviews].filter(r => r.reviewId !== action.payload)
 * → new array with [r1, r3]
 */
