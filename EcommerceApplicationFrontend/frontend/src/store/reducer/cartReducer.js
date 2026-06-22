// Define Initial State
const initialState = {
    cart: { items: [], grandTotal: 0 }
}

// Inject state and action in reducer and initialize state with initial value
export const cartReducer = (state = initialState, action) => {

    if (action.type === 'CART_GET') {
        return {
            ...state,
            cart: action.payload
        }
    }

    if (action.type === 'CART_REMOVE_ITEM') {
        // Filter out removed item from local cart state
        const updatedItems = [...state.cart.items].filter(item => item.cartId !== action.payload)
        const updatedTotal = updatedItems.reduce((sum, item) => sum + item.totalPrice, 0)
        return {
            ...state,
            cart: {
                ...state.cart,
                items: updatedItems,
                grandTotal: updatedTotal
            }
        }
    }

    if (action.type === 'CART_CLEAR_LOCAL') {
        return {
            ...state,
            cart: { items: [], grandTotal: 0 }
        }
    }

    return state
}
