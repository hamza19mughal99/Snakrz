import React, { useState, useEffect } from "react";
import "./order.css";
import axios from "axios";
import { Modal, Row, Col, ModalBody, Form } from "react-bootstrap";
import { ReviewSentSuccessfully } from "../../../../../lib/customer/Toaster/Toaster";
import { useToasts } from "react-toast-notifications";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import Loader from "../../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../../lib/ApiError/ApiError"
import ReactStars from "react-rating-stars-component";
import Countdown from 'react-countdown';
const Orders = (props) => {

    const { addToast } = useToasts()

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
    const [orderId, setOrderId] = useState(null)
    const [customerId, setCustomerId] = useState('');
    const [submitLoader, setSubmitLoader] = useState(false);
    const [comment, setComment] = useState("")
    const [shopId, setShopId] = useState("");
    const [starRating, setStarRating] = useState(1)
    const [error, setError] = useState(false)
    const [show2, setShow2] = useState(false)
    const [doneReview, setDoneReview] = useState('')
    const [address, setAddress] = useState(null)


    const token = localStorage.getItem('token');

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

    // -------------------------reviews--------------------------

    const ReviewModalHandler = (myOrder) => {

        setShow2(true);
        setCustomerId(myOrder.customer);
        setOrderId(myOrder._id);
        setShopId(myOrder.shop._id)
    }

    const handleModalForm = (e) => {
        setSubmitLoader(true)
        e.preventDefault()
        if (comment === "") {
            setError(true)
        }
        axios.post("/review/" + orderId, {
            "customerId": customerId,
            "rating": starRating,
            "comment": comment,
            "shop": shopId
        }).then((res) => {
            setSubmitLoader(false)
            setShow2(false)
            window.location.reload();
            ReviewSentSuccessfully(addToast)
            // setDoneReview(true)
        }).catch((err) => {
            console.log(err.message)
            setSubmitLoader(false)
        })
    }

    let errorMessage;

    if (error) {
        errorMessage = (
            <small style={{ color: "red" }}>
                Must Fill Comment
            </small>
        )
    }


    let btn;
    if (submitLoader) {
        btn = (
            <Loader style={'text-center'} />
        )

    } else {
        btn = <div className="text-center">
            <button type="submit" className="btn-send w-50" >Submit</button>
        </div>
    }

    const handleClose2 = () => setShow2(false);



    const reviewModal = (
        <Modal show={show2} size={'lg'} id={'service__modal'}>
            <Modal.Header>
                <Modal.Title className={'uppercase white bold'}>Reviews</Modal.Title>
                <Modal.Title style={{ cursor: "pointer" }} className={'uppercase white bold'} onClick={handleClose2} >X</Modal.Title>
            </Modal.Header>
            <ModalBody className={'px-5'}>
                <Row className={'mt-4'}>
                    <Col className={'appointment__model'}>
                        <h3 className={'text-center '}>Write a Review</h3>
                    </Col>
                </Row>
                <Form onSubmit={handleModalForm}>
                    <div className="text-center d-flex justify-content-center">
                        <ReactStars
                            count={5}
                            value={starRating}
                            required
                            half={true}
                            size={24}
                            activeColor="#ff4200"
                            onChange={(val) => setStarRating(val)}
                        />
                    </div>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label className={'comment-head'} >COMMENTS</Form.Label>
                        <Form.Control as="textarea" rows={3} className={'comment'} value={comment} onChange={(e) => setComment(e.target.value)} />
                    </Form.Group>
                    {errorMessage}

                    {btn}
                </Form>
            </ModalBody>
        </Modal>
    )


    // ------------------------reviews----------------------------




    const handleClose = () => setShow(false);
    const ModalHandler = (order) => {
        setAddress(order.shop.address)
        axios.get('/shop-location/' + order.shop._id)
            .then((res) => {
                setCurrentLocation({
                    lat: res.data.location.coordinates[0],
                    lng: res.data.location.coordinates[1],
                })
                setShow(!show);
            })

    }

    const modal = (
        <Modal show={show} size={'md'} style={{ borderRadius: "15px" }} className="StaffEditCard">
            <Modal.Header>
                <Modal.Title className={'uppercase white bold'}>Map</Modal.Title>
                <Modal.Title style={{ cursor: "pointer" }} className={'uppercase white bold'} onClick={handleClose} >X</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <h5>Address: {address} </h5>
                </div>
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
            </Modal.Body>

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
                                                                            :

                                                                            order.isReviewed === false ?
                                                                                <p onClick={() => ReviewModalHandler(order)} style={{ fontWeight: "bold", color: "#fff", cursor: "pointer" }}>Give Review</p>
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
            {reviewModal}
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
