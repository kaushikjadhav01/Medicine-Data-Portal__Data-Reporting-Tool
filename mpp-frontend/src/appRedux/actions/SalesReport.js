import * as FileSaver from 'file-saver';
import { salesReportConstants } from '../../constants';
import { hideLoader, showLoader } from './Loader';
import { showMessage } from '../../helpers'
import { getConsolidatedSalesReport, getSalesReport, downloadConsolidatedSalesReport, postSalesReport, adminGetSalesReport, adminPostSalesReport, approveSalesReport, submitSalesReport, markSalesReportMessageRead, getProductsToBeVerified, postProductsToBeVerified } from '../../services';

export const getApiSalesData = (onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.GET_API_SALES_REPORT_REQUEST });
        getSalesReport('api').then(
            response => {
                dispatch({ type: salesReportConstants.GET_API_SALES_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.GET_API_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getFdfSalesData = (onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.GET_FDF_SALES_REPORT_REQUEST });
        getSalesReport('fdf').then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.GET_FDF_SALES_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.GET_FDF_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminConsolidatedApiReport = (data, onSuccess) => {
    return dispatch => {
        dispatch({ type: salesReportConstants.GET_CONSOLIDATED_API_SALES_REPORT_REQUEST });
        getConsolidatedSalesReport('api', data).then(
            response => {
                dispatch({ type: salesReportConstants.GET_CONSOLIDATED_API_SALES_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: salesReportConstants.GET_CONSOLIDATED_API_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminConsolidatedFdfReport = (data, onSuccess) => {
    return dispatch => {
        dispatch({ type: salesReportConstants.GET_CONSOLIDATED_FDF_SALES_REPORT_REQUEST });
        getConsolidatedSalesReport('fdf', data).then(
            response => {
                dispatch({ type: salesReportConstants.GET_CONSOLIDATED_FDF_SALES_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: salesReportConstants.GET_CONSOLIDATED_FDF_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const downloadApiSalesReport = (filename, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.DOWNLOAD_API_SALES_REPORT_REQUEST });
        downloadConsolidatedSalesReport('api').then(response => {
            dispatch(hideLoader());
            dispatch({ type: salesReportConstants.DOWNLOAD_API_SALES_REPORT_SUCCESS });
            FileSaver.saveAs(response, filename);
            if (onSuccess) {
                onSuccess()
            }
        }).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.DOWNLOAD_API_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const downloadFdfSalesReport = (filename, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.DOWNLOAD_FDF_SALES_REPORT_REQUEST });
        downloadConsolidatedSalesReport('fdf').then(response => {
            dispatch(hideLoader());
            dispatch({ type: salesReportConstants.DOWNLOAD_FDF_SALES_REPORT_SUCCESS });
            FileSaver.saveAs(response, filename);
            if (onSuccess) {
                onSuccess()
            }
        }).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.DOWNLOAD_FDF_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postApiSalesReportData = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.POST_API_SALES_REPORT_REQUEST });
        postSalesReport('api', data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_API_SALES_REPORT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_API_SALES_REPORT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const postFdfSalesReportData = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.POST_FDF_SALES_REPORT_REQUEST });
        postSalesReport('fdf', data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_FDF_SALES_REPORT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_FDF_SALES_REPORT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const getAdminApiSalesData = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.GET_ADMIN_API_SALES_REPORT_REQUEST });
        adminGetSalesReport('api', id).then(
            response => {
                dispatch({ type: salesReportConstants.GET_ADMIN_API_SALES_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.GET_ADMIN_API_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminFdfSalesData = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.GET_ADMIN_FDF_SALES_REPORT_REQUEST });
        adminGetSalesReport('fdf', id).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.GET_ADMIN_FDF_SALES_REPORT_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response)
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.GET_ADMIN_FDF_SALES_REPORT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postAdminApiSalesData = (id, data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.POST_ADMIN_API_SALES_REPORT_REQUEST });
        adminPostSalesReport('api', id, data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_ADMIN_API_SALES_REPORT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_ADMIN_API_SALES_REPORT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const postAdminFdfSalesData = (id, data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.POST_ADMIN_FDF_SALES_REPORT_REQUEST });
        adminPostSalesReport('fdf', id, data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_ADMIN_FDF_SALES_REPORT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_ADMIN_FDF_SALES_REPORT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const approveSalesReportData = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.APPROVE_SALES_REPORT_REQUEST });
        approveSalesReport(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.APPROVE_SALES_REPORT_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.APPROVE_SALES_REPORT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const submitSalesReportData = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.SUBMIT_SALES_REPORT_REQUEST });
        submitSalesReport(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.SUBMIT_SALES_REPORT_SUCCESS });
                showMessage('success', 'Reports submitted successfully!')
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.SUBMIT_SALES_REPORT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const partnerMarkSalesReportMessageRead = (type, onSuccess) => {
    return dispatch => {
        dispatch({ type: salesReportConstants.MESSAGE_READ_REQUEST });
        markSalesReportMessageRead(type).then(
            response => {
                dispatch({ type: salesReportConstants.MESSAGE_READ_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: salesReportConstants.MESSAGE_READ_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const getAdminProductsToBeVerified = (id, onSuccess) => {
    return dispatch => {
        dispatch({ type: salesReportConstants.GET_PRODUCT_VERIFICATION_LIST_REQUEST });
        getProductsToBeVerified(id).then(
            response => {
                dispatch({ type: salesReportConstants.GET_PRODUCT_VERIFICATION_LIST_SUCCESS, data: response ? response : [] });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch({ type: salesReportConstants.GET_PRODUCT_VERIFICATION_LIST_FAILURE });
                console.log(error)
            }
        )
    }
}

export const postAdminProductsToBeVerified = (id, data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: salesReportConstants.POST_PRODUCT_VERIFICATION_LIST_REQUEST });
        postProductsToBeVerified(id, data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_PRODUCT_VERIFICATION_LIST_SUCCESS });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: salesReportConstants.POST_PRODUCT_VERIFICATION_LIST_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}