import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';


export const addProduct = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/admin/product/`, requestOptions)
        .then(handleResponse)
}

export const editProduct = (id, data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/admin/product/${id}/`, requestOptions)
        .then(handleResponse)
}

export const getProduct = (id) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/product/${id}/`, requestOptions)
        .then(handleResponse)
}

export const deleteProduct = (id) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/product/${id}/`, requestOptions)
        .then(handleResponse)
}

export const getProductList = (showRecent) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/product/?recent=${showRecent}`, requestOptions)
        .then(handleResponse)
}

export const getProductDetails = ({ product_name, partner_id }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ product_name, partner_id })
    };

    return fetch(`${config.API_URL}/admin/product_detail/`, requestOptions)
        .then(handleResponse)
}