import { adminDashboardConstants } from '../../constants';


const initialSettings = {
    project_count: [],
    isProjectCountLoaded: false,

    product_company_count: [],
    isProductCompanyCountLoaded: false,

    product_country_count: [],
    isProductCountryCountLoaded: false,

    product_country_quarter_count: [],
    future_quarters:[],
    isProductCountryQuarterCountLoaded: false,

    company_count: [],
    isCompanyCountLoaded: false,
    
    country_product_count:[],
    isCountryProductLoaded: false,

    product_company_sales:[],
    isProductCompanySalesLoaded: false,

    product_period_sales:[],
    isProductPeriodSalesLoaded: false,

    product_country_sales:[],
    isProductCountrySalesLoaded: false,

    company_product_sales:[],
    isCompanyProductSalesLoaded: false,

    company_period_sales:[],
    isCompanyPeriodSalesLoaded: false,

    company_country_sales:[],
    isCompanyCountrySalesLoaded: false,

    country_product_sales:[],
    isCountryProductSalesLoaded: false,

    country_period_sales:[],
    isCountryPeriodSalesLoaded: false,

    country_company_sales:[],
    isCountryCompanySalesLoaded: false,

    period_product_sales:[],
    isPeriodProductSalesLoaded: false,

    period_country_sales:[],
    isPeriodCountrySalesLoaded: false,

    period_company_sales:[],
    isPeriodCompanySalesLoaded: false,

    pack_period_sales:[],
    isPackPeriodSalesLoaded: false,

    treatment_period_sales:[],
    isTreatmentPeriodSalesLoaded: false,

    admin_dashboard_summary:[],
    isAdminDashboardSummaryLoaded: false,

    setBulkReminderSuccess: false

};

