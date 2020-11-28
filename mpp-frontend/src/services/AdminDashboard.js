import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';

export const getProjectCount = () => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    return fetch(`${config.API_URL}/admin/dashboard/project/`, requestOptions)
        .then(handleResponse)
}

export const getProductCompanyCount = () => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    return fetch(`${config.API_URL}/admin/dashboard/product/company/`, requestOptions)
        .then(handleResponse)
}

export const getProductCountryCount = (status) => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    if (status === 'Future-Quarters'){
        return fetch(`${config.API_URL}/admin/dashboard/product/country/quarter/`, requestOptions)
        .then(handleResponse)
    }else{
        const endpoint = `${config.API_URL}/admin/dashboard/product/country/?status=`.concat(status)
        return fetch(endpoint, requestOptions)
            .then(handleResponse)
    }
    
}

export const getCompanyCount = () => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    return fetch(`${config.API_URL}/admin/dashboard/company/`, requestOptions)
        .then(handleResponse)
}

export const getCountryProduct = (status) => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    const endpoint = `${config.API_URL}/admin/dashboard/country/?type=`.concat(status)
    return fetch(endpoint, requestOptions)
        .then(handleResponse)
}


export const getSales = (map_with,to) => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    const endpoint = `${config.API_URL}/admin/dashboard/sales/`.concat('?map_with=').concat(map_with).concat('&for=').concat(to)
    return fetch(endpoint, requestOptions)
        .then(handleResponse)
}

export const getDashboardSummary = (type) => {
    
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };
    
    const endpoint = `${config.API_URL}/admin/dashboard/`.concat('?type=').concat(type)
    return fetch(endpoint, requestOptions)
        .then(handleResponse)
}

export const sendReminderBulkMail = (data) => {
    
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    };
    
    return fetch(`${config.API_URL}/template/bulkReminder/`, requestOptions)
        .then(handleResponse)
}