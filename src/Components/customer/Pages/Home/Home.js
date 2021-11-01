import React, { useState} from 'react'
import "../../../../assets/style.css";
import { FaSearch, FaMapMarkerAlt } from 'react-icons/fa';
// import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.min.css';
import 'owl.carousel/dist/assets/owl.theme.default.min.css';
import GooglePlacesAutocomplete, {geocodeByAddress, getLatLng} from "react-google-places-autocomplete";
import './Home.css'

// import cat1 from "../../../../assets/customer/img/cat1.png"
// import cat2 from "../../../../assets/customer/img/cat2.png"
// import cat3 from "../../../../assets/customer/img/cat3.png"

const Homesection = () => {

    const [value, setValue] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState( null)

    const onFormSubmit = (e) => {
        e.preventDefault();

        if (!selectedLocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                setSelectedLocation({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                })
            });
        }

        if (selectedLocation) {
            window.location.href = `/restaurant?latitude=${selectedLocation.lat}&longitude=${selectedLocation.lng}`
        }

    }


    const onPlaceSearch =  (val) => {
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
                                            <span className="fas map-alt"> <FaMapMarkerAlt /> </span>
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
                                                <button type="submit" className="btn-primary">
                                                    <span className="fas search-alt "><FaSearch /> </span>
                                                </button>
                                            </div>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            {/* <section className="py-5 product-section">
                <div className="container">
                    <div className="row mb-4">
                        <div className="col-md-12 text-center">
                            <h3 className="section-title">Categories</h3>
                            <div className="bar-one"></div>
                            <div className="bar-two"></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 col-md-12 col-sm-10">
                            <OwlCarousel items={3}
                                className="owl-theme"
                                loop
                                nav={true}
                                margin={20}
                                autoplay={true}
                                responsive={false}
                                mergeFit={true}
                            >
                                <div className="item">
                                    <NavLink to="/homeCooked">
                                        <div className="box-product">
                                            <div className="pro-img"><img src={cat1} alt="cat1" /></div>
                                            <div className="pro-head ">
                                                <p className="text-center">Homecooked food</p>
                                            </div>

                                        </div>
                                    </NavLink>
                                </div>
                                <div className="item">
                                    <NavLink to="/desserts">
                                        <div className="box-product">
                                            <div className="pro-img"><img src={cat2} alt="cat2" /></div>
                                            <div className="pro-head ">
                                                <p className="text-center">desserts</p>
                                            </div>

                                        </div>
                                    </NavLink>
                                </div>
                                <div className="item">
                                    <NavLink to="/drinks">
                                        <div className="box-product">
                                            <div className="pro-img"><img src={cat3} alt="cat3" /></div>
                                            <div className="pro-head ">
                                                <p className="text-center">drinks</p>
                                            </div>

                                        </div>
                                    </NavLink>
                                </div>
                            </OwlCarousel>
                        </div>
                    </div>
                </div>
            </section> */}
        </>
    )
}
export default Homesection
