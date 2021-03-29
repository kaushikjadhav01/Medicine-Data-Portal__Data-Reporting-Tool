import * as FileSaver from 'file-saver';
import { pdtConstants } from '../../constants';
import { hideLoader, showLoader } from './Loader';
import { getPDT, postPDT, adminGetPDT, adminPostPDT, approvePDT, submitPDT, markPDTMessageRead, getPDTReport, downloadpdtReport } from '../../services';
import { showMessage } from '../../helpers'

export const getPdtData = (onSuccess, quarter_name) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.GET_PDT_REQUEST });
        getPDT(quarter_name).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.GET_PDT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.GET_PDT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminPDTReport = (data, onSuccess) => {
    return dispatch => {
        dispatch({ type: pdtConstants.GET_PDT_REPORT_REQUEST });
        getPDTReport(data).then(
            response => {
                dispatch({ type: pdtConstants.GET_PDT_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: pdtConstants.GET_PDT_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const downloadPDTReport = (filename, quarter, requestObj, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.REPORT_DOWNLOAD_PDT_REQUEST });
        downloadpdtReport(quarter, requestObj).then(response => {
            dispatch(hideLoader());
            dispatch({ type: pdtConstants.REPORT_DOWNLOAD_PDT_SUCCESS });
            FileSaver.saveAs(response, filename);
            if (onSuccess) {
                onSuccess()
            }
        }).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.REPORT_DOWNLOAD_PDT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postPdtData = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.POST_PDT_REQUEST });
        postPDT(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.POST_PDT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.POST_PDT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const getAdminPdtData = (id, onSuccess, quarter_name) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.GET_ADMIN_PDT_REQUEST });
        adminGetPDT(id,quarter_name).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.GET_ADMIN_PDT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.GET_ADMIN_PDT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postAdminPdtData = (id, data, onSuccess, quarter_name=null) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.POST_ADMIN_PDT_REQUEST });
        adminPostPDT(id, data, quarter_name).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.POST_ADMIN_PDT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.POST_ADMIN_PDT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const approvePDTReport = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.APPROVE_PDT_REQUEST });
        approvePDT(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.APPROVE_PDT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.APPROVE_PDT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const submitPDTReport = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: pdtConstants.REPORT_PDT_REQUEST });
        submitPDT(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.REPORT_PDT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: pdtConstants.REPORT_PDT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const partnerMarkMessageRead = (type, onSuccess) => {
    return dispatch => {
        dispatch({ type: pdtConstants.MESSAGE_READ_REQUEST });
        markPDTMessageRead(type).then(
            response => {
                dispatch({ type: pdtConstants.MESSAGE_READ_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: pdtConstants.MESSAGE_READ_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}