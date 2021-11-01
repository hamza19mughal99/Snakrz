import * as actionTypes from '../actions/types';

const initialState = {
	menu: null,
	loading: false,
	submitLoader: false,
	storeId: null
}


const staffReducer = (state = initialState, action) => {
	switch (action.type){
		case actionTypes.CREATE_STAFF_START:
			return {
				...state,
				submitLoader: true
			}

		case actionTypes.CREATE_STAFF_SUCCESS:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.CREATE_STAFF_FAIL:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.FETCH_STAFF_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.FETCH_STAFF_SUCCESS:
			return {
				...state,
				menu: action.payload.staffData,
				storeId: action.payload.staffData._id,
				loading: false
			}

		case actionTypes.FETCH_STAFF_FAIL:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.EDIT_STAFF_START:
			return {
				...state,
				submitLoader: true
			}

		case actionTypes.EDIT_STAFF_SUCCESS:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.EDIT_STAFF_FAIL:
			return {
				...state,
				loading: false
			}
		case actionTypes.DELETE_STAFF_START:
			return {
				...state,
				submitLoader: true
			}

		case actionTypes.DELETE_STAFF_SUCCESS:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.DELETE_STAFF_FAIL:
			return {
				...state,
				submitLoader: false
			}

		default:
			return state;
	}
}

export default staffReducer;
