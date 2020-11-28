import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';

export const getFilingPlans = () => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/filing/`, requestOptions)
        .then(handleResponse)
}

export const postFilingPlans = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/template/filing/`, requestOptions)
        .then(handleResponse)
}

export const adminGetFilingPlans = (id) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/filing/${id}/`, requestOptions)
        .then(handleResponse)
}

export const adminPostFilingPlans = (id, data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/template/filing/${id}/`, requestOptions)
        .then(handleResponse)
}

export const submitFilingPlans = ({message}) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({message})
    };

    return fetch(`${config.API_URL}/template/filing/submit/`, requestOptions)
        .then(handleResponse)
}

export const approveFilingPlans = ({ partner_id, message, is_approved }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id, message, is_approved })
    };

    return fetch(`${config.API_URL}/template/filing/message/`, requestOptions)
        .then(handleResponse)
}


export const markFilingPlansMessageRead = (type) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/filing/inbox/${type}`, requestOptions)
        .then(handleResponse)
}

export const getFilingPlansReport = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/report/filing/`, requestOptions)
        .then(handleResponse)
}

export const downloadFilingPlansReport = () => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        responseType: 'blob'
    };

    return fetch(`${config.API_URL}/report/filing/download/`, requestOptions)
        .then(response => response.blob())
}