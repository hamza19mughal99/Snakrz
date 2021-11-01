import React from 'react';
import ReactDOM from 'react-dom';
import { configureStore } from "./Store";
import { Provider } from "react-redux";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import axios from "axios";
import App from './MainApp';
import './index.css'
require('dotenv').config()

// axios.defaults.baseURL = 'http://localhost:4000';
axios.defaults.baseURL = 'https://snacker2104.herokuapp.com/';
// axios.defaults.baseURL = 'http://192.168.50.85:4000/';

const stripePromise = loadStripe('pk_test_51Jf2S5J72cD9rZjsqXgTSXo0B7RlFqz1nxWg5i3YER9kEIHSCAZn3kBwcChQlujCIjhvcgzNKJTG5krOQ4gBQBkg00KHeolpk1');

const app = (
	<Elements stripe={stripePromise}>
		<Provider store={configureStore()}>
			<App />
		</Provider>
	</Elements>
)
ReactDOM.render(
	app,
	document.getElementById('root')
);
