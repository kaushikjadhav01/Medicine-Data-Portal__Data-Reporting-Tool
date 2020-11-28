import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';

export const getPartnerDashboard = () => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/partner/dashboard/`, requestOptions)
        .then(handleResponse)
}