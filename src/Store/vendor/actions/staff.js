import * as action from "./types";
import axios from "axios";

export const createMenuStart = () => {
	return {
		type: action.CREATE_STAFF_START
	}
}

export const createMenuFail = () => {
	return {
		type: action.CREATE_STAFF_FAIL
	}
}

export const createMenuSuccess = () => {
	return {
		type: action.CREATE_STAFF_SUCCESS
	}
}

const token = localStorage.getItem('vendorToken');


export const createMenu = (formData) => {
	return dispatch => {
		dispatch(createMenuStart());
		axios.post('/vendor/product', formData, {headers: {"Authorization": `Bearer ${token}`}})
			.then(() => {
				dispatch(createMenuSuccess());
			})
			.catch(() => {
				dispatch(createMenuFail());
			})
	}
}

export const fetchMenuStart = () => {
	return {
		type: action.FETCH_STAFF_START
	}
}

export const fetchMenuFail = () => {
	return {
		type: action.FETCH_STAFF_FAIL
	}
}

export const fetchMenuSuccess = (staffData) => {
	return {
		type: action.FETCH_STAFF_SUCCESS,
		payload: {
			staffData
		}
	}
}



export const fetchMenu = () => {
	return dispatch => {
		dispatch(fetchMenuStart());
		axios.get('/vendor/products', {headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				
				dispatch(fetchMenuSuccess(res.data));
			}).catch((err) => {
			dispatch(fetchMenuFail(err))
		})
	}
}

export const editMenuStart = () => {
	return {
		type: action.EDIT_STAFF_START
	}
}

export const editMenuFail = () => {
	return {
		type: action.EDIT_STAFF_FAIL
	}
}

export const editMenuSuccess = (staffData) => {
	return {
		type: action.EDIT_STAFF_SUCCESS,
		payload: {
			staffData
		}
	}
}

export const editMenu = (menuId, formData) => {
	console.log(formData)
	return dispatch => {
		dispatch(editMenuStart());
		axios.put('/vendor/product/' + menuId, formData,{headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				dispatch(editMenuSuccess(res.data));
			}).catch((err) => {
			dispatch(editMenuFail(err))
		})
	}
}

export const deleteMenuStart = () => {
	return {
		type: action.DELETE_STAFF_START
	}
}

export const deleteMenuFail = () => {
	return {
		type: action.DELETE_STAFF_FAIL
	}
}

export const deleteMenuSuccess = (staffData) => {
	return {
		type: action.DELETE_STAFF_SUCCESS,
		payload: {
			staffData
		}
	}
}

export const deleteMenu = (menuId) => {
	return dispatch => {
		dispatch(deleteMenuStart());
		axios.delete('/vendor/product/' + menuId,{headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				dispatch(deleteMenuSuccess(res.data));
			}).catch((err) => {
			dispatch(deleteMenuFail(err))
		})
	}
}

