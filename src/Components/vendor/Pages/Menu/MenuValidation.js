const menuValidationOption = {
	name: {
		required: "Product Name is required",
		pattern: {
			value: /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/,
			message: 'Product Name must be string'
		}
	},
	allergyInfo: {
		required: "Allergy Information is required",
		pattern: {
			value: /^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/,
			message: 'Allergy Information must be string'
		}
	},
	price: {
		required: "Product Price is required",
		pattern: {
			value: /^\d+$/,
			message: "Product Price must be a number"
		}
	},
	time: {
		required: "Time is required"
	}

}

export default menuValidationOption;
