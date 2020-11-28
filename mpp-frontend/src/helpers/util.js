import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { Modal } from 'antd';

export const getRole = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.role : ''
}

export const getQuarter = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.curr_quarter : ''
}

export const getUserDetails = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.username : ''
}

export const getUserInfo = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ?
        user.role === 'PARTNER' ?
            { ...user.partner, email: user.email } :
            { name: user.username, email: user.email } :
        {}
}

export const exportToXLXS = (fileData, fileName) => {
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(fileData);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
}

export const yearList = () => {
    let currentYear = Number(moment(new Date()).format('YYYY'));
    let yearArray = [];
    for (let i = currentYear - 20; i <= currentYear; i++) {
        yearArray.unshift(i)
    }
    return yearArray
}

export const showConfirm = (title, onSuccess) => {
    Modal.confirm({
        title: title,
        okText: 'Ok',
        cancelText: 'Cancel',
        onOk() {
            onSuccess()
        },
        onCancel() {
        },
    })
}