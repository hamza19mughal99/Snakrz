import * as actionTypes from "./actionTypes";

export const addToCart = (service) => {
	return {
		type: actionTypes.ADD_TO_CART,
		payload: {
			service
		}
	}
}



export const removeFromCart = (serviceId, servicePrice) => {
	return {
		type: actionTypes.REMOVE_FROM_CART,
		payload: {
			serviceId,
			servicePrice
		}
	}
}