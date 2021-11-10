import React from 'react';
import ReactStars from "react-rating-stars-component";

const RatingStar = ({ value }) => {
	return (
		<ReactStars
			count={5}
			value={value}
			half={true}
			size={20}
			activeColor="#FF4200"
		/>
	);
};

export default RatingStar;



// {value}


// value={value}