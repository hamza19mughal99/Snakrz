import React, { useState} from 'react'
import "../../../../assets/style.css";
import { FaSearch } from 'react-icons/fa';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import 'owl.carousel/dist/assets/owl.theme.default.min.css';
import GooglePlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";
import './Home.css'
import axios from "axios";

const Homesection = () => {

    const [value, setValue] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState( null)

    const onFormSubmit = (e) => {
        e.preventDefault();
        console.log(selectedLocation)

        if (selectedLocation) {
            window.location.href = `/restaurant?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}`
        }

    }


    const onPlaceSearch =  (val) => {
        console.log(val)
        setValue(val)
        geocodeByAddress(val.label)
            .then(results => getLatLng(results[0]))
            .then(({ lat, lng }) => {
                    console.log('PLACES', lat, lng)
                    setSelectedLocation({
                        lat,
                        lng
                    })
                }
            );
    }


    const getCurrentLocation = () => {
        navigator.geolocation.getCurrentPosition(function(position) {
            axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude}, ${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API}`)
                .then((res) => {
                    let obj = {
                        label: res.data.results[0].formatted_address,
                        value: res.data.results[0],
                    }
                    console.log(obj)
                    setValue(obj)
                })
            setSelectedLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            })
        });
    }


    return (
        <>
            <div className="main-homeSection">
                <section className="banner-section">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <div className="heading-text">
                                    <h1>Discover the best food & drinks in London, UK</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section className="filter-section">
                    <div className="container">
                        <div className="row justify-content-center align-items-center">
                            <div className="col-12">
                                <div className="card form-section-card ">
                                    <form action="" className="" onSubmit={onFormSubmit}>
                                        <div className="d-flex icon-box ">
                                            <span className="fas map-alt" onClick={getCurrentLocation}> <i className="zmdi zmdi-gps-dot" style={{cursor: 'pointer'}} /> </span>
                                            <div className="ml-4" style={{width: '1000%'}}>
                                                <GooglePlacesAutocomplete
                                                    autocompletionRequest={{
                                                        bounds: [
                                                            { lat: 50, lng: 50 },
                                                            { lat: 100, lng: 100 }
                                                        ],
                                                    }}

                                                    style={{
                                                        borderStyle: 'none'
                                                    }}

                                                    apiKey={process.env.REACT_APP_GOOGLE_MAP_API}
                                                    selectProps={{
                                                        placeholder:'Enter Location',
                                                        value,
                                                        onChange: (val) => onPlaceSearch(val),
                                                    }}
                                                />
                                            </div>
                                            <div className="input-group">
                                                {
                                                    selectedLocation ?
                                                        (
                                                            <button type="submit" className="btn-primary">
                                                    <span className="fas search-alt " >
                                                        <FaSearch style={{color: '#ff4200'}} />
                                                    </span>
                                                            </button>
                                                        )
                                                        : <button type="submit" disabled className="btn-primary">
                                                    <span className="fas search-alt " >
                                                        <FaSearch  />
                                                    </span>
                                                        </button>
                                                }

                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </>
    )
}
export default Homesection