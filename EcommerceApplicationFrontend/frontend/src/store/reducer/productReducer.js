// Define Initial State
const initialState = {
    products: [],
    totalPages: 0,
    totalElements: 0
}

// Inject state and action in reducer and initialize state with initial value
export const productReducer = (state = initialState, action) => {

    if (action.type === 'PRODUCT_GET_ALL') {
        // Plain list from search / filter / by-seller APIs
        return {
            ...state,
            products: action.payload
        }
    }

    if (action.type === 'PRODUCT_GET_ALL_PAGINATED') {
        // Paginated response: { totalElements, totalPages, data: [...] }
        return {
            ...state,
            products: action.payload.data,
            totalPages: action.payload.totalPages,
            totalElements: action.payload.totalElements
        }
    }

    if (action.type === 'PRODUCT_SOFT_DELETE') {
        // Filter out the deleted product from local state without API refetch
        return {
            ...state,
            products: [...state.products].filter(p => p.productId !== action.payload)
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
 * Paginated payload: { totalElements, totalPages, data: [ProductRespDto...] }
 *
 * Soft delete from array:
 * products = [p1, p2, p3]
 * delete p2 → products = [...state.products].filter(p => p.productId !== action.payload)
 * → new array with [p1, p3]
 */
