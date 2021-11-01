import * as actionTypes from '../actions/actionTypes'

const initialState = {
	cart: [],
	totalPrice: 0,
}

const cartReducer = (state=initialState, action) => {
	let dupCart;
	switch (action.type) {
		case actionTypes.ADD_TO_CART:
			dupCart = state.cart.slice();
			let alreadyInCart = false;
			dupCart.forEach((service) => {
				if (service._id === action.payload.service._id) {
					alreadyInCart = true
				}
			})
			if (!alreadyInCart) {
				dupCart.push({...action.payload.service})
			}
			const totalPrice = dupCart.reduce((acc, service) => {
				console.log(acc, service.price)
				return acc + parseInt(service.price)
			}, 0)
			console.log(dupCart)
			localStorage.setItem('cart', JSON.stringify(dupCart))
			console.log(JSON.parse(localStorage.getItem('cart')))
			return {
				cart: dupCart,
				totalPrice: parseInt(totalPrice),
			}


		case actionTypes.REMOVE_FROM_CART:
			localStorage.setItem('cart', JSON.stringify(state.cart.filter(service => service._id !== action.payload.serviceId)));
			return {
				cart: state.cart.filter(service => service._id !== action.payload.serviceId),
				totalPrice: state.totalPrice - action.payload.servicePrice
			}
		default:
			return state
	}
}

export default cartReducer;