const AdminDashboard = (state = initialSettings, action) => {
    switch (action.type) {
        //Project Count
        case adminDashboardConstants.GET_PROJECT_COUNT_REQUEST:
            return {
                ...state,
                isProjectCountLoaded: false
            };

        case adminDashboardConstants.GET_PROJECT_COUNT_SUCCESS:
            return {
                ...state,
                project_count: action.data,
                isProjectCountLoaded: true
            };

        case adminDashboardConstants.GET_PROJECT_COUNT_FAILURE:
            return {
                ...state,
                isProjectCountLoaded: true
            };
        
        //Product Company Count
        case adminDashboardConstants.GET_PRODUCT_COMPANY_REQUEST:
            return {
                ...state,
                isProductCompanyCountLoaded: false
            };

        case adminDashboardConstants.GET_PRODUCT_COMPANY_SUCCESS:
            return {
                ...state,
                product_company_count: action.data,
                isProductCompanyCountLoaded: true
            };

        case adminDashboardConstants.GET_PRODUCT_COMPANY_FAILURE:
            return {
                ...state,
                isProductCompanyCountLoaded: true
            };

        //Product Country Count
        case adminDashboardConstants.GET_PRODUCT_COUNTRY_REQUEST:
            return {
                ...state,
                isProductCountryCountLoaded: false
            };

        case adminDashboardConstants.GET_PRODUCT_COUNTRY_SUCCESS:
            return {
                ...state,
                product_country_count: action.data,
                isProductCountryCountLoaded: true
            };

        case adminDashboardConstants.GET_PRODUCT_COUNTRY_QUARTER_SUCCESS:
            return {
                ...state,
                product_country_count: action.data['rows'],
                future_quarters: action.data['quarter_list'],
                isProductCountryCountLoaded: true
            };

        case adminDashboardConstants.GET_PRODUCT_COUNTRY_FAILURE:
            return {
                ...state,
                isProductCountryCountLoaded: true
            };

        
        //Company Count
        case adminDashboardConstants.GET_COMPANY_REQUEST:
            return {
                ...state,
                isCompanyCountLoaded: false
            };

        case adminDashboardConstants.GET_COMPANY_SUCCESS:
            return {
                ...state,
                company_count: action.data,
                isCompanyCountLoaded: true
            };

        case adminDashboardConstants.GET_COMPANY_FAILURE:
            return {
                ...state,
                isCompanyCountLoaded: true
            };

        //Country By Product By Partner/Status
        case adminDashboardConstants.GET_COUNTRY_PRODUCT_REQUEST:
            return {
                ...state,
                isCountryProductLoaded: false
            };

        case adminDashboardConstants.GET_COUNTRY_PRODUCT_SUCCESS:
            return {
                ...state,
                country_product_count: action.data,
                isCountryProductLoaded: true
            };

        case adminDashboardConstants.GET_COUNTRY_PRODUCT_FAILURE:
            return {
                ...state,
                isCountryProductLoaded: true
            };

        //Product By Company By Sales
        case adminDashboardConstants.GET_PRODUCT_COMPANY_SALES_REQUEST:
            return {
                ...state,
                isCountryProductstatusLoaded: false
            };

        case adminDashboardConstants.GET_PRODUCT_COMPANY_SALES_SUCCESS:
            return {
                ...state,
                product_company_sales: action.data,
                isProductCompanySalesLoaded: true
            };

        case adminDashboardConstants.GET_PRODUCT_COMPANY_SALES_FAILURE:
            return {
                ...state,
                isCountryProductStatusLoaded: true
            };

        //Product By Period By Sales
        case adminDashboardConstants.GET_PRODUCT_PERIOD_SALES_REQUEST:
            return {
                ...state,
                isProductPeriodSalesLoaded: false
            };

        case adminDashboardConstants.GET_PRODUCT_PERIOD_SALES_SUCCESS:
            return {
                ...state,
                product_period_sales: action.data,
                isProductPeriodSalesLoaded: true
            };

        case adminDashboardConstants.GET_PRODUCT_PERIOD_SALES_FAILURE:
            return {
                ...state,
                isProductPeriodSalesLoaded: true
            };


        //Product By Country By Sales
        case adminDashboardConstants.GET_PRODUCT_COUNTRY_SALES_REQUEST:
            return {
                ...state,
                isProductCountrySalesLoaded: false
            };

        case adminDashboardConstants.GET_PRODUCT_COUNTRY_SALES_SUCCESS:
            return {
                ...state,
                product_country_sales: action.data,
                isProductCountrySalesLoaded: true
            };

        case adminDashboardConstants.GET_PRODUCT_COUNTRY_SALES_FAILURE:
            return {
                ...state,
                isProductCountrySalesLoaded: true
            };

        //Company By Product By Sales
        case adminDashboardConstants.GET_COMPANY_PRODUCT_SALES_REQUEST:
            return {
                ...state,
                isCompanyProductSalesLoaded: false
            };

        case adminDashboardConstants.GET_COMPANY_PRODUCT_SALES_SUCCESS:
            return {
                ...state,
                company_product_sales: action.data,
                isCompanyProductSalesLoaded: true
            };

        case adminDashboardConstants.GET_COMPANY_PRODUCT_SALES_FAILURE:
            return {
                ...state,
                isCompanyProductSalesLoaded: true
            };

        //Company By Period By Sales
        case adminDashboardConstants.GET_COMPANY_PERIOD_SALES_REQUEST:
            return {
                ...state,
                isCompanyPeriodSalesLoaded: false
            };

        case adminDashboardConstants.GET_COMPANY_PERIOD_SALES_SUCCESS:
            return {
                ...state,
                company_period_sales: action.data,
                isCompanyPeriodSalesLoaded: true
            };

        case adminDashboardConstants.GET_COMPANY_PERIOD_SALES_FAILURE:
            return {
                ...state,
                isCompanyPeriodSalesLoaded: true
            };

        //Company By Country By Sales
        case adminDashboardConstants.GET_COMPANY_COUNTRY_SALES_REQUEST:
            return {
                ...state,
                isCompanyCountrySalesLoaded: false
            };

        case adminDashboardConstants.GET_COMPANY_COUNTRY_SALES_SUCCESS:
            return {
                ...state,
                company_country_sales: action.data,
                isCompanyCountrySalesLoaded: true
            };

        case adminDashboardConstants.GET_COMPANY_COUNTRY_SALES_FAILURE:
            return {
                ...state,
                isCompanyCountrySalesLoaded: true
            };

        //Country By Product By Sales
        case adminDashboardConstants.GET_COUNTRY_PRODUCT_SALES_REQUEST:
            return {
                ...state,
                isCountryProductSalesLoaded: false
            };

        case adminDashboardConstants.GET_COUNTRY_PRODUCT_SALES_SUCCESS:
            return {
                ...state,
                country_product_sales: action.data,
                isCountryProductSalesLoaded: true
            };

        case adminDashboardConstants.GET_COUNTRY_PRODUCT_SALES_FAILURE:
            return {
                ...state,
                isCountryProductSalesLoaded: true
            };


        //Country By Period By Sales
        case adminDashboardConstants.GET_COUNTRY_PERIOD_SALES_REQUEST:
            return {
                ...state,
                isCountryPeriodSalesLoaded: false
            };

        case adminDashboardConstants.GET_COUNTRY_PERIOD_SALES_SUCCESS:
            return {
                ...state,
                country_period_sales: action.data,
                isCountryPeriodSalesLoaded: true
            };

        case adminDashboardConstants.GET_COUNTRY_PERIOD_SALES_FAILURE:
            return {
                ...state,
                isCountryPeriodSalesLoaded: true
            };

        //Country By Company By Sales
        case adminDashboardConstants.GET_COUNTRY_COMPANY_SALES_REQUEST:
            return {
                ...state,
                isCountryCompanySalesLoaded: false
            };

        case adminDashboardConstants.GET_COUNTRY_COMPANY_SALES_SUCCESS:
            return {
                ...state,
                country_company_sales: action.data,
                isCountryCompanySalesLoaded: true
            };

        case adminDashboardConstants.GET_COUNTRY_COMPANY_SALES_FAILURE:
            return {
                ...state,
                isCountryCompanySalesLoaded: true
            };

        //Period By Product By Sales
        case adminDashboardConstants.GET_PERIOD_PRODUCT_SALES_REQUEST:
            return {
                ...state,
                isPeriodProductSalesLoaded: false
            };

        case adminDashboardConstants.GET_PERIOD_PRODUCT_SALES_SUCCESS:
            return {
                ...state,
                period_product_sales: action.data,
                isPeriodProductSalesLoaded: true
            };

        case adminDashboardConstants.GET_PERIOD_PRODUCT_SALES_FAILURE:
            return {
                ...state,
                isPeriodProductSalesLoaded: true
            };

        //Period By Country By Sales
        case adminDashboardConstants.GET_PERIOD_COUNTRY_SALES_REQUEST:
            return {
                ...state,
                isPeriodCountrySalesLoaded: false
            };

        case adminDashboardConstants.GET_PERIOD_COUNTRY_SALES_SUCCESS:
            return {
                ...state,
                period_country_sales: action.data,
                isPeriodCountrySalesLoaded: true
            };

        case adminDashboardConstants.GET_PERIOD_COUNTRY_SALES_FAILURE:
            return {
                ...state,
                isPeriodCountrySalesLoaded: true
            };
        
        //Period By Company By Sales
        case adminDashboardConstants.GET_PERIOD_COMPANY_SALES_REQUEST:
            return {
                ...state,
                isPeriodCompanySalesLoaded: false
            };

        case adminDashboardConstants.GET_PERIOD_COMPANY_SALES_SUCCESS:
            return {
                ...state,
                period_company_sales: action.data,
                isPeriodCompanySalesLoaded: true
            };

        case adminDashboardConstants.GET_PERIOD_COMPANY_SALES_FAILURE:
            return {
                ...state,
                isPeriodCompanySalesLoaded: true
            };
        
        //Pack By Period By Sales
        case adminDashboardConstants.GET_PACK_PERIOD_SALES_REQUEST:
            return {
                ...state,
                isPackPeriodSalesLoaded: false
            };

        case adminDashboardConstants.GET_PACK_PERIOD_SALES_SUCCESS:
            return {
                ...state,
                pack_period_sales: action.data,
                isPackPeriodSalesLoaded: true
            };

        case adminDashboardConstants.GET_PACK_PERIOD_SALES_FAILURE:
            return {
                ...state,
                isPackPeriodSalesLoaded: true
            };

        //Treatment By Period By Sales
        case adminDashboardConstants.GET_TREATMENT_PERIOD_SALES_REQUEST:
            return {
                ...state,
                isTreatmentPeriodSalesLoaded: false
            };

        case adminDashboardConstants.GET_TREATMENT_PERIOD_SALES_SUCCESS:
            return {
                ...state,
                treatment_period_sales: action.data,
                isTreatmentPeriodSalesLoaded: true
            };

        case adminDashboardConstants.GET_TREATMENT_PERIOD_SALES_FAILURE:
            return {
                ...state,
                isTreatmentPeriodSalesLoaded: true
            };
        
        
        //Admin Dashboard Summary
        case adminDashboardConstants.GET_ADMIN_DASHBOARD_SUMMARY_REQUEST:
            return {
                ...state,
                isAdminDashboardSummaryLoaded: false
            };

        case adminDashboardConstants.GET_ADMIN_DASHBOARD_SUMMARY_SUCCESS:
            return {
                ...state,
                admin_dashboard_summary: action.data,
                isAdminDashboardSummaryLoaded: true
            };

        case adminDashboardConstants.GET_ADMIN_DASHBOARD_SUMMARY_FAILURE:
            return {
                ...state,
                isAdminDashboardSummaryLoaded: true
            };

        
        //Admin Dashboard Bulk Reminder
        case adminDashboardConstants.SEND_BULK_REMINDER_REQUEST:
            return {
                ...state,
                setBulkReminderSuccess: false
            };

        case adminDashboardConstants.SEND_BULK_REMINDER_SUCCESS:
            return {
                ...state,
                setBulkReminderSuccess: true
            };

        case adminDashboardConstants.SEND_BULK_REMINDER_FAILURE:
            return {
                ...state,
                setBulkReminderSuccess: true
            };

        default:
            return state;
    }
};

export default AdminDashboard;
