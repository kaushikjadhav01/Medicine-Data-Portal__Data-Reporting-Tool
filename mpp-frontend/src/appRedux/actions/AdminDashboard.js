import {
    getProjectCount,
    getProductCompanyCount,
    getProductCountryCount,
    getCompanyCount,
    getCountryProduct,
    getSales,
    getDashboardSummary,
    sendReminderBulkMail,
} from '../../services';
import { adminDashboardConstants } from '../../constants'
import { hideLoader, showLoader } from './Loader';
import { showMessage } from '../../helpers';

export const projectCount = () => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminDashboardConstants.GET_PROJECT_COUNT_REQUEST });
        getProjectCount().then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminDashboardConstants.GET_PROJECT_COUNT_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminDashboardConstants.GET_PROJECT_COUNT_FAILURE });
            }
        )
    }
}

export const productCompanyCount = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PRODUCT_COMPANY_REQUEST });
        getProductCompanyCount().then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COMPANY_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COMPANY_FAILURE });
            }
        )
    }
}

export const productCountryCount = (status) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_REQUEST });
        getProductCountryCount(status).then(
            response => {
                if (status === 'Future-Quarters') {
                    dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_QUARTER_SUCCESS, data: response ? response : [] });
                } else {
                    dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_SUCCESS, data: response ? response : [] });
                }
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_FAILURE });
            }
        )
    }
}

export const companyCount = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COMPANY_REQUEST });
        getCompanyCount().then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_FAILURE });
            }
        )
    }
}


export const countryProduct = (type) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COUNTRY_PRODUCT_REQUEST });
        getCountryProduct(type).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_PRODUCT_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_PRODUCT_FAILURE });
            }
        )
    }
}


export const productCompanySales = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PRODUCT_COMPANY_SALES_REQUEST });
        getSales('product', 'company').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COMPANY_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COMPANY_SALES_FAILURE });
            }
        )
    }
}

export const productPeriodSales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PRODUCT_PERIOD_SALES_REQUEST });
        getSales('product', period).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_PERIOD_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_PERIOD_SALES_FAILURE });
            }
        )
    }
}

export const productCountrySales = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_SALES_REQUEST });
        getSales('product', 'country').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PRODUCT_COUNTRY_SALES_FAILURE });
            }
        )
    }
}

export const companyProductSales = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COMPANY_PRODUCT_SALES_REQUEST });
        getSales('company', 'product').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_PRODUCT_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_PRODUCT_SALES_FAILURE });
            }
        )
    }
}

export const companyPeriodSales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COMPANY_PERIOD_SALES_REQUEST });
        getSales('company', period).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_PERIOD_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_PERIOD_SALES_FAILURE });
            }
        )
    }
}

export const companyCountrySales = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COMPANY_COUNTRY_SALES_REQUEST });
        getSales('company', 'country').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_COUNTRY_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COMPANY_COUNTRY_SALES_FAILURE });
            }
        )
    }
}

export const countryProductSales = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COUNTRY_PRODUCT_SALES_REQUEST });
        getSales('country', 'product').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_PRODUCT_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_PRODUCT_SALES_FAILURE });
            }
        )
    }
}

export const countryPeriodSales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COUNTRY_PERIOD_SALES_REQUEST });
        getSales('country', period).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_PERIOD_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_PERIOD_SALES_FAILURE });
            }
        )
    }
}

export const countryCompanySales = () => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_COUNTRY_COMPANY_SALES_REQUEST });
        getSales('country', 'company').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_COMPANY_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_COUNTRY_COMPANY_SALES_FAILURE });
            }
        )
    }
}

export const periodProductSales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PERIOD_PRODUCT_SALES_REQUEST });
        getSales(period, 'product').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PERIOD_PRODUCT_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PERIOD_PRODUCT_SALES_FAILURE });
            }
        )
    }
}

export const periodCountrySales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PERIOD_COUNTRY_SALES_REQUEST });
        getSales(period, 'country').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PERIOD_COUNTRY_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PERIOD_COUNTRY_SALES_FAILURE });
            }
        )
    }
}

export const periodCompanySales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PERIOD_COMPANY_SALES_REQUEST });
        getSales(period, 'company').then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PERIOD_COMPANY_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PERIOD_COMPANY_SALES_FAILURE });
            }
        )
    }
}


export const packPeriodSales = (period) => {

    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_PACK_PERIOD_SALES_REQUEST });
        getSales('price_per_pack', period).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_PACK_PERIOD_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_PACK_PERIOD_SALES_FAILURE });
            }
        )
    }
}

export const treatmentPeriodSales = (period) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_TREATMENT_PERIOD_SALES_REQUEST });
        getSales('price_per_treatment', period).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_TREATMENT_PERIOD_SALES_SUCCESS, data: response ? response['rows'] : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_TREATMENT_PERIOD_SALES_FAILURE });
            }
        )
    }
}


export const adminDashboardSummary = (type) => {
    return dispatch => {
        dispatch({ type: adminDashboardConstants.GET_ADMIN_DASHBOARD_SUMMARY_REQUEST });
        getDashboardSummary(type).then(
            response => {
                dispatch({ type: adminDashboardConstants.GET_ADMIN_DASHBOARD_SUMMARY_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch({ type: adminDashboardConstants.GET_ADMIN_DASHBOARD_SUMMARY_FAILURE });
            }
        )
    }
}

export const bulkReminderMail = (data) => {
    return dispatch => {
        dispatch(showLoader())
        dispatch({ type: adminDashboardConstants.SEND_BULK_REMINDER_REQUEST });
        sendReminderBulkMail(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminDashboardConstants.SEND_BULK_REMINDER_SUCCESS });
                showMessage('success', 'Reminder sent!')
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminDashboardConstants.SEND_BULK_REMINDER_FAILURE });
            }
        )
    }
}
