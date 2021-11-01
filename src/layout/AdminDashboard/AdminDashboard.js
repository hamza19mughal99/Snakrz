import React  from "react";
import { Route } from 'react-router-dom';
import RctAppLayout from 'layout/AdminDashboard/RctAppLayout';
import {NotificationContainer} from "react-notifications";
import RctThemeProvider from "../../Container/RctThemeProvider";



const AdminDashboard = ({ children }) => (
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


const AdminDashboardRoute = ({ component: Component, ...rest }) => {
	return (
		<Route { ...rest } render={matchProps => (
			<AdminDashboard>
				<Component { ...matchProps } />
			</AdminDashboard>
		)} />
	)
}

export default AdminDashboardRoute;  