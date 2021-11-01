import * as actionTypes from '../actions/actionTypes';


const initialState = {
	shops: null,
	shop: {},
	loading: false
}


const shopReducer = (state = initialState, action) => {
	switch (action.type) {
		case actionTypes.FETCH_SHOPS_SUCCESS:
			return {
				...state,
				loading: false,
				shops: action.payload.shops,
			}

		case actionTypes.FETCH_SHOPS_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.FETCH_SHOPS_FAIL:
			return {
				...state,
				loading: false,
			}

		case actionTypes.FETCH_SHOP_SUCCESS:
			return {
				...state,
				loading: false,
				shop: action.payload.shop
			}

		case actionTypes.FETCH_SHOP_START:
			return {
				...state,
				loading: true
			}

		case actionTypes.FETCH_SHOP_FAIL:
			return {
				...state,
				loading: false,
			}
		default:
			return state;
	}
}

export default shopReducer;