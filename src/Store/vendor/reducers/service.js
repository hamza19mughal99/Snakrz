import * as actionTypes from '../actions/types';

const initialState = {
	services: null,
	loading: false,
	submitLoader: false,
	data: {}

}


const serviceReducer = (state = initialState, action) => {
	switch (action.type){
		case actionTypes.FETCH_SERVICE_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.FETCH_SERVICE_SUCCESS:
			return {
				...state,
				services: action.payload.services,
				loading: false
			}

		case actionTypes.FETCH_SERVICE_FAIL:
			return {
				...state,
				loading: false
			}

		case actionTypes.CREATE_SERVICE_START:
			return {
				...state,
				loading: true,
				submitLoader: true
			}

		case actionTypes.CREATE_SERVICE_FAIL:
			return {
				...state,
				loading: false,
				submitLoader: false
			}

		case actionTypes.CREATE_SERVICE_SUCCESS:
			return {
				...state,
				loading: false,
				submitLoader: false
			}

		case actionTypes.EDIT_SERVICE_START:
			return {
				...state,
				submitLoader: true
			}

		case actionTypes.EDIT_SERVICE_FAIL:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.EDIT_SERVICE_SUCCESS:
			return {
				...state,
				submitLoader: false
			}

		case actionTypes.DELETE_SERVICE_START:
			return {
				...state,
				loading: true,
				submitLoader: true
			}

		case actionTypes.DELETE_SERVICE_FAIL:
			return {
				...state,
				loading: false,
				submitLoader: false
			}

		case actionTypes.DELETE_SERVICE_SUCCESS:
			return {
				...state,
				loading: false,
				submitLoader: false
			}

		case actionTypes.STORE_FORM_VALUE:
		
			return {
				...state,
				data: {...state.data, ...action.data}
			}	



		default:
			return state;
	}
}

export default serviceReducer;
