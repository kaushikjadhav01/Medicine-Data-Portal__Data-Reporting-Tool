import { loaderConstants } from '../../constants';

export const showLoader = () => {
    return (dispatch) => {
        dispatch({
            type: loaderConstants.SHOW_LOADER,
        });
    }
}

export const hideLoader = () => {
    return (dispatch) => {
        dispatch({
            type: loaderConstants.HIDE_LOADER,
        });
    }
}
