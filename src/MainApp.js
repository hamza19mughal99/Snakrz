import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProductContextProvider from './GlobalStore/ProductContext';
import CartContextProvider from './GlobalStore/CartContext';
import MainLayoutRoute from "./layout/MainLayout/MainLayout";
import { MainLayoutPath, VendorLayoutPath, AdminLayoutPath } from "./Routes/routes";
import './App.css'
import VendorDashboardRoute from "./layout/VendorDashboard/VendorDashboard";
import AdminDashboardRoute from "./layout/AdminDashboard/AdminDashboard";
import AdminLogin from "./Components/Admin/Pages/Login/Login";
import Register from "./Components/vendor/Pages/Register/Register";
import Login from "./Components/vendor/Pages/Login/Login";
import CustomerLogin from './Components/customer/Pages/Login/Login'
import CustomerRegister from './Components/customer/Pages/Register/Register'
import Error from "./Components/404-error page/Error";
import ForgetPassword from "./Components/ForgetPassword/ForgetPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import Stripe from "./Components/Stripe/Stripe";
import { connect } from "react-redux";
import * as action from './Store/customer/actions/index';
import * as vendorAction from './Store/vendor/actions/index';
import { ToastProvider } from 'react-toast-notifications';
import ShopCreate from "./Components/vendor/Pages/ShopCreate/ShopCreate";


if (window.location.href.toString().includes('vendor') && !window.location.href.toString().includes('register') && !window.location.href.includes('login')) {
	import('./assets/dashboard/scss/reactifyCss')
}

if (window.location.href.toString().includes('admin') && !window.location.href.toString().includes('register') && !window.location.href.includes('login')) {
	import('./assets/dashboard/scss/reactifyCss')
}

const MainApp = props => {

	const token = localStorage.getItem('token');
	const vendorToken = localStorage.getItem('vendorToken');

	if (token) {
		props.setAuth()
	}

	if (vendorToken) {
		props.vendorSetAuth();
	}

	const mainLayoutRoute = MainLayoutPath && MainLayoutPath.map(({ path, component, exact }, index) => (
		<MainLayoutRoute key={index} path={path} component={component} exact={exact} />
	))
	const adminLayoutRoute = AdminLayoutPath && AdminLayoutPath.map((route, key) =>
		<AdminDashboardRoute key={key} path={`/admin/${route.path}`} component={route.component} />
	)
	const vendorLayoutRoute = VendorLayoutPath && VendorLayoutPath.map((route, key) =>
		<VendorDashboardRoute key={key} path={`/vendor/${route.path}`} component={route.component} />
	)
	return (
		<ToastProvider>
			<ProductContextProvider>
				<CartContextProvider>
					<Router>
						<Switch>
							{adminLayoutRoute}
							{vendorLayoutRoute}
							{mainLayoutRoute}
							<Route path={'/create-shop'} component={ShopCreate} />
							<Route path={'/register'} component={CustomerRegister} />
							<Route path={'/login'} exact component={CustomerLogin} />
							<Route path={'/vendor/register'} component={Register} />
							<Route path={'/admin/login'} exact component={AdminLogin} />
							<Route path={'/vendor/login'} exact component={Login} />
							<Route path={'/forgetPassword'} exact component={ForgetPassword} />
							<Route path={'/resetPassword/:id'} exact component={ResetPassword} />
							<Route path={'/stripe'} exact component={Stripe} />
							<Route path={'*'} component={Error} />
						</Switch>
					</Router>
				</CartContextProvider>
			</ProductContextProvider>
		</ToastProvider>
	)
};

const mapStateToProps = state => {
	return {
		isAuth: state.auth.isAuth,
		isVendorAuth: state.vendorAuth.isVendorAuth
	}
}

const mapDispatchToProps = dispatch => {
	return {
		setAuth: () => dispatch(action.setAuth()),
		vendorSetAuth: () => dispatch(vendorAction.vendorSetAuth())
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
