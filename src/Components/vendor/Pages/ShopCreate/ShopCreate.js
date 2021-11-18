import React, { useState } from 'react';
import { Card, Col, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css'
import ReactQuill from 'react-quill';
import axios from "axios";
import Loader from "../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../lib/ApiError/ApiError"
import 'react-quill/dist/quill.snow.css';
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';

import ShopValidation from "./ShopValidation";

const ShopCreate = props => {

	const [description, setDescription] = useState('');
	const [loader, setLoader] = useState(false);
	const [isApiError, setIsApiError] = useState(false)
	const [value, setValue] = useState(null);
	const [selectedLocation, setSelectedLocation] = useState(null)
	const [markerLocation, setMarkerLocation] = useState(null);


	const getCurrentLocation = () => {
		setSelectedLocation(null)
		navigator.geolocation.getCurrentPosition(function (position) {
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

	const onPlaceSearch = (val) => {
		setSelectedLocation(null)
		setValue(val);
		geocodeByAddress(val.label)
			.then(results => getLatLng(results[0]))
			.then(({ lat, lng }) => {
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

	const fetchPlaces = (mapProps, map) => {
		const { google } = mapProps;
		const service = new google.maps.places.PlacesService(map);
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

	const { register, handleSubmit, formState: { errors } } = useForm();

	const token = localStorage.getItem('vendorToken');

	const editorChangeHandler = (val) => {
		setDescription(val);
	}
	const onSubmit = data => {
		setLoader(true);
		const formData = new FormData();
		formData.append('shopName', data.shopName);
		formData.append('description', description);
		formData.append('address', data.address);
		formData.append('location', JSON.stringify(selectedLocation));
		formData.append('shopImage', data.shopImage[0]);
		formData.append('shopBannerImage', data.shopBannerImage[0]);

		axios.post('/vendor/shop', formData, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				localStorage.setItem('isProfileSetup', res.data.profileSetup);
				window.location.href = '/vendor/dashboard/'
				setLoader(false)
			}).catch((err) => {
				setIsApiError(true)
				console.log("VENDOR SHOP CREATE POST", err)
				setLoader(false)
			})
	};

	let errorClass, errorClass2;
	if (errors.shopName) {
		errorClass = "productError"
	}

	if (errors.address) {
		errorClass2 = "productError"
	}


	return (
		<>
			<ApiError show={isApiError} />
			<div id="settings" className={'p-5'}>
				<h3 className={'text-center'}>Create Your Shop</h3>
				<Row className={'justify-content-center'}>
					<Col md={8}>
						<Form onSubmit={handleSubmit(onSubmit)}>
							<Card>
								<Card.Body>
									<Form.Group>
										<Form.Label> Shop Name </Form.Label>
										<Form.Control type={'text'}
											className={errorClass}
											{...register("shopName", ShopValidation.shopName)} />

										<small className="text-danger" style={{ fontWeight: "bold" }} >
											{errors.shopName && errors.shopName.message}
										</small>
									</Form.Group>
									<Form.Group className={'py-3'}>
										<Form.Label> Shop Description </Form.Label>
										<ReactQuill name="description" required onChange={editorChangeHandler} value={description} modules={modules} formats={formats} placeholder="Leave Your Description" />
									</Form.Group>
									<Card className={'my-4 p-4'}>
										<p className={'text-center'}> Shop Address </p>
										<Form.Group className={'py-3'}>
											<Form.Label> Shop Address </Form.Label>
											<Form.Control type={'text'}
												className={errorClass2}
												{...register("address", ShopValidation.shopAddress)} />

											<small className="text-danger" style={{ fontWeight: "bold" }} >
												{errors.address && errors.address.message}
											</small>
										</Form.Group>
										<Row className={'align-items-center justify-content-center mt-4'}>
											<Col sm={8}>
												<GooglePlacesAutocomplete
													apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
													autocompletionRequest={{
														bounds: [
															{ lat: 50, lng: 50 },
															{ lat: 100, lng: 100 }
														],
														componentRestrictions: {
															country: ['uk'],
														}
													}}

													selectProps={{
														placeholder: 'Enter Location',
														value,
														onChange: (val) => onPlaceSearch(val),
													}}
												/>
											</Col>
											<Col sm={1} className={'mt-1'}>
												<i className="zmdi zmdi-gps-dot cur__location" style={{ cursor: 'pointer' }} onClick={getCurrentLocation} />
											</Col>
										</Row>

										{
											selectedLocation ?
												<div className={'mb-4 map_wrapper_setting'}>
													<Map google={props.google}
														initialCenter={selectedLocation}
														zoom={14}
														onClick={onMapClickHandler}
													>
														<Marker position={markerLocation} name={'Your position'} />
													</Map>
												</div>
												: (
													<div className={'text-center mt-3'}>
														<p>Please Enter Location First</p>
													</div>)
										}
									</Card>
								</Card.Body>
							</Card>
							<Card className={'my-4'}>
								<Card.Body>
									<p className={'text-center'}>Gallery</p>
									<Form.Group className={'py-3'}>
										<label htmlFor="exampleFormControlFile1">Shop Main Image</label>
										<input type="file"
											required
											accept=".png, .jpg, .jpeg"
											className="form-control-file"
											{...register('shopImage')} />
									</Form.Group>
									<Form.Group className={'py-3'}>
										<label htmlFor="exampleFormControlFile1">Shop Banner Image</label>
										<input type="file"
											required
											accept=".png, .jpg, .jpeg"
											className="form-control-file"
											{...register('shopBannerImage')} />
									</Form.Group>
								</Card.Body>
							</Card>
							<div className={'text-center'}>
								{loader ? <Loader /> : <button className={'btn btn-send btn-block px-4'} type={'submit'}>Save</button>}
							</div>
						</Form>
					</Col>
				</Row>
			</div>
		</>
	);
};

export default GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(ShopCreate);
