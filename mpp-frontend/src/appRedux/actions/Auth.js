import { authConstants } from '../../constants';
import { hideLoader, showLoader } from './Loader';
import { login, changePassword, tokenValidate, passwordSet, forgotPassword } from '../../services';
import { showMessage } from '../../helpers'

export const userLogin = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader())
        login(data).then(
            response => {
                dispatch(hideLoader());
                if (!response) {
                    showMessage('error', 'User Does not exist');
                    dispatch({ type: authConstants.LOGIN_FAILURE });
                } else {
                    dispatch({ type: authConstants.LOGIN_SUCCESS });
                    localStorage.setItem('user', JSON.stringify(response));
                    showMessage('success', 'User logged in successfully');
                    if (onSuccess) {
                        onSuccess()
                    }
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.LOGIN_FAILURE });
                console.log(error)
            }
        )
    }
}

export const userLogout = () => {
    return dispatch => {
        dispatch({ type: authConstants.LOGOUT_SUCCESS });
        localStorage.removeItem('user');
    }
}

export const userChangePassword = (data) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: authConstants.CHANGE_PASSWORD_REQUEST });
        changePassword(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.CHANGE_PASSWORD_SUCCESS });
                showMessage('success', 'Password changed successfully');
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.CHANGE_PASSWORD_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const resetChangePassword = () => {
    return dispatch => dispatch({ type: authConstants.CHANGE_PASSWORD_REQUEST })
}

export const validateToken = (data) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: authConstants.VALIDATE_TOKEN_REQUEST });
        tokenValidate(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.VALIDATE_TOKEN_SUCCESS });
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.VALIDATE_TOKEN_FAILURE });
                console.log(error)
                showMessage('error', error.toString());
            }
        )
    }
}

export const setPassword = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: authConstants.SET_PASSWORD_REQUEST });
        passwordSet(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.SET_PASSWORD_SUCCESS });
                showMessage('success', 'Password set successfully');
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.SET_PASSWORD_FAILURE });
                showMessage('error', error['password'][0]);
            }
        )
    }
}

export const userForgetPassword = (data) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: authConstants.FORGOT_PASSWORD_REQUEST });
        forgotPassword(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.FORGOT_PASSWORD_SUCCESS });
                showMessage('success', 'Email to change password has been sent to given email id!');
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: authConstants.FORGOT_PASSWORD_FAILURE });
                if (error && error.email) {
                    showMessage('error', error.email[0]);
                }
            }
        )
    }
}