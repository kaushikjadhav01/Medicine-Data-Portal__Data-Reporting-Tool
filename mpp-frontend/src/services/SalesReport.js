import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';

export const getSalesReport = (type) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/sales/${type}`, requestOptions)
        .then(handleResponse)
}

export const postSalesReport = (type, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/template/sales/${type}`, requestOptions)
        .then(handleResponse)
}

export const adminGetSalesReport = (type, id) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/sales/${type}/${id}`, requestOptions)
        .then(handleResponse)
}

export const adminPostSalesReport = (type, id, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/template/sales/${type}/${id}`, requestOptions)
        .then(handleResponse)
}

export const submitSalesReport = ({ message }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    };

    return fetch(`${config.API_URL}/template/sales/submit/`, requestOptions)
        .then(handleResponse)
}

export const approveSalesReport = ({ partner_id, message, is_approved }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id, message, is_approved })
    };

    return fetch(`${config.API_URL}/template/sales/message/`, requestOptions)
        .then(handleResponse)
}

export const markSalesReportMessageRead = (type) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/sales/inbox/${type}`, requestOptions)
        .then(handleResponse)
}

export const getConsolidatedSalesReport = (type, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/report/sales/${type}`, requestOptions)
        .then(handleResponse)
}

export const downloadConsolidatedSalesReport = (type) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        responseType: 'blob'
    };

    return fetch(`${config.API_URL}/report/sales/download/${type}`, requestOptions)
        .then(response => response.blob())
}

export const getProductsToBeVerified = (id) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/product_verification/${id}`, requestOptions)
        .then(handleResponse)
}

export const postProductsToBeVerified = (id, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/template/product_verification/${id}`, requestOptions)
        .then(handleResponse)
}