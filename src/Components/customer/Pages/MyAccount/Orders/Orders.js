import React, { useState, useEffect } from "react";
import "./order.css";
import axios from "axios";
import { Modal, Row, Col } from "react-bootstrap";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import Loader from "../../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../../lib/ApiError/ApiError"
import Countdown from 'react-countdown';
const Orders = (props) => {

    const addUpHour = (orders) => {

        orders.forEach((order) => {
            let largestHour = 0
            let time;
            order.items.forEach((item, index) => {
                let hour = parseInt(item.itemTime.slice(0, 2))
                let min = parseInt(item.itemTime.slice(3, 6))
                let hourIntoMiliSecond = hour * (1000 * 60 * 60)
                let minuteIntoMiliSecond = (min * 1000 * 60)
                let timer = minuteIntoMiliSecond + hourIntoMiliSecond
                if (timer > largestHour) {
                    largestHour = timer
                    time = item.itemTime
                }
            })

            let hour = parseInt(time.slice(0, 2))
            let minute = parseInt(time.slice(3, 6))
            let createdAt = new Date(order.createdAt).getTime();
            let currentTime = Date.now()
            let diff = currentTime - createdAt
            let hourIntoMiliSecond = hour * (1000 * 60 * 60)
            let minuteIntoMiliSecond = (minute * (1000 * 60))
            let timer = minuteIntoMiliSecond + hourIntoMiliSecond
            const actualDifferenceInMiliSecond = timer - diff
            if (actualDifferenceInMiliSecond <= 0 && order.orderStatus === "IN_PROGRESS") {
                axios.put('/vendor/to-ready/' + order._id)
                    .then((res) => {
                        console.log(res.data)
                    })
            } else {
                order.totalTime = actualDifferenceInMiliSecond
            }
        })
        setBooking(orders)

    }

    const [booking, setBooking] = useState(null);
    const [completedBooking, setCompletedBooking] = useState(null)
    const [cancelledOrder, setCancelledOrder] = useState(null);
    const [isApiError, setIsApiError] = useState(false)
    const [isMsgError, setIsMsgError] = useState(null)
    const [show, setShow] = useState(false)
    const [currentLocation, setCurrentLocation] = useState(null)
    const token = localStorage.getItem('token');

    const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        axios.get('/pending-orders', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                if (res.data.length > 0) {
                    addUpHour(res.data)
                } else {
                    setBooking([])
                }
            })
            .catch((err) => {
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("CUSTOMER PENDING ORDER GET", err)
            })

        axios.get('/completed-orders', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                setCompletedBooking(res.data.completedOrder);
                setCancelledOrder(res.data.rejectedOrder);

            })
            .catch((err) => {
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("CUSTOMER COMPLETED ORDER GET", err)
            })
    }, [])

    let orders = (
        <div className={'mt-5'}>
            <Loader style={'text-center'} />
        </div>
    );

    if (booking && booking.length === 0) {
        orders = (
            <div className={'mt-5'}>
                <h5 style={{ fontWeight: "bold" }} className={'text-center'}>No Active Orders</h5>
            </div>
        )
    }

    const handleClose = () => setShow(false);

    const ModalHandler = (order) => {
        console.log(order)
        axios.get('/shop-location/' + order.shop._id)
            .then((res) => {
                console.log(res.data)
                setCurrentLocation({
                    lat: res.data.location.coordinates[0],
                    lng: res.data.location.coordinates[1],
                })
                setShow(!show);
            })

    }

    const modal = (
        <Modal show={show} size={'md'} onClick={handleClose} style={{ borderRadius: "15px" }} className="StaffEditCard">
            <div className={'map_wrapper_setting'}>
                <Map google={props.google}
                    initialCenter={currentLocation}
                    zoom={16}
                >
                    <Marker
                        position={
                            currentLocation
                        }
                        name={'Your position'} />
                </Map>
            </div>
        </Modal>
    )

    if (booking && booking.length > 0) {
        orders = (
            <div className="row m-1 w-100">
                {
                    booking.map((order) => {
                        console.log(order)
                        return (
                            <>
                                <div className="col-md-6 mb-3">
                                    <div className={'card sign-up-card rounded shadow border-0 bg-white'}>
                                        <div className="shop-name">
                                            <div className={'res-name row'}>
                                                <div className={'col-md-6'}>
                                                    <h5>{order.shop.shopName}</h5>
                                                </div>
                                                <div className={'col-md-6'}>
                                                    {
                                                        order.orderStatus ?
                                                            <div>
                                                                <div style={{ fontWeight: "bold" }}>
                                                                    {order.pickUp && (order.orderStatus === 'READY') ?
                                                                        <div className="d-flex mt-0">
                                                                            <a onClick={() => ModalHandler(order)} >View Map</a>
                                                                            <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> Order is Ready</p>
                                                                        </div>

                                                                        : null
                                                                    }
                                                                    {!order.pickUp && (order.orderStatus === 'READY') ?
                                                                        <div className="d-flex mt-0">
                                                                            <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> Your Order is Ready and will be deliver soon.</p>
                                                                        </div> : null

                                                                    }

                                                                    {
                                                                        order.orderStatus === 'UNDER_APPROVAL' ?
                                                                            <p style={{ fontWeight: "bold", color: "#fff" }}>Your Order is yet to approve</p> : null
                                                                    }
                                                                    {
                                                                        order.pickUp && (order.orderStatus === 'IN_PROGRESS') ?
                                                                            <div className="d-flex">
                                                                                <a onClick={() => ModalHandler(order)} >View Map</a>
                                                                                <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> <Countdown date={Date.now() + order.totalTime} /></p>
                                                                            </div>
                                                                            : null
                                                                    }
                                                                    {
                                                                        !order.pickUp && (order.orderStatus === 'IN_PROGRESS') ?
                                                                            <div className="d-flex">
                                                                                <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> <Countdown date={Date.now() + order.totalTime} /></p>
                                                                            </div>
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pl-3 pr-3">
                                            {
                                                order.items.map((item, index) => {
                                                    return (
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <p >
                                                                    {item.itemName} <span style={{ fontWeight: "bold" }} className="mr-2"> x {item.quantity}</span> {
                                                                        item.addOn ?
                                                                            item.addOn.map((addOnData) => (
                                                                                <>
                                                                                    {addOnData.name}
                                                                                </>
                                                                            ))
                                                                            : null
                                                                    }</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: "bold" }} className={'d-flex justify-content-end'}>
                                                                    $ {item.itemPrice * item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    )

                                                })
                                            }
                                        </div>

                                        <hr />

                                        <div className={'d-flex justify-content-between'}>
                                            <div>
                                                <h5 style={{ fontWeight: "bold" }} className="ml-2" >Total:</h5>
                                            </div>
                                            <div>
                                                <h5 style={{ fontWeight: "bold" }} className={'mt-0 d-flex justify-content-end mr-2'}>$ {order.totalPrice} </h5>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </>
                        )
                    })
                }
            </div>
        )
    }
    // ************** past orders *************

    let pastOrders = (
        <div className={'mt-5'}>
            <Loader style={'text-center'} />
        </div>
    );

    if (completedBooking && completedBooking.length === 0) {
        pastOrders = (
            <div className={'mt-5'}>
                <h5 style={{ fontWeight: "bold" }} className={'text-center'}>No Past Orders</h5>
            </div>
        )
    }

    if (completedBooking && completedBooking.length > 0) {
        pastOrders = (
            <div className="row m-3 w-100">
                {
                    completedBooking.map((order) => {
                        return (
                            <>
                                <div className="col-md-6 mb-3">
                                    <div className={'card sign-up-card rounded shadow border-0 bg-white'}>
                                        <div className="shop-name">
                                            <div className={'res-name row'}>
                                                <div className={'col-md-6'}>
                                                    <h5>{order.shop.shopName}</h5>
                                                </div>
                                                <div className={'col-md-6'}>
                                                    {
                                                        order.orderStatus ?
                                                            <div>
                                                                <div style={{ fontWeight: "bold" }}>
                                                                    {order.pickUp && (order.orderStatus === 'READY') ?
                                                                        <div className="d-flex mt-0">
                                                                            <a onClick={() => ModalHandler(order)} >View Map</a>
                                                                            <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> Order is Ready</p>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                    {
                                                                        order.orderStatus === 'REJECTED' ?
                                                                            <p style={{ fontWeight: "bold", color: "#fff" }}>Order Cancelled</p> : null
                                                                    }
                                                                    {
                                                                        order.orderStatus === 'UNDER_APPROVAL' ?
                                                                            <p style={{ fontWeight: "bold", color: "#fff" }}>Your Order is yet to approve</p> : null
                                                                    }
                                                                    {
                                                                        order.orderStatus === 'IN_PROGRESS' ?
                                                                            <div className="d-flex">
                                                                                <a onClick={() => ModalHandler(order)} >View Map</a>
                                                                                <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> <Countdown date={Date.now() + order.totalTime} /></p>
                                                                            </div>
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pl-3 pr-3">
                                            {
                                                order.items.map((item, index) => {
                                                    return (
                                                        <div className={'d-flex justify-content-between'}>
                                                            <div>
                                                                <p >
                                                                    {item.itemName} <span style={{ fontWeight: "bold" }} className="mr-2"> x {item.quantity}</span> {
                                                                        item.addOn ?
                                                                            item.addOn.map((addOnData) => (
                                                                                <>
                                                                                    {addOnData.name}
                                                                                </>
                                                                            ))
                                                                            : null
                                                                    }</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: "bold" }} className={'d-flex justify-content-end'}>
                                                                    $ {item.itemPrice * item.quantity}</p>
                                                            </div>
                                                        </div>
                                                    )

                                                })
                                            }
                                        </div>

                                        <hr />
                                        <div className={'d-flex justify-content-between'}>
                                            <div>
                                                <h5 style={{ fontWeight: "bold" }} className="ml-2" >Total:</h5>
                                            </div>
                                            <div>
                                                <h5 style={{ fontWeight: "bold" }} className={'mt-0 d-flex justify-content-end mr-2'}>$ {order.totalPrice} </h5>
                                            </div>
                                        </div>


                                    </div>
                                </div>
                            </>
                        )
                    })
                }
            </div>
        )
    }

    // ******************* cancelled order ****************

    let cancelledOrders = (
        <div className={'mt-5'}>
            <Loader style={'text-center'} />
        </div>
    );

    if (cancelledOrder && cancelledOrder.length === 0) {
        cancelledOrders = (
            <div className={'mt-5'}>
                <h5 style={{ fontWeight: "bold" }} className={'text-center'}>No Cancelled Orders</h5>
            </div>
        )
    }

    if (cancelledOrder && cancelledOrder.length > 0) {
        cancelledOrders = (
            <div className="row m-3 w-100">
                {
                    cancelledOrder.map((order) => {
                        return (
                            <>
                                <div className="col-md-6 mb-3">
                                    <div className={'card sign-up-card rounded shadow border-0 bg-white'}>
                                        <div className="shop-name">
                                            <div className={'res-name row'}>
                                                <div className={'col-md-6'}>
                                                    <h5>{order.shop.shopName}</h5>
                                                </div>
                                                <div className={'col-md-6'}>
                                                    {
                                                        order.orderStatus ?
                                                            <div>
                                                                <div style={{ fontWeight: "bold" }}>
                                                                    {order.pickUp && (order.orderStatus === 'READY') ?
                                                                        <div className="d-flex mt-0">
                                                                            <a onClick={() => ModalHandler(order)} >View Map</a>
                                                                            <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> Order is Ready</p>
                                                                        </div>
                                                                        : null
                                                                    }
                                                                    {
                                                                        order.orderStatus === 'REJECTED' ?
                                                                            <p style={{ fontWeight: "bold", color: "#fff" }}>Order Cancelled</p> : null
                                                                    }
                                                                    {
                                                                        order.orderStatus === 'UNDER_APPROVAL' ?
                                                                            <p style={{ fontWeight: "bold", color: "#fff" }}>Your Order is yet to approve</p> : null
                                                                    }
                                                                    {
                                                                        order.orderStatus === 'IN_PROGRESS' ?
                                                                            <div className="d-flex">
                                                                                <a onClick={() => ModalHandler(order)} >View Map</a>
                                                                                <p style={{ fontWeight: "bold", color: "#fff", marginLeft: "20px" }}> <Countdown date={Date.now() + order.totalTime} /></p>
                                                                            </div>
                                                                            : null
                                                                    }
                                                                </div>
                                                            </div>
                                                            : null
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pl-3 pr-3">
                                            {
                                                order.items.map((item, index) => {
                                                    return (
                                                        <div className="d-flex justify-content-between">
                                                            <div>
                                                                <p>
                                                                    {item.itemName} <span style={{ fontWeight: "bold" }} className="mr-2"> x {item.quantity}</span> {
                                                                        item.addOn ?
                                                                            item.addOn.map((addOnData) => (
                                                                                <>
                                                                                    {addOnData.name}
                                                                                </>
                                                                            ))
                                                                            : null
                                                                    }</p>
                                                            </div>
                                                            <div>
                                                                <p style={{ fontWeight: "bold" }} className={'d-flex justify-content-end'}>
                                                                    $ {item.itemPrice * item.quantity}</p>
                                                            </div>
                                                        </div>

                                                    )

                                                })
                                            }
                                        </div>

                                        <hr />
<div className="d-flex justify-content-between">
    <div>
    <h5 style={{ fontWeight: "bold" }} className="ml-2" >Total:</h5>
    </div>
    <div>
    <h5 style={{ fontWeight: "bold" }} className={'mt-0 d-flex justify-content-end mr-2'}>$ {order.totalPrice} </h5>
    </div>
</div>
                                    </div>
                                </div>
                            </>
                        )
                    })
                }
            </div>
        )
    }


    return (
        <>
            {modal}
            <ApiError show={isApiError} error={isMsgError} />
            <div className={'container'}>
                <h2 style={{ fontWeight: "bold" }}>Active Orders</h2>
                <div className={'container'}>
                    {orders}
                </div>
            </div>
            <div className={'container mt-5 mb-5'}>
                <h2 style={{ fontWeight: "bold" }}>Past Orders</h2>
                <div className={'container'}>
                    {pastOrders}
                </div>
            </div>
            <div className={'container mt-5 mb-5'}>
                <h2 style={{ fontWeight: "bold" }}>Cancelled Orders</h2>
                <div className={'container'}>
                    {cancelledOrders}
                </div>
            </div>
        </>
    )
}
export default (GoogleApiWrapper({
    apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(Orders));
