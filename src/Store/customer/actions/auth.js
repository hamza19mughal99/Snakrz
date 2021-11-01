import * as actionTypes from './actionTypes';
import axios from "axios";

export const logOut = () => {
	return {
		type: actionTypes.LOGOUT
	}
}

export const setAuth = () => {
	return {
		type: actionTypes.SET_AUTH,
	}
}

export const authStart = () => {
	return {
		type: actionTypes.AUTH_START
	}
}

export const authSuccess = (authData) => {
	return {
		type: actionTypes.AUTH_SUCCESS,
		authData
	}
}

export const authFail = (error) => {
	return {
		type: actionTypes.AUTH_FAIL,
		error
	}
}


export const auth = (email, password, name, isSignUp, phoneNumber, location) => {
	return dispatch => {
		dispatch(authStart())
		let authData = {
			name,
			email,
			phoneNumber,
			password,
			location,
			role: 'CUSTOMER'
		}
		let url = '/register'
		if (!isSignUp) {
			authData = {
				email,
				password,
				role: 'CUSTOMER'
			}
			url = '/login'
		}
		console.log(authData)
		axios.post(url, authData)
			.then((res) => {
				dispatch(authSuccess(res.data))
				localStorage.setItem('token', res.data.token)
				const redirect_Id = localStorage.getItem('redirect_to')
				if (redirect_Id) {
					window.location.href = '/restaurantView/' + redirect_Id
				} else  {
					window.location.href = '/'
				}
			})
			.catch((err) => {
				console.log(err.request)
				if (err.request.statusText === "Not Found") {
					dispatch(authFail('Please check your internet connection'))
				}
				else if (err.request.statusText === "Internal Server Error") {
					dispatch(authFail('User Already Exist'))
				}
				else {
					dispatch(authFail("err.response.message"))

				}
			})
	}
}
