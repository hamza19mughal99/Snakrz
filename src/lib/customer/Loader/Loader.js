import React from 'react';
import './Loader.css'

const Loader = props => {
	return (
		<div className={props.style}>
			<div className="lds-dual-ring" />
		</div>
	);
};

export default Loader;
