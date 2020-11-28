import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';

export const login = ({ email, password }) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    };

    return fetch(`${config.API_URL}/login/`, requestOptions)
        .then(handleResponse)
}

export const changePassword = ({ password }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    };
    return fetch(`${config.API_URL}/account/update_password/`, requestOptions)
        .then(handleResponse)
}



export const tokenValidate = ({ token }) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
    };
    return fetch(`${config.API_URL}/password_reset/validate_token/`, requestOptions)
        .then(handleResponse)
}

export const passwordSet = ({ password, token }) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
    };
    return fetch(`${config.API_URL}/password_reset/confirm/`, requestOptions)
        .then(handleResponse)
}

export const forgotPassword = ({ email }) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    };
    return fetch(`${config.API_URL}/password_reset/`, requestOptions)
        .then(handleResponse)
}