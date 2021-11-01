const validationOption = {
	
	name: {
		required: "Name is required"
	},
	
	email: {
		required: "Email is required",
		pattern: {
			value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
			message: 'Invalid Email'
		}
	},
	password: {
		required: "Password is required",
		minLength: {
			value: 8,
			message: "Password must have at least 8 characters"
		}
	},
	phoneNumber: {
		required: "Phone number is required"
	},

}

export default validationOption;