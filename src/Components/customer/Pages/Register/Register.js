import React, { useState } from 'react';
import "../../../../assets/style.css";
import { Col } from "react-bootstrap";
import { useForm } from "react-hook-form"
import { connect } from "react-redux";
import { NavLink } from 'react-router-dom';
import * as action from '../../../../Store/customer/actions';
import Env from "../../../../assets/customer/img/env.png";
import Phone from "../../../../assets/customer/img/phone.png";
import User from "../../../../assets/customer/img/user.png"
import Lock from "../../../../assets/customer/img/lock.png";
import inputValidation from "./inputValidation";
import Loader from "../../../../lib/customer/Loader/Loader"
import { GoogleApiWrapper, Map, Marker } from 'google-maps-react';
import GooglePlacesAutocomplete, { getLatLng, geocodeByAddress } from 'react-google-places-autocomplete';

const Register = (props) => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [value, setValue] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [markerLocation, setMarkerLocation] = useState(null);

    const onSubmit = (data) => {
        let location = {
            ...selectedLocation
        }
        const { name, email, password, phoneNumber } = data;
        props.onAuth(email, password, name, true, phoneNumber, location)
    }



    let formButton = (
        <>
            <div className="col-md-10 my-4">
                <button type="submit" className="btn btn-send btn-block">REGISTER</button>
            </div>
        </>
    )

    if (props.loading) {
        formButton = (
            <div className={'col-md-10 my-4'}>
                <Loader style={'text-center'} />
            </div>
        )
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

    let errorMessage = null;
    if (props.error) {
        errorMessage = <p className={'text-danger font-weight-bold '}>{props.error}</p>
    }

    return (
        <>
            <section className=" py-5 sign-up-section sign-in">
                <div className="container">
                    <div className="row">
                        <div className="col-8 sign-card">
                            <div className="card sign-up-card rounded shadow border-0 bg-white">
                                <div className="card-body text-center">
                                    <h2 style={{ fontWeight: "bold", fontSize: "23px" }}> REGISTRATION </h2>
                                    {errorMessage}
                                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                                        <div className="container form-row justify-content-center">
                                            <div className="col-md-12 mb-4">
                                                <label>Full Name</label>
                                                <img src={User} className="img-form" alt={'user'} />
                                                <input type="text"
                                                    className="form-control"
                                                    {...register('name', inputValidation.name)}
                                                    placeholder="Enter your Full Name" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.name && errors.name.message}
                                            </small>
                                            <div className="col-md-12 mb-4">
                                                <label>Email</label>
                                                <img src={Env} className="img-form" alt={'env'} />
                                                <input type="text"
                                                    className="form-control"
                                                    {...register('email', inputValidation.email)}
                                                    placeholder="Enter your Email Address" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.email && errors.email.message}
                                            </small>
                                            <div className="col-md-12 mb-4">
                                                <label>Phone Number</label>
                                                <img src={Phone} className="img-form" alt={'user2'} />
                                                <input type="number"
                                                    className="form-control"
                                                    {...register('phoneNumber', inputValidation.phoneNumber)}
                                                    placeholder="Enter your Phone Number" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.phoneNumber && errors.phoneNumber.message}
                                            </small>

                                            <div className="col-md-12 mb-4">
                                                <div className={'d-flex'}>
                                                    <div className={"w-100"}>
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
                                                    </div>
                                                    <div className="mt-1">
                                                        <i className="zmdi zmdi-gps-dot cur__location" style={{ cursor: 'pointer' }} onClick={getCurrentLocation} />
                                                    </div>
                                                </div>
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
                                            </div>
                                            <div className="col-md-12 mb-4">
                                                <label>Password</label>
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('password', inputValidation.password)}
                                                    placeholder="Enter Your Password" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.password && errors.password.message}
                                            </small>
                                            {formButton}
                                        </div>
                                    </form>
                                    <div className={'customer__login__bottom-02 text-center p-4'}>
                                        <p>Already have an account?</p>
                                        <NavLink to={'/login'}><button className={'btn btn-send btn-block'}>Login</button></NavLink>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, name, isSignUp, phoneNumber, location) => dispatch(action.auth(email, password, name, isSignUp, phoneNumber, location))
    }
}
export default GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(connect(mapStateToProps, mapDispatchToProps)(Register));


