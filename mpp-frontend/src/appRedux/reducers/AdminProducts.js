import { adminProductConstants } from '../../constants';


const initialSettings = {
    isProductAdded: false,
    isProductEdited: false,
    isProductLoaded:false,
    productList: [],
    productItem: {},
    productDetails: {},
    isLoaded: false
};

const AdminProducts = (state = initialSettings, action) => {
    switch (action.type) {
        case adminProductConstants.ADD_PRODUCT_REQUEST:
            return {
                ...state,
                isProductAdded: false
            };
        case adminProductConstants.ADD_PRODUCT_SUCCESS:
            return {
                ...state,
                isProductAdded: true
            };
        case adminProductConstants.ADD_PRODUCT_FAILURE:
            return {
                ...state,
                isProductAdded: false
            };

        case adminProductConstants.EDIT_PRODUCT_REQUEST:
            return {
                ...state,
                isProductEdited: false
            };
        case adminProductConstants.EDIT_PRODUCT_SUCCESS:
            return {
                ...state,
                isProductEdited: true
            };
        case adminProductConstants.EDIT_PRODUCT_FAILURE:
            return {
                ...state,
                isProductEdited: false
            };

        case adminProductConstants.DELETE_PRODUCT_REQUEST:
            return {
                ...state,
            };
        case adminProductConstants.DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
            };
        case adminProductConstants.DELETE_PRODUCT_FAILURE:
            return {
                ...state,
            };

        case adminProductConstants.GET_PRODUCT_LIST_REQUEST:
            return {
                ...state,
                isLoaded: false,
            };
        case adminProductConstants.GET_PRODUCT_LIST_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                productList: action.data
            };
        case adminProductConstants.GET_PRODUCT_LIST_FAILURE:
            return {
                ...state,
                isLoaded: true,
            };

        case adminProductConstants.GET_PRODUCT_REQUEST:
            return {
                ...state,
                isLoaded: false,
            };
        case adminProductConstants.GET_PRODUCT_SUCCESS:
            return {
                ...state,
                isLoaded: true,
                productItem: action.data
            };
        case adminProductConstants.GET_PRODUCT_FAILURE:
            return {
                ...state,
                isLoaded: true,
            };

        case adminProductConstants.RESET_PRODUCT:
            return {
                ...state,
                isProductAdded: false,
                isProductEdited: false
            }

        case adminProductConstants.GET_PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                isProductLoaded: false,
            };
        case adminProductConstants.GET_PRODUCT_DETAILS_SUCCESS:
            return {
                ...state,
                isProductLoaded: true,
                productDetails: action.data
            };
        case adminProductConstants.GET_PRODUCT_DETAILS_FAILURE:
            return {
                ...state,
                isLoisProductLoadedaded: true,
            };
        default:
            return state;
    }
};

export default AdminProducts;
