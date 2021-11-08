import * as actionTypes from "../../vendor/actions/types";
import axios from "axios";

export const vendorLogOut = () => {

	return {
		type: actionTypes.VENDOR_LOGOUT
	}
}

export const vendorSetAuth = () => {
	return {
		type: actionTypes.VENDOR_SET_AUTH,
	}
}

export const vendorAuthStart = () => {
	return {
		type: actionTypes.VENDOR_AUTH_START
	}
}

export const vendorAuthSuccess = (authData) => {
	return {
		type: actionTypes.VENDOR_AUTH_SUCCESS,
		authData
	}
}

export const vendorAuthFail = (error) => {
	return {
		type: actionTypes.VENDOR_AUTH_FAIL,
		error
	}
}


export const vendorAuth = (email, password, isSignUp, phoneNumber) => {
	console.log(email, password, isSignUp, phoneNumber)
	return dispatch => {
		dispatch(vendorAuthStart())
		let authData = {
			phoneNumber,
			email,
			password,
			role: 'VENDOR'
		}
		let url = '/register'
		if (!isSignUp) {
			authData = {
				email,
				password,
				role: 'VENDOR'
			}
			url = '/login'
		}
		axios.post(url, authData)
			.then((res) => {
				console.log(res.data)
				dispatch(vendorAuthSuccess(res.data))
				localStorage.setItem('vendorToken', res.data.token)
				localStorage.setItem('isProfileSetup', res.data.user.profileSetup);
				if (!res.data.user.profileSetup) {
					window.location.href = '/create-shop'
				} else {
					window.location.href = '/vendor/dashboard'
				}
			})
			.catch((err) => {

				if (isSignUp) {

					dispatch(vendorAuthFail(err.response.data.message))
				}
				else {
					dispatch(vendorAuthFail("Please Check Internet Connection"))
				}
			})
	}
}
