// Action functions will be called from Component so make them exportable
import axios from "axios"

const getAllPaginatedApi = 'http://localhost:8088/api/product/all/v2'
const searchApi = 'http://localhost:8088/api/product/search'
const byCategoryApi = 'http://localhost:8088/api/product/by-category'
const byPriceApi = 'http://localhost:8088/api/product/by-price-range'
const bySellerApi = 'http://localhost:8088/api/product/by-seller'

export const getAllPaginated = (page, size) => {
    // action Fn must return a Fn having action object wrapped in dispatch
    return async (dispatch) => { // Thunk gives us dispatch
        // Call the paginated GET ALL API
        const response = await axios.get(getAllPaginatedApi + `?page=${page}&size=${size}`)
        // dispatch the action object
        // response.data = { totalElements, totalPages, data: [...] }
        let action = {
            type: 'PRODUCT_GET_ALL_PAGINATED',
            payload: response.data
        }
        dispatch(action)
    }
}

export const searchByKeyword = (keyword) => {
    return async (dispatch) => {
        const response = await axios.get(searchApi + "?keyword=" + keyword)
        let action = {
            type: 'PRODUCT_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}

export const filterByCategory = (categoryId) => {
    return async (dispatch) => {
        const response = await axios.get(byCategoryApi + "/" + categoryId)
        let action = {
            type: 'PRODUCT_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}

export const filterByPriceRange = (minPrice, maxPrice) => {
    return async (dispatch) => {
        const response = await axios.get(byPriceApi + "?minPrice=" + minPrice + "&maxPrice=" + maxPrice)
        let action = {
            type: 'PRODUCT_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}

export const getBySeller = (sellerUsername) => {
    return async (dispatch) => {
        const getConfig = {
            headers: {
                'Authorization': "Bearer " + localStorage.getItem('token')
            }
        }
        const response = await axios.get(bySellerApi + "?sellerUsername=" + sellerUsername, getConfig)
        let action = {
            type: 'PRODUCT_GET_ALL',
            payload: response.data
        }
        dispatch(action)
    }
}

export const softDeleteProduct = (productId) => {
    // Soft delete from local state only (filter out from array)
    return (dispatch) => {
        let action = {
            type: 'PRODUCT_SOFT_DELETE',
            payload: productId
        }
        dispatch(action)
    }
}
