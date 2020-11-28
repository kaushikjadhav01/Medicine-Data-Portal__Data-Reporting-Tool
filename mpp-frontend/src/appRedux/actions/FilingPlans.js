import * as FileSaver from 'file-saver';
import { filingPlansConstants } from '../../constants';
import { hideLoader, showLoader } from './Loader';
import { showMessage } from '../../helpers'
import { adminGetFilingPlans, adminPostFilingPlans, approveFilingPlans, downloadFilingPlansReport, getFilingPlans, getFilingPlansReport, markFilingPlansMessageRead, postFilingPlans, submitFilingPlans } from '../../services/FilingPlans';

export const getFilingPlansData = (onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.GET_FILING_PLANS_REQUEST });
        getFilingPlans().then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.GET_FILING_PLANS_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.GET_FILING_PLANS_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminFilingPlansReport = (data, onSuccess) => {
    return dispatch => {
        dispatch({ type: filingPlansConstants.GET_FILING_PLANS_REPORT_REQUEST });
        getFilingPlansReport(data).then(
            response => {
                dispatch({ type: filingPlansConstants.GET_FILING_PLANS_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: filingPlansConstants.GET_FILING_PLANS_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const downloadFilingReport = (filename, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.REPORT_DOWNLOAD_FILING_PLANS_REQUEST });
        downloadFilingPlansReport().then(response => {
            dispatch(hideLoader());
            dispatch({ type: filingPlansConstants.REPORT_DOWNLOAD_FILING_PLANS_SUCCESS });
            FileSaver.saveAs(response, filename);
            if (onSuccess) {
                onSuccess()
            }
        }).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.REPORT_DOWNLOAD_FILING_PLANS_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postFilingPlansData = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.POST_FILING_PLANS_REQUEST });
        postFilingPlans(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.POST_FILING_PLANS_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.POST_FILING_PLANS_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const getAdminFilingPlansData = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.GET_ADMIN_FILING_PLANS_REQUEST });
        adminGetFilingPlans(id).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.GET_ADMIN_FILING_PLANS_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.GET_ADMIN_FILING_PLANS_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postAdminFilingPlansData = (id, data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.POST_ADMIN_FILING_PLANS_REQUEST });
        adminPostFilingPlans(id, data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.POST_ADMIN_FILING_PLANS_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.POST_ADMIN_FILING_PLANS_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const approveFilingPlansReport = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.APPROVE_FILING_PLANS_REQUEST });
        approveFilingPlans(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.APPROVE_FILING_PLANS_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.APPROVE_FILING_PLANS_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const submitFilingPlansReport = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: filingPlansConstants.REPORT_FILING_PLANS_REQUEST });
        submitFilingPlans(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.REPORT_FILING_PLANS_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: filingPlansConstants.REPORT_FILING_PLANS_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const partnerMarkFilingPlansMessageRead = (type, onSuccess) => {
    return dispatch => {
        dispatch({ type: filingPlansConstants.MESSAGE_READ_REQUEST });
        markFilingPlansMessageRead(type).then(
            response => {
                dispatch({ type: filingPlansConstants.MESSAGE_READ_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: filingPlansConstants.MESSAGE_READ_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}