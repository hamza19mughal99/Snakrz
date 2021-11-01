import * as actionTypes from '../actions/types';

const initialState = {
	isVendorAuth: false,
	error: null,
	loading: false
}

const vendorAuthReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.VENDOR_AUTH_START :
			return {
				...state,
				error: null,
				loading: true
			}
		case actionTypes.VENDOR_AUTH_FAIL:
			return  {
				...state,
				error: action.error,
				loading: false
			}
		case actionTypes.VENDOR_AUTH_SUCCESS:
			return {
				...state,
				isVendorAuth: true,
				error: null,
				loading: true
			}
		case actionTypes.VENDOR_SET_AUTH:
			return {
				...state,
				isVendorAuth: true,
			}
		case actionTypes.VENDOR_LOGOUT:
			localStorage.removeItem('vendorToken');
			window.location.href = '/';
			return {
				...state,
				isVendorAuth: false
			}
		default:
			return state
	}
}

export default vendorAuthReducer;
