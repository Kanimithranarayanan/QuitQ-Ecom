// Action functions will be called from Component so make them exportable
import axios from "axios"

const getByProductApi = 'http://localhost:8088/api/review/by-product'
const getMyReviewsApi = 'http://localhost:8088/api/review/my-reviews'

export const getReviewsByProduct = (productId) => {
    // action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        // Call the GET BY PRODUCT API — public, no token needed
        const response = await axios.get(getByProductApi + "/" + productId)
        // dispatch the action object
        let action = {
            type: 'REVIEW_GET_BY_PRODUCT',
            payload: response.data
        }
        dispatch(action)
    }
}

export const getMyReviews = () => {
    return async (dispatch) => {
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(getMyReviewsApi, getConfig)
        let action = {
            type: 'REVIEW_GET_MY',
            payload: response.data
        }
        dispatch(action)
    }
}

export const softDeleteReview = (reviewId) => {
    // Soft delete from local state — filter out from array (no API refetch)
    return (dispatch) => {
        let action = {
            type: 'REVIEW_SOFT_DELETE',
            payload: reviewId
        }
        dispatch(action)
    }
}
