import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import "../../../../assets/style.css";
import { connect } from "react-redux";
import { fetchShops } from "../../../../Store/customer/actions/index";
import Loader from "../../../../lib/customer/Loader/Loader";
import { Map, GoogleApiWrapper, Marker, InfoWindow } from "google-maps-react";
import InfoWindowEx from "../../../../lib/customer/InfoWindow/InfoWindow";
import './restaurant.css'

const Restaurant = (props) => {
    const [selectedLocation, setSelectedLocation] = useState( null);
    const [marker, setMarker] = useState({});
    const [selectedShop, setSelectedShop] = useState(null);
    const [infoShow, setInfoShow] = useState(false);


    useEffect(() => {
        const latitudeQueryString = new URLSearchParams(props.location.search).get('latitude')
        const longitudeQueryString = new URLSearchParams(props.location.search).get('longitude')
        console.log(latitudeQueryString, longitudeQueryString)
        setSelectedLocation({
            lat: latitudeQueryString,
            lng: longitudeQueryString
        })
        props.getAllStore(latitudeQueryString, longitudeQueryString);
        window.scrollTo(0, 0)
    }, [])

    const onMarkerClick = (props, marker, shop) => {
        setSelectedShop(shop)
        setMarker(marker)
        setInfoShow(true);
    }


    let restaurant = (
        <div className={'text-center'}>
            <Loader />
        </div>
    )

    if (props.shops && props.shops.length === 0) {
        restaurant = (
            <div style={{ height: '100vh' }} className="col-md-12 col-lg-4" >
                <p className={'text-center mt-5'}>No Restaurant Found</p>
            </div>
        )
    }

    let iconColor = { color: '#ff4200'}

    if (props.shops && props.shops.length > 0) {
        restaurant = (
            props.shops.map((shop) => {
                console.log(shop)
                return (
                    <div className="col-md-6 col-lg-4 shop_cart mb-5">
                        <img  src={shop.shopImage.avatar} alt={'pro-img'} />
                        <div className="pro-head">
                            <div>
                                <h3 className="text-left pb-2">{shop.shopName}</h3>
                                <FaMapMarkerAlt style={iconColor} />
                                <span>{shop.address}</span>
                                <hr />
                            </div>
                            <NavLink to={`/restaurantView/${shop._id}`}><button className={'btn btn-visit'}>Visit</button></NavLink>
                        </div>
                    </div>
                )
            })
        )
    }

    const  onInfoWindowClose = () => {
        setMarker(null);
        setInfoShow(false)
    };
    return (
        <div>
            {
                selectedLocation ?
                    <div className="map_wrapper">
                        <Map google={props.google}
                             initialCenter={selectedLocation}
                             zoom={14}
                        >
                            {
                                props.shops ?
                                    props.shops.map((shop) => (
                                        <Marker
                                            onClick={(props, marker) => onMarkerClick(props, marker, shop)}
                                            position={{
                                                lat: shop.location.coordinates[0],
                                                lng: shop.location.coordinates[1]
                                            }}
                                            name={'Your position'} />
                                    ))

                                    : null
                            }
                            <Marker
                                icon={{
                                    url: 'data:image/svg+xml;base64,PHN2ZyBiYXNlUHJvZmlsZT0iZnVsbCIgd2lkdGg9Ijg2IiBoZWlnaHQ9Ijg2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogICAgPGRlZnM+CiAgICAgICAgPGZpbHRlciBpZD0iYSIgY29sb3ItaW50ZXJwb2xhdGlvbi1maWx0ZXJzPSJzUkdCIj4KICAgICAgICAgICAgPGZlRHJvcFNoYWRvdyBkeD0iMCIgZHk9Ii41IiBzdGREZXZpYXRpb249Ii45IiBmbG9vZC1jb2xvcj0iIzkzOTM5OCIvPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iOCIgZmlsbD0iIzk0YzdmZiI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgZnJvbT0iMTEiIHRvPSI0MCIgZHVyPSIycyIgYmVnaW49IjBzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIvPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGZyb209IjEiIHRvPSIwIiBkdXI9IjJzIiBiZWdpbj0iMHMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIi8+CiAgICA8L2NpcmNsZT4KICAgIDxjaXJjbGUgY3g9IjQzIiBjeT0iNDMiIHI9IjgiIGZpbGw9IiNmZmYiIGZpbHRlcj0idXJsKCNhKSIvPgogICAgPGNpcmNsZSBjeD0iNDMiIGN5PSI0MyIgcj0iNSIgZmlsbD0iIzAxN2FmZiI+CiAgICAgICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSI1OzYuNTs1IiBiZWdpbj0iMHMiIGR1cj0iNC41cyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiLz4KICAgIDwvY2lyY2xlPgo8L3N2Zz4K',
                                }}
                                position={
                                    selectedLocation
                                }
                                name={'Your position'} />
                            {
                                selectedShop ?
                                    <InfoWindowEx
                                        marker={marker}
                                        onClose={onInfoWindowClose}
                                        visible={infoShow}
                                        options={{ maxWidth: 200, maxHeight: 500 }}
                                    >
                                        <div>
                                            <img alt={'shop'}
                                                 src={selectedShop.shopImage.avatar}
                                                 className={'img-fluid w-100'}
                                            />
                                            <p className={'bold p-0 m-0'} style={{ cursor: 'pointer' }} onClick={() => window.location.href = '/restaurantView/' + selectedShop._id}>{selectedShop.shopName}</p>
                                        </div>
                                    </InfoWindowEx>
                                    : null
                            }
                        </Map>
                    </div>
             : null
            }
            <div className={'shops'} >
                <section className="py-5 restaurant-section">
                    <div className="row">
                        <div className="container shops_div">
                            <h1> All Restaurants </h1>
                            <div className={"bar-three"}></div>
                            <div className={"bar-four"}></div>
                            <div className="row">
                                {
                                    restaurant
                                }
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </div>
    )
}
const mapStateToProps = state => {
    return {
        shops: state.shop.shops,
        loading: state.shop.loading
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getAllStore: (latitudeQueryString, longitudeQueryString) => dispatch(fetchShops(latitudeQueryString, longitudeQueryString))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(Restaurant));
