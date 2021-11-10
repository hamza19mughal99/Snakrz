import React, { useState, useEffect } from "react";
import "./restaurant.css";
import { connect } from "react-redux";
import * as actions from '../../../../Store/customer/actions/index';
import Menu from "./Menu";
import axios from "axios";
import { Row, Col, Modal } from "react-bootstrap";
import { FaMapMarkerAlt } from 'react-icons/fa';
import RatingStar from "../../../../lib/customer/RatingStar/RatingStar";
import ApiError from "../../../../lib/ApiError/ApiError"
import Loader from "../../../../lib/customer/Loader/Loader";

const RestaurantView = (props) => {

    const storeId = props.match.params.id;
    const [allServices, setAllServices] = useState(null)
    const [isApiError, setIsApiError] = useState(false)
    const [isMsgError, setIsMsgError] = useState(null)
    const [category, setCategory] = useState([])
    const [isOrdered, setIsOrdered] = useState(false)
    const [allReviews, setAllReviews] = useState([])

    const customerToken = localStorage.getItem('token')
    console.log(customerToken)
    useEffect(() => {

        axios.get('/reviews/' + storeId)
            .then((res) => {
                console.log(res.data)
                setAllReviews(res.data.reviews);
            })

        if (localStorage.getItem('redirect_to')) {
            localStorage.removeItem(localStorage.getItem('redirect_to'))
        }
        if (customerToken) {
            axios.get('/already-ordered/' + storeId, { headers: { "Authorization": `Bearer ${customerToken}` } })
                .then((res) => {
                    console.log(res.data)
                    setIsOrdered(res.data.isOrdered)
                })
        }
        else {
            setIsOrdered(true)
        }
        props.getShop(storeId);
        console.log(props.shop)
        axios.get(`/shop/${storeId}`)
            .then((res) => {
                setAllServices(res.data.product)
            })
            .catch((err) => {
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("RESTAURANT VIEW", err)
            })

        axios.get(`/category/${storeId}`)
            .then((res) => {
                setCategory(res.data)
            })
        window.scrollTo(0, 0)
    }, []);

    let products;
    if (!allServices) {
        products = <Loader style={'text-center'} />
    }

    if (allServices && allServices.length === 0) {
        products = (
            <div className={'text-center'}>
                <h5 style={{ fontWeight: "bold" }}> No Product Found </h5>
            </div>
        )
    }

    if (allServices && allServices.length > 0) {
        products = <Menu isOrdered={isOrdered} category={category} products={allServices} store={storeId} />

    }

    let RestaurantView = (
        <div style={{ height: '100vh' }} className={'d-flex justify-content-center'}>
            <Loader style={'text-center mt-5'} />
        </div>
    )

    const [show, setShow] = useState(false)

    const reviewModalHandler = () => {
        setShow(!show)
    }
    const handleClose = () => setShow(!show);

    const modal = (
        <Modal show={show} size={'lg'} className={'h-100 w-100'}>
            <Modal.Body>
                <div className="d-flex justify-content-between align-items-center">
                    <p style={{ fontSize: "20px" }}> Reviews </p>
                    <p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
                </div>
                <hr />
                {
                    allReviews.map((reviews, index) => (
                        <>
                            <div key={allReviews} className={'container'}>
                                <div className="d-flex  justify-content-between">
                                    <div>
                                        <p>{reviews.customerId.name}</p>
                                    </div>
                                    <div>
                                        <RatingStar value={parseInt(reviews.rating)} />
                                    </div>
                                </div>
                                <p>{reviews.comment}</p>
                            </div>
                            <hr />
                        </>
                    ))
                }

            </Modal.Body>
        </Modal>
    )

    if (!props.loading && props.shop && props.shop.shopBannerImage) {
       
        RestaurantView = (
            <div className={'container w-100 shadow res_div'}>
                <img className={'res-img'} src={props.shop.shopBannerImage.avatar} alt="img" />
                <div className={'mt-3'}>
                    <h3 style={{ fontWeight: "700" }}> {props.shop.shopName} </h3>
                    <div className="bar-view1"></div>
                    <div className="bar-view2"></div>
                </div>
                <div className={'d-flex'}>
                    <div>
                        <RatingStar  value={parseInt(props.shop.avgRating)} />
                    </div>
                    <div className={'ml-2 mt-1 review-tag'}>
                        <p onClick={reviewModalHandler}> Check Reviews </p>
                    </div>
                </div>
                <div className={'d-flex'}>
                    <div >
                        <span className="map-alt mt-3"><FaMapMarkerAlt /> </span>
                    </div>
                    <div className={'ml-2 mt-2'}>
                        <p> {props.shop.address} </p>
                    </div>
                </div>
                <p className={'text-left light'}>
                    <td dangerouslySetInnerHTML={{ __html: props.shop.description }} />
                </p>
                <div className="mt-4">
                    {products}
                </div>
            </div>
        )
    }
    return (
        <>
            {modal}
            <ApiError show={isApiError} error={isMsgError} />
            {RestaurantView}
        </>
    )
}
const mapStateToProps = state => ({
    shop: state.shop.shop,
    loading: state.shop.loading,
})
const mapDispatchToProps = dispatch => ({
    getShop: (storeId) => dispatch(actions.fetchShop(storeId)),
})
export default connect(mapStateToProps, mapDispatchToProps)(RestaurantView)
