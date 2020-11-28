import { showMessage } from '../helpers';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 400) {
                return Promise.reject(data);
            }
            if (response.status === 403) {
                localStorage.removeItem('user');
                window.location.reload();
                showMessage('error', 'Access denied!');
            }
            if (response.status === 401) {
                if (response.url && response.url.indexOf('/api/login') > 0) {
                    showMessage('error', data.detail);
                } else {
                    // auto logout if 401 response returned from api
                    localStorage.removeItem('user');
                    window.location.reload();
                    showMessage('info', 'Session timeout!');
                }
            }
            if (response.status === 404) {
                if (data.status === 'notfound') {
                    window.location.replace('/error-404')
                }
                if (data.status === 'expired') {
                    window.location.replace('/reset-password?token=reset')
                    showMessage('info', 'Token expired');
                }
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error);
        }
        return data;
    });
}
