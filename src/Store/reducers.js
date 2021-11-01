/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './vendor/reducers/settings';
import sidebarReducer from './vendor/reducers/SidebarReducer';
import shopReducer from "./customer/reducers/shop";
import cartReducer from "./customer/reducers/cart";
import authReducer from "./customer/reducers/auth";
import serviceReducer from "./vendor/reducers/service";
import staffReducer from "./vendor/reducers/staff";
import vendorAuthReducer from "./vendor/reducers/auth";

const Reducers = combineReducers({
   // Customers Reducer
   shop: shopReducer,
   cart: cartReducer,
   auth: authReducer,
   service: serviceReducer,
   menu: staffReducer,
   vendorAuth: vendorAuthReducer,

   // Dashboard Reducer
   settings,
   sidebar: sidebarReducer

});

export default Reducers;
