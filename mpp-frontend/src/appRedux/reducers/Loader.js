import { loaderConstants } from '../../constants';


const initialSettings = {
    showLoader: false
};

const Loader = (state = initialSettings, action) => {
    switch (action.type) {
        case loaderConstants.SHOW_LOADER:
            return {
                ...state,
                showLoader: true
            };
        case loaderConstants.HIDE_LOADER:
            return {
                ...state,
                showLoader: false
            };
        default:
            return state;
    }
};

export default Loader;
