const menuValidationOption = {
	shopName: {
		required: "Shop Name is required",
		pattern: {
			value: /^[a-zA-Z' ]+$/,
			message: 'Shop Name must be string'
		}
	},
	shopAddress: {
		required: "Shop Address is required",
		pattern: {
			value: /^[\s\S]*$/,
			message: "InValid Text"
		}
	}

}

export default menuValidationOption;
