import { adminPartnerConstants } from '../../constants';


const initialSettings = {
    isPartnerAdded: false,
    isPartnerEdited: false,
    isPartnerDeleted: false,
    setCutoffSuccess: false,
    partnerList: [],
    countryList: [],
    partnerDetails: {},
    cutOffDate: {},
    isLoaded: false
};

const AdminPartner = (state = initialSettings, action) => {
    switch (action.type) {
        case adminPartnerConstants.ADD_PARTNER_REQUEST:
            return {
                ...state,
                isPartnerAdded: false
            };
        case adminPartnerConstants.ADD_PARTNER_SUCCESS:
            return {
                ...state,
                isPartnerAdded: true
            };
        case adminPartnerConstants.ADD_PARTNER_FAILURE:
            return {
                ...state,
                isPartnerAdded: false
            };

        case adminPartnerConstants.EDIT_PARTNER_REQUEST:
            return {
                ...state,
                isPartnerEdited: false
            };
        case adminPartnerConstants.EDIT_PARTNER_SUCCESS:
            return {
                ...state,
                isPartnerEdited: true
            };
        case adminPartnerConstants.EDIT_PARTNER_FAILURE:
            return {
                ...state,
                isPartnerEdited: false
            };

        case adminPartnerConstants.DELETE_PARTNER_REQUEST:
            return {
                ...state,
                isPartnerDeleted: false
            };
        case adminPartnerConstants.DELETE_PARTNER_SUCCESS:
            return {
                ...state,
                isPartnerDeleted: true
            };
        case adminPartnerConstants.DELETE_PARTNER_FAILURE:
            return {
                ...state,
                isPartnerDeleted: false
            };

        case adminPartnerConstants.RESET_EDIT_PARTNER:
            return {
                ...state,
                isPartnerEdited: false,
                isPartnerAdded: false
            };

        case adminPartnerConstants.GET_PARTNER_LIST_REQUEST:
            return {
                ...state,
                isLoaded: false,
            };
        case adminPartnerConstants.GET_PARTNER_LIST_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                partnerList: action.data
            };
        case adminPartnerConstants.GET_PARTNER_LIST_FAILURE:
            return {
                ...state,
                isLoaded: true,
            };
        case adminPartnerConstants.GET_PARTNER_REQUEST:
            return {
                ...state,
                isLoaded: false,
            };
        case adminPartnerConstants.GET_PARTNER_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                partnerDetails: action.data
            };
        case adminPartnerConstants.GET_PARTNER_FAILURE:
            return {
                ...state,
                isLoaded: true,
            };
        case adminPartnerConstants.GET_COUNTRY_LIST_REQUEST:
            return {
                ...state,
            };
        case adminPartnerConstants.GET_COUNTRY_LIST_SUCCESS:
            return {
                ...state,
                countryList: action.data
            };
        case adminPartnerConstants.GET_COUNTRY_LIST_FAILURE:
            return {
                ...state,
            };
        case adminPartnerConstants.SEND_REMINDER_REQUEST:
            return {
                ...state
            };
        case adminPartnerConstants.SEND_REMINDER_SUCCESS:
            return {
                ...state
            };
        case adminPartnerConstants.SEND_REMINDER_FAILURE:
            return {
                ...state
            };
        case adminPartnerConstants.SET_CUT_OFF_DATE_REQUEST:
            return {
                ...state,
                setCutoffSuccess: false
            };
        case adminPartnerConstants.SET_CUT_OFF_DATE_SUCCESS:
            return {
                ...state,
                setCutoffSuccess: true
            };
        case adminPartnerConstants.SET_CUT_OFF_DATE_FAILURE:
            return {
                ...state,
                setCutoffSuccess: false
            };
        case adminPartnerConstants.GET_CUT_OFF_DATE_REQUEST:
            return {
                ...state,
                isLoaded: false,
            };
        case adminPartnerConstants.GET_CUT_OFF_DATE_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                cutOffDate: action.data
            };
        case adminPartnerConstants.GET_CUT_OFF_DATE_FAILURE:
            return {
                ...state,
                isLoaded: true,
            };
        default:
            return state;
    }
};

export default AdminPartner;
