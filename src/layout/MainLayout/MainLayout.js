import React  from "react";
import { Route } from 'react-router-dom';
import Header from "../../Components/customer/Header/Header";
import Footer from "../../Components/customer/Footer/Footer";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-dropdown/style.css';
import 'react-day-picker/lib/style.css';

const MainLayout = ({ children }) => (
	<div>
		<Header />
		{ children }
		<Footer />
	</div>
)


const MainLayoutRoute = ({ component: Component, ...rest }) => {
	return (
		<Route { ...rest } render={matchProps => (
			<MainLayout>
				<Component { ...matchProps } />
			</MainLayout>
		)} />
	)
}

export default MainLayoutRoute;