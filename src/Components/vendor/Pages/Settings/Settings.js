import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Row } from "react-bootstrap";
import ReactQuill from 'react-quill';
import axios from 'axios';
import Loader from "../../../../lib/customer/Loader/Loader";
import { useToasts } from "react-toast-notifications";
import { vendorShopSetting } from "../../../../lib/customer/Toaster/Toaster";
import ApiError from "../../../../lib/ApiError/ApiError"
import "../../../../assets/style.css";
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';
import {GoogleApiWrapper, Map, Marker} from 'google-maps-react';
import './Setting.css'

const Settings = props => {

	const { addToast } = useToasts()

	const [value, setValue] = useState(null);
	const [shop, setShop] = useState(null);
	const [pageLoader, setPageLoader] = useState(false);
	const [isApiError, setIsApiError] = useState(false)

	const [selectedLocation, setSelectedLocation] = useState(null)
	const [markerLocation, setMarkerLocation] = useState(null);
	const token = localStorage.getItem('vendorToken');


	const onPlaceSearch =  (val) => {
		setSelectedLocation(null)
		setValue(val);
		geocodeByAddress(val.label)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
					console.log('PLACES', lat, lng)
					setSelectedLocation({
						lat,
						lng
					})
					setMarkerLocation({
						lat,
						lng
					})
				}
			);
	}

	let error = {};
	let isValid = true

	const handleFormHandler = () => {
		let fields = shop

		if (fields) {
			console.log(fields.description)


			if (typeof fields.shopName !== "undefined") {
				if (!fields.shopName.match(/^[a-zA-Z ]+$/)) {
					isValid = false
					error.shopName = "Product Name must be string"
				}
			}

			if (fields.shopName === '') {
				isValid = false
				error.shopName = "Cannot be empty"
			}

			if (typeof fields.address !== "undefined") {
				if (!fields.address.match(/^[\s\S]*$/)) {
					isValid = false
					error.address = "Product Name must be string"
				}
			}

			if (fields.address === '') {
				isValid = false
				error.address = "Cannot be empty"
			}

		}
	}

	handleFormHandler()


	const modules = {
		toolbar: [
			[{ 'header': [1, 2, 3, 4, 5, 6, false] }],
			[{ 'font': [] }],
			['bold', 'italic', 'underline', 'strike', 'blockquote'],
			[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
			['link', 'image'],
			['clean'],
			[{ 'align': [] }],
			['code-block']
		],
	};

	const formats = [
		'header',
		'font',
		'bold', 'italic', 'underline', 'strike', 'blockquote',
		'list', 'bullet', 'indent',
		'link', 'image', 'align',
		'code-block'
	];

	useEffect(() => {
		axios.get('/vendor/shop', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data)
				setShop(res.data);
				setSelectedLocation({
					lat: res.data.location.coordinates[0],
					lng: res.data.location.coordinates[1]
				})
			})
			.catch((err) => {
				setIsApiError(true)
				console.log("VENDORS SHOP GET", err)
			})
	}, [])

	const onSubmit = (e) => {
		e.preventDefault();
		setPageLoader(true);
		const formData = {
			shopName: shop.shopName,
			description: shop.description,
			address: shop.address,
			location: JSON.stringify(selectedLocation),
		}
		if (isValid) {
			axios.put('/vendor/shop', formData, { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					vendorShopSetting(addToast)
					setPageLoader(false)
					window.location.reload();
				})
				.catch((err) => {
					setIsApiError(true)
					console.log("VENDORS SHOP PUT", err)
				})
		}
	}
	const onChangeHandler = (e) => {
		const value = e.target.value;
		setShop({
			...shop,
			[e.target.name]: value
		})
	}
	const editorChangeHandler = (val) => {
		setShop({
			...shop,
			description: val
		})
	}

	const getCurrentLocation = () => {
		setSelectedLocation(null)
		navigator.geolocation.getCurrentPosition(function(position) {
			setSelectedLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			})
			setMarkerLocation({
				lat: position.coords.latitude,
				lng: position.coords.longitude
			})
		});
	}

	const onMapClickHandler = (t, map, coord) => {
		setSelectedLocation(null)
		const { latLng } = coord;
		const lat = latLng.lat();
		const lng = latLng.lng();
		setSelectedLocation({
			lat,
			lng
		})
		setMarkerLocation({
			lat,
			lng
		})
	}

	const onMarkLocation = (marker) => {
		setSelectedLocation(null);
		setSelectedLocation({
			lat: marker.position.lat,
			lng: marker.position.lng
		})
		console.log(selectedLocation)
	}

	let loader = (
		<div>
			<Loader style={'text-center'} />
		</div>
	)
	return (
		<>
			<ApiError show={isApiError} />
			<div id="settings" className={'p-5'}>
				<h3 className={'text-center'}> Your Shop</h3>
				<Row className={'justify-content-center'}>
					<Col md={8}>
						{
							shop ?
								<Form onSubmit={onSubmit}>
									<Card>
										<Card.Body>
											<Form.Group>
												<Form.Label> Shop Name </Form.Label>
												<Form.Control type={'text'}
													name="shopName"
													value={shop.shopName} onChange={onChangeHandler} required />
												<small className="text-danger" style={{ fontWeight: "bold" }} >
													{error.shopName}
												</small>
											</Form.Group>
											<Form.Group className={'py-3'}>
												<Form.Label> Shop Description </Form.Label>
												<ReactQuill name="description" onChange={editorChangeHandler} value={shop.description} required modules={modules} formats={formats} placeholder="Leave Your Description" />
												{/*<Form.Control as="textarea" required placeholder="Leave Description Here"  {...register("description")}/>*/}
											</Form.Group>
										</Card.Body>
									</Card>
									<Card>
										<Card.Body>
												<Form.Label> Shop Address </Form.Label>
												<Form.Control type={'text'}
												              required
												              name="address" value={shop.address} onChange={onChangeHandler}
												/>
												<small className="text-danger" style={{ fontWeight: "bold" }} >
													{error.address}
												</small>
												<Row className={'align-items-center justify-content-center mt-4'}>
													<Col sm={12} className={'d-flex justify-content-between'}>
														<div className={'w-100'}>
															<GooglePlacesAutocomplete
																autocompletionRequest={{
																	bounds: [
																		{ lat: 50, lng: 50 },
																		{ lat: 100, lng: 100 }
																	],
																}}
																apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
																selectProps={{
																	placeholder: 'Enter Location',
																	value,
																	onChange: (val) => onPlaceSearch(val),
																}}
															/>
														</div>
														<i className="zmdi zmdi-gps-dot cur__location mt-2" style={{cursor: 'pointer'}}  onClick={getCurrentLocation} />

													</Col>

												</Row>
												{
													selectedLocation ?
														<div className="map_wrapper_setting">
															<Map google={props.google}
															     initialCenter={selectedLocation}
															     zoom={14}
															     onClick={onMapClickHandler}
															>
																<Marker position={markerLocation}
																        name={'Your position'} />
															</Map>
														</div>
														: (
															<div className={'text-center mt-3'}>
																<p>Please Enter Location First</p>
															</div>)
												}
										</Card.Body>
									</Card>



									<div className={'text-center'}>
										{
											isValid ?
												!pageLoader ?
													<button className={'btn btn-send btn-block px-4'} type={'submit'}>Save</button>
													: loader
												: 	<button className={'btn btn-send btn-block px-4'} disabled type={'button'}>Save</button>

										}
									</div>
								</Form> : loader
						}
					</Col>
				</Row>
			</div>
		</>
	);
};



export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(Settings);


