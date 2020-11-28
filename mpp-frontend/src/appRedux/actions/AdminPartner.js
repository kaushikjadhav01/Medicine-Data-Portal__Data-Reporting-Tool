import { adminPartnerConstants } from '../../constants';
import { hideLoader, showLoader } from './Loader';
import { addPartner, deletePartner, editPartner, getPartner, getPartnerList, getRegionList, getReportCutOffDate, sendReportReminder, setReportCutOffDate } from '../../services';
import { showMessage } from '../../helpers'

export const adminAddPartner = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminPartnerConstants.ADD_PARTNER_REQUEST });
        addPartner(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.ADD_PARTNER_SUCCESS });
                showMessage('success', 'Partner added succcessfully!');
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.ADD_PARTNER_FAILURE });
                let errorMsg = error && error.error ? error.error.filter(
                    (value) => value !== 'None'
                ) : ''
                if (errorMsg.length) {
                    showMessage('error', errorMsg[0]);
                }
            }
        )
    }
}

export const adminEditPartner = (id, data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminPartnerConstants.EDIT_PARTNER_REQUEST });
        editPartner(id, data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.EDIT_PARTNER_SUCCESS });
                showMessage('success', 'Partner edited succcessfully!');
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.EDIT_PARTNER_FAILURE });
                let errorMsg = error && error.error ? error.error.filter(
                    (value) => value !== 'None'
                ) : ''
                if (errorMsg.length) {
                    showMessage('error', errorMsg[0]);
                }
            }
        )
    }
}

export const getAdminPartnerList = () => {
    return dispatch => {
        dispatch({ type: adminPartnerConstants.GET_PARTNER_LIST_REQUEST });
        getPartnerList().then(
            response => {
                dispatch({ type: adminPartnerConstants.GET_PARTNER_LIST_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminPartnerConstants.GET_PARTNER_LIST_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminSinglePartner = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminPartnerConstants.GET_PARTNER_REQUEST });
        getPartner(id).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.GET_PARTNER_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.GET_PARTNER_FAILURE });
                console.log(error)
            }
        )
    }
}

export const deleteAdminSinglePartner = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminPartnerConstants.DELETE_PARTNER_REQUEST });
        deletePartner(id).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.DELETE_PARTNER_SUCCESS });
                showMessage('success', 'Partner successfully removed!')
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.DELETE_PARTNER_FAILURE });
                console.log(error)
            }
        )
    }
}

export const adminSendReminder = (id, type, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminPartnerConstants.SEND_REMINDER_REQUEST });
        sendReportReminder(id, type).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.SEND_REMINDER_SUCCESS });
                showMessage('success', 'Reminder sent!');
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.SEND_REMINDER_FAILURE });
                console.log('error', error)
            }
        )
    }
}

export const resetEditPartner = () => {
    return dispatch => {
        dispatch({ type: adminPartnerConstants.RESET_EDIT_PARTNER });
    }
}

export const getAdminCountryList = () => {
    return dispatch => {
        dispatch({ type: adminPartnerConstants.GET_COUNTRY_LIST_REQUEST });
        getRegionList().then(
            response => {
                dispatch({ type: adminPartnerConstants.GET_COUNTRY_LIST_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminPartnerConstants.GET_COUNTRY_LIST_FAILURE });
                console.log(error)
            }
        )
    }
}

export const adminSetCutOffDate = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminPartnerConstants.SET_CUT_OFF_DATE_REQUEST });
        setReportCutOffDate(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.SET_CUT_OFF_DATE_SUCCESS });
                showMessage('success', 'Submission Date set successfully!')
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminPartnerConstants.SET_CUT_OFF_DATE_FAILURE });
                console.log('error', error)
            }
        )
    }
}

export const adminGetCutOffDate = () => {
    return dispatch => {
        dispatch({ type: adminPartnerConstants.GET_CUT_OFF_DATE_REQUEST });
        getReportCutOffDate().then(
            response => {
                dispatch({ type: adminPartnerConstants.GET_CUT_OFF_DATE_SUCCESS, data: response ? response : {} });
            }
        ).catch(
            error => {
                dispatch({ type: adminPartnerConstants.GET_CUT_OFF_DATE_FAILURE });
                console.log('error', error)
            }
        )
    }
}