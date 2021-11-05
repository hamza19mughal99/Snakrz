//Main Routes
import Home from "../Components/customer/Pages/Home/Home";
import About from "../Components/customer/Pages/About/About";
import Policies from "../Components/customer/Pages/Policies/Policies";
// import Dessert from "../Components/customer/Pages/Categories/Dessert";
// import Drinks from "../Components/customer/Pages/Categories/Drinks";
// import HomeCooked from "../Components/customer/Pages/Categories/HomeCooked";
import Restaurant from "../Components/customer/Pages/Restaurant/Restaurant";
import RestaurantView from "../Components/customer/Pages/Restaurant/RestaurantView";
import AddToCart from "../Components/customer/Pages/AddToCart/AddToCart";
import MyProfile from "../Components/customer/Pages/MyAccount/MyProfile/Profile";
import Orders from "../Components/customer/Pages/MyAccount/Orders/Orders";

//Admin Routes
import Dashboard from "../Components/Admin/Pages/dashboard/ecommerce";
import AdminVendor from "../Components/Admin/Pages/vendors/Vendors";
import AdminCustomers from "../Components/Admin/Pages/customers/Customers";

// Vendor Routes
import EcommerceDashboard from "../Components/vendor/Pages/dashboard/ecommerce";
import Customers from "../Components/vendor/Pages/Orders/Orders";
import Menu from "../Components/vendor/Pages/Menu/Menu";
import Settings from "../Components/vendor/Pages/Settings/Settings";
import AddOn from "../Components/vendor/Pages/AddOn/AddOn"
import Gallery from "../Components/vendor/Pages/Gallery/Gallery";
import Category from "../Components/vendor/Pages/Category/Category";

export const MainLayoutPath = [
	{
		path: '/',
		component: Home,
		exact: true
	},
	{
		path: '/about',
		component: About
	},
	{
		path: '/policies',
		component: Policies
	},
	// {
	// 	path: '/desserts',
	// 	component: Dessert
	// },
	// {
	// 	path: '/drinks',
	// 	component: Drinks
	// },
	// {
	// 	path: '/homeCooked',
	// 	component: HomeCooked
	// },
	{
		path: '/restaurant',
		component: Restaurant
	},
	{
		path: '/restaurantView/:id',
		component: RestaurantView
	},
	{
		path: '/addToCart/:id',
		component: AddToCart
	},
	{
		path: '/myProfile',
		component: MyProfile
	},
	{
		path: '/orders',
		component: Orders
	}
]

export const VendorLayoutPath = [
	{
		path: 'dashboard',
		component: EcommerceDashboard
	},
	{
		path: 'orders',
		component: Customers
	},
	{
		path: 'menu',
		component: Menu
	},
	{
		path: 'gallery',
		component: Gallery
	},
	{
		path: 'category',
		component: Category
	},
	{
		path: 'add-on',
		component: AddOn
	},
	{
		path: 'settings',
		component: Settings
	},
]

export const AdminLayoutPath = [
	{
		path: 'dashboard',
		component: Dashboard
	},
	{
		path: 'vendors',
		component: AdminVendor
	},
	{
		path: 'customers',
		component: AdminCustomers
	},
]


