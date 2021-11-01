import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IconButton, AppBar, Toolbar, Tooltip } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
import screenfull from 'screenfull';
import "./Header.css";
import MenuIcon from '@material-ui/icons/Menu';
import { connect } from "react-redux";
import axios from "axios";
import { collapsedSidebarAction } from 'Store/vendor/actions';
import * as action from "../../../Store/vendor/actions";

function Header(props) {

	const [payment, setPayment] = useState(false);
	const token = localStorage.getItem("vendorToken")

	useEffect(() => {
		const paymentMethod = localStorage.getItem('paymentMethod');
		if (paymentMethod) {
			console.log(paymentMethod)
			setPayment(paymentMethod)
		}
		axios.get('/current-user', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				if (paymentMethod !== res.data.paymentMethod) {
					localStorage.setItem('paymentMethod', res.data.paymentMethod);
					setPayment(res.data.paymentMethod)
				}

			})
			.catch((err) => {
				console.log("VENDOR HEADER GET", err)
			})
	}, [])

	const dispatch = useDispatch();
	const settings = useSelector(state => state.settings);

	const onToggleNavCollapsed = (event) => {
		const val = settings.navCollapsed ? false : true;
		dispatch(collapsedSidebarAction(val));
	}

	const toggleScreenFull = () => {
		screenfull.toggle();
	}

	const changePageHandler = () => {
		window.location.href = "/stripe";
	}

	let btn;
	if (!payment) {
		btn = <button onClick={changePageHandler} className="btn btn-send btn-block"> Add Account Details </button>
	}
	return (
		<>
			<AppBar position="static" className="rct-header">
				<Toolbar className="d-flex justify-content-between w-100 pl-0">
					<div className="d-inline-flex align-items-center">
						<ul className="list-inline mb-0 navbar-left">
							<li className="list-inline-item" onClick={(e) => onToggleNavCollapsed(e)}>
								<Tooltip title="Sidebar Toggle" placement="bottom">
									<IconButton color="inherit" mini="true" aria-label="Menu" className="humburger p-0">
										<MenuIcon />
									</IconButton>
								</Tooltip>
							</li>
						</ul>
					</div>
					<ul className="navbar-right list-inline mb-0">
						<li className="list-inline-item">
							{
								btn
							}
						</li>
						<li className="list-inline-item">
							<IconButton aria-label="settings" onClick={() => props.vendorLogOut()}>
								<i className="zmdi zmdi-power" />
							</IconButton>
						</li>
						<li className="list-inline-item">
							<Tooltip title="Full Screen" placement="bottom">
								<IconButton aria-label="settings" onClick={() => toggleScreenFull()}>
									<i className="zmdi zmdi-crop-free"></i>
								</IconButton>
							</Tooltip>
						</li>
					</ul>
				</Toolbar>
			</AppBar>
		</>);
}
const mapDispatchToProps = dispatch => {
	return {
		vendorLogOut: () => dispatch(action.vendorLogOut())
	}
}
export default withRouter(connect(null, mapDispatchToProps)(Header));
