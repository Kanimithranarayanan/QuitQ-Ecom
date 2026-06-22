// Action functions will be called from Component so make them exportable
import axios from "axios"

const myCartApi = 'http://localhost:8088/api/cart/my-cart'

export const getMyCart = () => {
    return async (dispatch) => { // Thunk gives us dispatch
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(myCartApi, getConfig)
        let action = {
            type: 'CART_GET',
            payload: response.data
        }
        dispatch(action)
    }
}

export const removeFromCart = (cartId) => {
    // Remove from local state array without API refetch
    return (dispatch) => {
        let action = {
            type: 'CART_REMOVE_ITEM',
            payload: cartId
        }
        dispatch(action)
    }
}

export const clearCartLocal = () => {
    // Empty the cart in local state (used right after a successful checkout)
    return (dispatch) => {
        let action = { type: 'CART_CLEAR_LOCAL' }
        dispatch(action)
    }
}
