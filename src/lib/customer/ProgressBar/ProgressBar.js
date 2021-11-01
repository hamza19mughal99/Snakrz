import React from 'react';
import './ProgressBar.css';

const ProgressBar = (props) => {
			return (
				<div>
					<div className={props.shopRing}>
						<div />
						<div />
						<div />
						<div />
					</div>
					<div className={props.shopProgress}>
						<p> Please Wait </p>
					</div>
				</div>
			);

	}


export default ProgressBar;
