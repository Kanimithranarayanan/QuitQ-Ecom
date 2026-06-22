// Action functions will be called from Component so make them exportable
import axios from "axios"

// Prepare the header
const config = {
    headers: {
        'Authorization': "Bearer " + localStorage.getItem('token')
    }
}

const getAllApi = 'http://localhost:8088/api/admin/sellers'
const deleteApi = 'http://localhost:8088/api/admin/sellers/delete'

export const getAll = () => {
    // action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        // Call the GET ALL API
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(getAllApi, getConfig)
        // dispatch the action object
        let action = {
            type: 'SELLER_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}

export const softDelete = (id) => {
    // Soft delete: remove from local state (filter array) - no API refetch
    return (dispatch) => {
        let action = {
            type: 'SELLER_SOFT_DELETE',
            payload: id
        }
        dispatch(action)
    }
}
