import { authConstants } from '../../constants';

const initialSettings = {
    isUserLoggedIn: false,
    changePasswordSuccess: false,
    validateTokenSuccess: false,
    setPasswordSuccess: false,
    isMailSend: false
};

const UserAuthentication = (state = initialSettings, action) => {
    switch (action.type) {

        case authConstants.LOGIN_SUCCESS:
            return {
                ...state,
                isUserLoggedIn: true
            };
        case authConstants.LOGIN_FAILURE:
            return {
                ...state,
                isUserLoggedIn: false
            };

        case authConstants.LOGOUT_SUCCESS:
            return {
                ...state,
                isUserLoggedIn: false
            };

        case authConstants.CHANGE_PASSWORD_REQUEST:
            return {
                ...state,
                changePasswordSuccess: false
            };
        case authConstants.CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                changePasswordSuccess: true
            };
        case authConstants.CHANGE_PASSWORD_FAILURE:
            return {
                ...state,
                changePasswordSuccess: false
            };

        case authConstants.VALIDATE_TOKEN_REQUEST:
            return {
                ...state,
                validateTokenSuccess: false
            };
        case authConstants.VALIDATE_TOKEN_SUCCESS:
            return {
                ...state,
                validateTokenSuccess: true
            };
        case authConstants.VALIDATE_TOKEN_FAILURE:
            return {
                ...state,
                validateTokenSuccess: false
            };

        case authConstants.SET_PASSWORD_REQUEST:
            return {
                ...state,
                setPasswordSuccess: false
            };
        case authConstants.SET_PASSWORD_SUCCESS:
            return {
                ...state,
                setPasswordSuccess: true
            };
        case authConstants.SET_PASSWORD_FAILURE:
            return {
                ...state,
                setPasswordSuccess: false
            };

        case authConstants.FORGOT_PASSWORD_REQUEST:
            return {
                ...state,
                isMailSend: false
            };
        case authConstants.FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isMailSend: true
            };
        case authConstants.FORGOT_PASSWORD_FAILURE:
            return {
                ...state,
                isMailSend: false
            };

        default:
            return state;
    }
};

export default UserAuthentication;
