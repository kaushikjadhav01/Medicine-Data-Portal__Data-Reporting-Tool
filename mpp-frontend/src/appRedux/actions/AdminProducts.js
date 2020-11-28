import { adminProductConstants } from '../../constants';
import { hideLoader, showLoader } from './Loader';
import { addProduct, deleteProduct, editProduct, getProduct, getProductDetails, getProductList } from '../../services';
import { showMessage } from '../../helpers'

export const adminAddProduct = (data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminProductConstants.ADD_PRODUCT_REQUEST });
        addProduct(data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.ADD_PRODUCT_SUCCESS });
                showMessage('success', 'Product added succcessfully!');
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.ADD_PRODUCT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const adminEditProduct = (id, data, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminProductConstants.EDIT_PRODUCT_REQUEST });
        editProduct(id, data).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.EDIT_PRODUCT_SUCCESS });
                showMessage('success', 'Product edited succcessfully!');
                if (onSuccess) {
                    onSuccess()
                }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.EDIT_PRODUCT_FAILURE });
                showMessage('error', error.toString());
            }
        )
    }
}

export const getAdminProductList = (showRecent) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminProductConstants.GET_PRODUCT_LIST_REQUEST });
        getProductList(showRecent).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.GET_PRODUCT_LIST_SUCCESS, data: response ? response : [] });
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.GET_PRODUCT_LIST_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminProduct = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminProductConstants.GET_PRODUCT_REQUEST });
        getProduct(id).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.GET_PRODUCT_SUCCESS, data: response ? response : {} });
                if (onSuccess) { onSuccess() }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.GET_PRODUCT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const deleteAdminProduct = (id, onSuccess) => {
    return dispatch => {
        dispatch(showLoader());
        dispatch({ type: adminProductConstants.DELETE_PRODUCT_REQUEST });
        deleteProduct(id).then(
            response => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.DELETE_PRODUCT_SUCCESS });
                showMessage('success', 'Product Deactivated!')
                if (onSuccess) { onSuccess() }
            }
        ).catch(
            error => {
                dispatch(hideLoader());
                dispatch({ type: adminProductConstants.DELETE_PRODUCT_FAILURE });
                console.log(error)
            }
        )
    }
}

export const getAdminProductDetails = (data, onSuccess) => {
    return dispatch => {
        dispatch({ type: adminProductConstants.GET_PRODUCT_DETAILS_REQUEST });
        getProductDetails(data).then(
            response => {
                dispatch({ type: adminProductConstants.GET_PRODUCT_DETAILS_SUCCESS, data: response ? response : {} });
                if (onSuccess) {
                    onSuccess(response ? response : {})
                }
            }
        ).catch(
            error => {
                dispatch({ type: adminProductConstants.GET_PRODUCT_DETAILS_FAILURE });
                console.log(error)
            }
        )
    }
}

export const resetProduct = () => {
    return dispatch => {
        dispatch({ type: adminProductConstants.RESET_PRODUCT });
    }
}