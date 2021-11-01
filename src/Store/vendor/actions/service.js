import * as action from './types'
import axios from "axios";




export const fetchServiceStart = () => {
	return {
		type: action.FETCH_SERVICE_START
	}
}

export const fetchServiceFail = () => {
	return {
		type: action.FETCH_SERVICE_FAIL
	}
}

export const fetchServiceSuccess = (services) => {
	return {
		type: action.FETCH_SERVICE_SUCCESS,
		payload: {
			services
		}
	}
}
const token = localStorage.getItem('vendorToken');

export const fetchService = () => {
	return dispatch => {
		dispatch(fetchServiceStart());
		axios.get('/vendor/service', {headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				dispatch(fetchServiceSuccess(res.data));
			}).catch((err) => {
				dispatch(fetchServiceFail(err))
		})
	}
}



export const createServiceStart = () => {
	return {
		type: action.CREATE_SERVICE_START
	}
}
export const createServiceFail = () => {
	return {
		type: action.CREATE_SERVICE_FAIL
	}
}
export const createServiceSuccess = () => {
	return {
		type: action.CREATE_SERVICE_SUCCESS
	}
}

export const createService = (formInput) => {
	return dispatch => {
		dispatch(createServiceStart())
		axios.post('/vendor/service', formInput, {headers: {"Authorization": `Bearer ${token}`}})
			.then(() => {
				console.log('CREATED')
				dispatch(createServiceSuccess());
			}).catch(() => {
				dispatch(createServiceFail());
		})
	}
}

export const editServiceStart = () => {
	return {
		type: action.EDIT_SERVICE_START
	}
}

export const editServiceFail = () => {
	return {
		type: action.EDIT_SERVICE_FAIL
	}
}

export const editServiceSuccess = () => {
	return {
		type: action.EDIT_SERVICE_SUCCESS
	}
}

export const editService = (serviceId, data) => {
	return dispatch => {
		dispatch(editServiceStart())
		axios.put('/vendor/service/' + serviceId, data)
			.then((res) => {
				console.log(res.data)
				dispatch(editServiceSuccess());
			})
			.catch(() => {
				dispatch(editServiceFail());
			});
	}
}

export const deleteServiceStart = () => {
	return {
		type: action.DELETE_SERVICE_START
	}
}

export const deleteServiceFail = () => {
	return {
		type: action.DELETE_SERVICE_FAIL
	}
}

export const deleteServiceSuccess = () => {
	return {
		type: action.DELETE_SERVICE_SUCCESS
	}
}


export const deleteService = (serviceId) => {
	return dispatch => {
		dispatch(deleteServiceStart())
		axios.delete('/vendor/service/' + serviceId, {headers: {"Authorization": `Bearer ${token}`}})
			.then(() => {
				dispatch(deleteServiceSuccess());
			})
			.catch(() => {
				dispatch(deleteServiceFail());
			})
	}
}



export const storeFormValue = (data) => {
	return {
		type: action.STORE_FORM_VALUE,
		data
	}
}


