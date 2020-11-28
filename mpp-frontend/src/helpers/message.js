import { message } from 'antd';

export function showMessage(type, msgTxt) {
    switch (type) {
        case 'success':
            message.success(msgTxt);
            break;

        case 'error':
            message.error(msgTxt);
            break;

        case 'info':
            message.info(msgTxt);
            break;

        case 'warning':
            message.warning(msgTxt);
            break;

        case 'loading':
            message.loading(msgTxt);
            break;

        default:
            message.info(msgTxt);
    }
}