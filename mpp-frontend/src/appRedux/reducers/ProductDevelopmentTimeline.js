import { pdtConstants } from '../../constants';

const initialSettings = {
    pdtList: {},
    pdtReportData: {},
    isLoaded: false
};

const ProductDevelopmentTimeline = (state = initialSettings, action) => {
    switch (action.type) {
        case pdtConstants.GET_PDT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case pdtConstants.GET_PDT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                pdtList: action.data
            };
        case pdtConstants.GET_PDT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case pdtConstants.GET_PDT_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case pdtConstants.GET_PDT_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                pdtReportData: action.data
            };
        case pdtConstants.GET_PDT_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case pdtConstants.GET_ADMIN_PDT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case pdtConstants.GET_ADMIN_PDT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                pdtList: action.data
            };
        case pdtConstants.GET_ADMIN_PDT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case pdtConstants.POST_PDT_REQUEST:
            return {
                ...state,
            };
        case pdtConstants.POST_PDT_SUCCESS:
            return {
                ...state,
            };
        case pdtConstants.POST_PDT_FAILURE:
            return {
                ...state,
            };

        case pdtConstants.POST_ADMIN_PDT_REQUEST:
            return {
                ...state,
            };
        case pdtConstants.POST_ADMIN_PDT_SUCCESS:
            return {
                ...state,
            };
        case pdtConstants.POST_ADMIN_PDT_FAILURE:
            return {
                ...state,
            };

        case pdtConstants.APPROVE_PDT_REQUEST:
            return {
                ...state,
            };
        case pdtConstants.APPROVE_PDT_SUCCESS:
            return {
                ...state,
            };
        case pdtConstants.APPROVE_PDT_FAILURE:
            return {
                ...state,
            };

        case pdtConstants.REPORT_PDT_REQUEST:
            return {
                ...state,
            };
        case pdtConstants.REPORT_PDT_SUCCESS:
            return {
                ...state,
            };
        case pdtConstants.REPORT_PDT_FAILURE:
            return {
                ...state,
            };

        case pdtConstants.REPORT_DOWNLOAD_PDT_REQUEST:
            return {
                ...state,
            };
        case pdtConstants.REPORT_DOWNLOAD_PDT_SUCCESS:
            return {
                ...state,
            };
        case pdtConstants.REPORT_DOWNLOAD_PDT_FAILURE:
            return {
                ...state,
            };

        case pdtConstants.MESSAGE_READ_REQUEST:
            return {
                ...state,
            };
        case pdtConstants.MESSAGE_READ_SUCCESS:
            return {
                ...state,
            };
        case pdtConstants.MESSAGE_READ_FAILURE:
            return {
                ...state,
            };

        default:
            return state;
    }
};

export default ProductDevelopmentTimeline;
