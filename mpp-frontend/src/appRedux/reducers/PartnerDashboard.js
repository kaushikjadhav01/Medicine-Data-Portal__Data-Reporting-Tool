import { partnerDashboardConstants } from '../../constants';


const initialSettings = {
    partnerList: [],
    isLoaded: false
};

const partnerDashboard = (state = initialSettings, action) => {
    switch (action.type) {
        
        case partnerDashboardConstants.GET_DASHBOARD_REQUEST:
            return {
                ...state,
                isLoaded: false,
            };
        case partnerDashboardConstants.GET_DASHBOARD_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                partnerList: action.data
            };
        case partnerDashboardConstants.GET_DASHBOARD_FAILURE:
            return {
                ...state,
                isLoaded: true,
            };
        default:
            return state;
    }
};

export default partnerDashboard;
