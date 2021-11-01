import * as actionTypes from '../actions/actionTypes';

const initialState = {
	isAuth: false,
	error: null,
	loading: false
}

const authReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.AUTH_START :
			return {
				...state,
				error: null,
				loading: true
			}
		case actionTypes.AUTH_FAIL:
			return  {
				...state,
				error: action.error,
				loading: false
			}
		case actionTypes.AUTH_SUCCESS:
			return {
				...state,
				isAuth: true,
				error: null,
				loading: false
			}
		case actionTypes.SET_AUTH:
			return {
				...state,
				isAuth: true,
			}
		case actionTypes.LOGOUT:
			localStorage.clear()
			window.location.href = '/';
			return {
				...state,
				isAuth: false
			}
		default:
			return state
	}
}

export default authReducer;
