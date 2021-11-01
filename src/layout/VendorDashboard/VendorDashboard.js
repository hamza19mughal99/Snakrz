import React  from "react";
import { Route } from 'react-router-dom';
import RctAppLayout from 'layout/VendorDashboard/RctAppLayout';
import {NotificationContainer} from "react-notifications";
import RctThemeProvider from "../../Container/RctThemeProvider";



const VendorDashboard = ({ children }) => (
	//Theme Provider
	<RctThemeProvider>
		{/*Notifications*/}
		<NotificationContainer />
		{/*SideBar & Header */}
		<RctAppLayout>
			{ children }
		</RctAppLayout>
	</RctThemeProvider>
)


const VendorDashboardRoute = ({ component: Component, ...rest }) => {
	return (
		<Route { ...rest } render={matchProps => (
			<VendorDashboard>
				<Component { ...matchProps } />
			</VendorDashboard>
		)} />
	)
}

export default VendorDashboardRoute;