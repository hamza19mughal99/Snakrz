import * as actionTypes from '../actions/actionTypes';
import axios from "axios";

export const fetchShopSuccess = (shop) => {
	return {
		type: actionTypes.FETCH_SHOP_SUCCESS,
		payload: {
			shop
		}
	}
}

export const fetchShopStart = () => {
	return {
		type: actionTypes.FETCH_SHOP_START,
	}
}

export const fetchShopFail = () => {
	return {
		type: actionTypes.FETCH_SHOP_FAIL,
		loading: false
	}
}

// Add SHOPID to the params and pass res.data to the fetchSHOPSuccess

export const fetchShop = (shopId) => {

	console.log(shopId)

	return dispatch => {
		dispatch(fetchShopStart())
		axios.get('/shop/' + shopId)
			.then((res) => {
				dispatch(fetchShopSuccess(res.data));
			})
			.catch((err) => {
				dispatch(fetchShopFail(err));

			})
	}

}

export const fetchShopsSuccess = (shops) => {
	return {
		type: actionTypes.FETCH_SHOPS_SUCCESS,
		payload: {
			shops
		}
	}
}

export const fetchShopsStart = () => {
	return {
		type: actionTypes.FETCH_SHOPS_START,
	}
}

export const fetchShopsFail = () => {
	return {
		type: actionTypes.FETCH_SHOPS_FAIL,
	}
}

// pass res.data to the fetchSHOPsSuccess
export const fetchShops = (lat, lng) => {
	return dispatch => {
		dispatch(fetchShopsStart())
		axios.get('/shops', {
			params: {
				lat,
				lng,
			}
		})
			.then((res) => {
				if (res.data) {
					dispatch(fetchShopsSuccess(res.data));
				}
			}).catch((err) => {
				dispatch(fetchShopsFail(err));
		})
	}
}
