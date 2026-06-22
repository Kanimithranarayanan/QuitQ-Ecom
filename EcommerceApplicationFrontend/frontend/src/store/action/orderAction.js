// Action functions will be called from Component so make them exportable
import axios from "axios"

const myOrdersApi = 'http://localhost:8088/api/order/my-orders'
const sellerOrdersApi = 'http://localhost:8088/api/order/seller-orders'
const allOrdersApi = 'http://localhost:8088/api/order/all'

export const getMyOrders = () => {
    return async (dispatch) => { // Thunk gives us dispatch
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(myOrdersApi, getConfig)
        let action = {
            type: 'ORDER_GET_MY_ORDERS',
            payload: response.data
        }
        dispatch(action)
    }
}

export const getSellerOrders = () => {
    return async (dispatch) => {
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(sellerOrdersApi, getConfig)
        let action = {
            type: 'ORDER_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}

export const getAll = () => {
    return async (dispatch) => {
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(allOrdersApi, getConfig)
        let action = {
            type: 'ORDER_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}
