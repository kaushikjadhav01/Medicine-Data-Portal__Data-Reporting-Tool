import { partnerDashboardConstants } from '../../constants';
import { getPartnerDashboard } from '../../services';
import { hideLoader, showLoader } from './Loader';

export const getPartnerDashboardAction = () => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: partnerDashboardConstants.GET_DASHBOARD_REQUEST });
        getPartnerDashboard().then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: partnerDashboardConstants.GET_DASHBOARD_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch(showLoader());
                dispatch({ type: partnerDashboardConstants.GET_DASHBOARD_FAILURE });
                console.log(error)
            }
        )
    }
}

