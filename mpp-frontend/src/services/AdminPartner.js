import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';


export const addPartner = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/admin/partner/`, requestOptions)
        .then(handleResponse)
}

export const editPartner = (id, data) => {
    const requestOptions = {
        method: 'PUT',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/admin/partner/${id}/`, requestOptions)
        .then(handleResponse)
}

export const getPartnerList = () => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/partner/`, requestOptions)
        .then(handleResponse)
}

export const getPartner = (id) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/partner/${id}/`, requestOptions)
        .then(handleResponse)
}

export const deletePartner = (id) => {
    const requestOptions = {
        method: 'DELETE',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/partner/${id}/`, requestOptions)
        .then(handleResponse)
}


export const sendReportReminder = (partner_id, template_type) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id, template_type })
    };

    return fetch(`${config.API_URL}/template/reminder/`, requestOptions)
        .then(handleResponse)
}


export const getRegionList = () => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/country_list/`, requestOptions)
        .then(handleResponse)
}


export const setReportCutOffDate = ({ date }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ date })
    };

    return fetch(`${config.API_URL}/admin/cut_off_date/`, requestOptions)
        .then(handleResponse)
}

export const getReportCutOffDate = () => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/admin/cut_off_date/`, requestOptions)
        .then(handleResponse)
}