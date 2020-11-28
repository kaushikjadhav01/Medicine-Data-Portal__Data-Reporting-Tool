import { salesReportConstants } from '../../constants';

const initialSettings = {
    apiSalesList: {},
    fdfSalesList: {},
    apiSalesReportData: {},
    fdfSalesReportData: {},
    isLoaded: false
};

const SalesReport = (state = initialSettings, action) => {
    switch (action.type) {
        case salesReportConstants.GET_API_SALES_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_API_SALES_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                apiSalesList: action.data
            };
        case salesReportConstants.GET_API_SALES_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.GET_FDF_SALES_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_FDF_SALES_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                fdfSalesList: action.data
            };
        case salesReportConstants.GET_FDF_SALES_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.GET_CONSOLIDATED_API_SALES_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_CONSOLIDATED_API_SALES_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                apiSalesReportData: action.data
            };
        case salesReportConstants.GET_CONSOLIDATED_API_SALES_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.GET_CONSOLIDATED_FDF_SALES_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_CONSOLIDATED_FDF_SALES_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                fdfSalesReportData: action.data
            };
        case salesReportConstants.GET_CONSOLIDATED_FDF_SALES_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.GET_ADMIN_API_SALES_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_ADMIN_API_SALES_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                apiSalesList: action.data
            };
        case salesReportConstants.GET_ADMIN_API_SALES_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.GET_ADMIN_FDF_SALES_REPORT_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_ADMIN_FDF_SALES_REPORT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                fdfSalesList: action.data
            };
        case salesReportConstants.GET_ADMIN_FDF_SALES_REPORT_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.POST_API_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.POST_API_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.POST_API_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.POST_FDF_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.POST_FDF_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.POST_FDF_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.POST_ADMIN_API_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.POST_ADMIN_API_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.POST_ADMIN_API_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.POST_ADMIN_FDF_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.POST_ADMIN_FDF_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.POST_ADMIN_FDF_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.APPROVE_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.APPROVE_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.APPROVE_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.SUBMIT_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.SUBMIT_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.SUBMIT_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.DOWNLOAD_API_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.DOWNLOAD_API_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.DOWNLOAD_API_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.DOWNLOAD_FDF_SALES_REPORT_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.DOWNLOAD_FDF_SALES_REPORT_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.DOWNLOAD_FDF_SALES_REPORT_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.MESSAGE_READ_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.MESSAGE_READ_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.MESSAGE_READ_FAILURE:
            return {
                ...state,
            };

        case salesReportConstants.GET_PRODUCT_VERIFICATION_LIST_REQUEST:
            return {
                ...state,
                isLoaded: false
            };
        case salesReportConstants.GET_PRODUCT_VERIFICATION_LIST_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                productVerificationList: action.data
            };
        case salesReportConstants.GET_PRODUCT_VERIFICATION_LIST_FAILURE:
            return {
                ...state,
                isLoaded: true
            };

        case salesReportConstants.POST_PRODUCT_VERIFICATION_LIST_REQUEST:
            return {
                ...state,
            };
        case salesReportConstants.POST_PRODUCT_VERIFICATION_LIST_SUCCESS:
            return {
                ...state,
            };
        case salesReportConstants.POST_PRODUCT_VERIFICATION_LIST_FAILURE:
            return {
                ...state,
            };

        default:
            return state;
    }
};

export default SalesReport;
