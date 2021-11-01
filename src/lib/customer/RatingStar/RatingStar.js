import React from 'react';
import ReactStars from "react-rating-stars-component";

const RatingStar = ( { value} ) => {
	return (
		<ReactStars
			count={ 5 }
			value={value}
			half={ true }
			size={ 24 }
			activeColor="#ffd700"
		/>
	);
};

export default RatingStar;
