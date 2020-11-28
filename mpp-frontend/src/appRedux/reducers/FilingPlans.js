import { filingPlansConstants } from '../../constants';

const initialSettings = {
    plansList: {},
    plansReportData: {},
    isLoaded: false
};

const FilingPlans = (state = initialSettings, action) => {
    switch (action.type) {
        case filingPlansConstants.GET_FILING_PLANS_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case filingPlansConstants.GET_FILING_PLANS_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                plansList: action.data
            };
        case filingPlansConstants.GET_FILING_PLANS_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case filingPlansConstants.GET_FILING_PLANS_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case filingPlansConstants.GET_FILING_PLANS_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                plansReportData: action.data
            };
        case filingPlansConstants.GET_FILING_PLANS_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case filingPlansConstants.GET_ADMIN_FILING_PLANS_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case filingPlansConstants.GET_ADMIN_FILING_PLANS_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                plansList: action.data
            };
        case filingPlansConstants.GET_ADMIN_FILING_PLANS_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case filingPlansConstants.POST_FILING_PLANS_REQUEST:
            return {
                ...state,
            };
        case filingPlansConstants.POST_FILING_PLANS_SUCCESS:
            return {
                ...state,
            };
        case filingPlansConstants.POST_FILING_PLANS_FAILURE:
            return {
                ...state,
            };

        case filingPlansConstants.POST_ADMIN_FILING_PLANS_REQUEST:
            return {
                ...state,
            };
        case filingPlansConstants.POST_ADMIN_FILING_PLANS_SUCCESS:
            return {
                ...state,
            };
        case filingPlansConstants.POST_ADMIN_FILING_PLANS_FAILURE:
            return {
                ...state,
            };

        case filingPlansConstants.APPROVE_FILING_PLANS_REQUEST:
            return {
                ...state,
            };
        case filingPlansConstants.APPROVE_FILING_PLANS_SUCCESS:
            return {
                ...state,
            };
        case filingPlansConstants.APPROVE_FILING_PLANS_FAILURE:
            return {
                ...state,
            };

        case filingPlansConstants.REPORT_FILING_PLANS_REQUEST:
            return {
                ...state,
            };
        case filingPlansConstants.REPORT_FILING_PLANS_SUCCESS:
            return {
                ...state,
            };
        case filingPlansConstants.REPORT_FILING_PLANS_FAILURE:
            return {
                ...state,
            };

        case filingPlansConstants.REPORT_DOWNLOAD_FILING_PLANS_REQUEST:
            return {
                ...state,
            };
        case filingPlansConstants.REPORT_DOWNLOAD_FILING_PLANS_SUCCESS:
            return {
                ...state,
            };
        case filingPlansConstants.REPORT_DOWNLOAD_FILING_PLANS_FAILURE:
            return {
                ...state,
            };


        case filingPlansConstants.MESSAGE_READ_REQUEST:
            return {
                ...state,
            };
        case filingPlansConstants.MESSAGE_READ_SUCCESS:
            return {
                ...state,
            };
        case filingPlansConstants.MESSAGE_READ_FAILURE:
            return {
                ...state,
            };

        default:
            return state;
    }
};

export default FilingPlans;
