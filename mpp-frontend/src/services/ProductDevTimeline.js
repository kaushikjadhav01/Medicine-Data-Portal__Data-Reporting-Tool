import { config } from '../constants';
import { authHeader } from '../helpers';
import { handleResponse } from './handle-response';

export const getPDT = (quarter_name) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    if(!quarter_name){
        return fetch(`${config.API_URL}/template/pdt/`, requestOptions)
            .then(handleResponse)
    }else{
        return fetch(`${config.API_URL}/template/pdt/?quarter=` + quarter_name, requestOptions)
            .then(handleResponse)
    }
}

export const postPDT = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/template/pdt/`, requestOptions)
        .then(handleResponse)
}

export const adminGetPDT = (id,quarter_name) => {
    const requestOptions = {
        method: 'GET',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    if(!quarter_name){
        return fetch(`${config.API_URL}/template/pdt/${id}/`, requestOptions)
        .then(handleResponse)
    }else{
        return fetch(`${config.API_URL}/template/pdt/${id}/?quarter=` + quarter_name, requestOptions)
        .then(handleResponse)
    }
    
}

export const adminPostPDT = (id, data, quarter_name) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    if(!quarter_name){
        return fetch(`${config.API_URL}/template/pdt/${id}/`, requestOptions)
            .then(handleResponse)
    }else{
        return fetch(`${config.API_URL}/template/pdt/${id}/?quarter=` + quarter_name, requestOptions)
            .then(handleResponse)
    }
}

export const submitPDT = ({ message }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    };

    return fetch(`${config.API_URL}/template/pdt/submit/`, requestOptions)
        .then(handleResponse)
}

export const approvePDT = ({ partner_id, message, is_approved }) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ partner_id, message, is_approved })
    };

    return fetch(`${config.API_URL}/template/pdt/message/`, requestOptions)
        .then(handleResponse)
}


export const markPDTMessageRead = (type) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
    };

    return fetch(`${config.API_URL}/template/pdt/inbox/${type}`, requestOptions)
        .then(handleResponse)
}

export const getPDTReport = (data) => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    return fetch(`${config.API_URL}/report/pdt/`, requestOptions)
        .then(handleResponse)
}


export const downloadPDTReport = () => {
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify({})
    };

    return fetch(`${config.API_URL}/report/pdt/download/`, requestOptions)
        .then((response) => response.blob())
        .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `sample.${this.state.file}`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        })
        .catch((error) => {
            console.log(error)
        });
}

export const downloadpdtReport = (quarter, requestObj) => {
    requestObj['quarter']=quarter
    const requestOptions = {
        method: 'POST',
        headers: { ...authHeader(), 'Content-Type': 'application/json' },
        body: JSON.stringify(requestObj),
        responseType: 'blob'
    };

    return fetch(`${config.API_URL}/report/pdt/download/`, requestOptions)
        .then(response => response.blob())

}