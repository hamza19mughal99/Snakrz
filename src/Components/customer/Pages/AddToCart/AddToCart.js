import React, { useContext, useState, useEffect } from "react";
import { CartContext } from '../../../../GlobalStore/CartContext';
import { connect } from "react-redux";
import * as actions from "../../../../Store/customer/actions/index";
import axios from "axios";
import { Form } from "react-bootstrap";
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import "./AddToCart.css";
import { useToasts } from "react-toast-notifications";
import ApiError from "../../../../lib/ApiError/ApiError"
import { orderPostSuccessfully } from "../../../../lib/customer/Toaster/Toaster";
import Loader from "../../../../lib/customer/Loader/Loader";
import * as action from "../../../../Store/customer/actions";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const AddToCart = (props) => {

    const { addToast } = useToasts()
    const stripe = useStripe();
    const elements = useElements();
    const [errorMessage, setErrorMessage] = useState(null);

    const [userName, setUserName] = useState("")
    const [userEmail, setUserEmail] = useState("")
    const [userPhone, setUserPhone] = useState("")
    const [btnLoader, setBtnLoader] = useState(false);
    const [orderData, setOrderData] = useState({})
    const [isApiError, setIsApiError] = useState(false)
    const [isMsgError, setIsMsgError] = useState(null)

    const token = localStorage.getItem("token")
    let cart = JSON.parse(localStorage.getItem('cart'))
    const storeId = props.match.params.id;
    if (cart && cart.length <= 0) {
        window.location.href = '/restaurantView/' + storeId
    }

    useEffect(() => {

        window.scrollTo(0, 0)

        axios.get('/current-user', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setUserName(res.data.name);
                setUserEmail(res.data.email);
                setUserPhone(res.data.phoneNumber);
            })
            .catch((err) => {
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("CUSTOMER CURRENT USER GET", err)
            })

        setOrderData(JSON.parse(localStorage.getItem('cart')))
    }, [])



    let totalAmount = 0
    let totalAddOn = 0
    if (cart) {
        totalAmount = cart.reduce((acc, val) => {
            if (val.addOn.length > 0) {
                totalAddOn = val.addOn.reduce((acc, val2) => {
                    return acc + (+val2.price)
                }, 0)
            }
            return acc + (+val.productPrice) * (val.Quantity) + totalAddOn
        }, 0)
    }



    const { dispatch } = useContext(CartContext)

    const addAddonPrice = (val) => {
        let addOn = val.addOn.reduce((acc, val2) => {
            return acc + (+val2.price)
        }, 0)
        return addOn
    }

    const createOrders = async (e) => {
        e.preventDefault()
        setBtnLoader(true)

        if (!stripe || !elements) {
            setBtnLoader(false)
            // Stripe.js has not loaded yet. Make sure to disable
            // form submission until Stripe.js has loaded.
            return;
        }

        // const  {error, paymentMethod} = await stripe.createPaymentMethod({
        //     type: "card",
        //     card: elements.getElement(CardElement)
        // });

        // if (error) {
        //     setBtnLoader(false)
        //     setErrorMessage(error.message)
        // }

        let formData = { orderData, storeId, pickUp: radioBtn, totalPrice: totalAmount };
        const cardElement = elements.getElement(CardElement)

        stripe.createToken(cardElement).then((result) => {
            if (result.token) {
                console.log(result.token)
                axios.post('/order', { ...formData, token: result.token }, { headers: { "Authorization": `Bearer ${token}` } })
                    .then((res) => {
                        setBtnLoader(false);
                        setErrorMessage('');
                        orderPostSuccessfully(addToast)
                        localStorage.removeItem('cart')
                        window.location.href = '/orders';
                    })
            } else if (result.error) {
                setErrorMessage(result.error.message);
                setBtnLoader(false);
            }
        });

        // const res = await axios.post('/payment/secret', { orderData }, { headers: { "Authorization": `Bearer ${token}` } })

        // const cardPayment = await stripe.confirmCardPayment(res.data.client_secret, {
        //     payment_method: {
        //         card: elements.getElement(CardElement),
        //     }
        // })

        // if (cardPayment.error) {
        //     setBtnLoader(false)
        //     setErrorMessage(cardPayment.error.message)
        // } else {
        //     axios.post('/order', formData, { headers: { "Authorization": `Bearer ${token}` } })
        //         .then((res) => {
        //             setBtnLoader(false);
        //             setErrorMessage('');
        //             orderPostSuccessfully(addToast)
        //             // localStorage.removeItem('cart')
        //             // window.location.href = '/';
        //         })
        // }
    }

    let [radioBtn, setRadioBtn] = useState(null)

    const radioHandler = (e) => {
        const radio = e.target.value === 'true' ? true : false
        console.log('handle', radio)
        setRadioBtn(radio)

    }

    return (
        <>
            <ApiError show={isApiError} error={isMsgError} />
            <div className="d-flex justify-content-around flex-wrap">
                <div style={{ width: "45%" }} className={' container main-section mb-5 shadow border-0 bg-white h-100 mr-3'}>
                    <h2 style={{ fontWeight: 700 }} className={'mt-3 text-center'}>DELIVERY DETAILS</h2>
                    <hr />
                    <h3 style={{ fontWeight: 600 }}>Personal Details</h3>
                    <div className=" p-details shadow border-0 bg-white mb-5 pl-2 pt-2 pb-2 w-75">
                        <h5> {userName} </h5>
                        <hr />
                        <p>{userEmail}</p>
                        <hr />
                        <p>{userPhone}</p>

                    </div>

                    <Form onSubmit={createOrders}>
                        <CardElement
                            options={{
                                hidePostalCode: true,
                                style: {
                                    base: {
                                        fontSize: '20px',
                                        color: '#424770',
                                        '::placeholder': {
                                            color: '#aab7c4',
                                        },
                                    },
                                    invalid: {
                                        color: '#9e2146',
                                    },
                                },
                            }}
                            onReady={() => {
                                console.log("CardElement [ready]");
                            }}
                            onChange={event => {
                                console.log("CardElement [change]", event);
                            }}
                            onBlur={() => {
                                console.log("CardElement [blur]");
                            }}
                            onFocus={() => {
                                console.log("CardElement [focus]");
                            }}
                        />

                        <div className={'d-flex justify-content-around mt-4'}>
                            <div className="form-check">
                                <input style={{ fontSize: '20px' }} required onChange={(e) => radioHandler(e)} value={true} checked={radioBtn === true} className="form-check-input mt-2" type="radio" name="flexRadioDefault" id="flexRadioDefault1" />
                                <label style={{ fontSize: '20px', color: "#424770" }} className="form-check-label" for="flexRadioDefault1">
                                    PickUp
                                </label>
                            </div>
                            <div className="form-check">
                                <input style={{ fontSize: '20px' }} required onChange={(e) => radioHandler(e)} value={false} checked={radioBtn === false} className="form-check-input mt-2" type="radio" name="flexRadioDefault" id="flexRadioDefault2" />
                                <label style={{ fontSize: '20px', color: "#424770" }} className="form-check-label" for="flexRadioDefault2">
                                    Delivery
                                </label>
                            </div>
                        </div>

                        <div>
                            {
                                errorMessage ? <div className="alert alert-danger mt-4">
                                    {errorMessage}
                                </div> : null
                            }
                            <div className={'card-details'}>
                                <div className="container">
                                    {
                                        !btnLoader ?
                                            cart && cart.length > 0 ? <button type={'submit'} disabled={!stripe} className=" place-order btn-send btn-block mb-5">PLACE ORDER</button> : null

                                            : <Loader style={'text-center'} />
                                    }
                                </div>
                            </div>
                            <hr />
                        </div>
                    </Form>
                </div>

                <div style={{ width: "45%" }} className={'container main-section mb-5 shadow border-0 bg-white h-100 mr-3 '}>
                    <h3 className={' cart-sec mt-3 text-center'}>IN YOUR CART</h3>
                    <hr />
                    <div className="mt-4" >
                        {
                            cart.length > 0 ?
                                cart.map((val) => {
                                    return (
                                        <>
                                            <div key={val._id} className="cart-details d-flex justify-content-between">
                                                <div className="cart-name">
                                                    <p className={'m-0 p-0'} style={{ fontWeight: 'bold', color: '#FF4200' }}> {val.productName} </p>
                                                    {
                                                        val.addOn.map((addOn) => (
                                                            <p className={'text-muted m-0 p-0'}>+{addOn.name} - ${addOn.price}</p>

                                                        ))
                                                    }
                                                </div>
                                                <div>
                                                    ${val.productPrice}
                                                </div>
                                                <div className="inc-dec">

                                                    {
                                                        val.Quantity > 1 ?
                                                            <span className="minus">
                                                                <FaMinus
                                                                    onClick={
                                                                        () =>
                                                                            dispatch({
                                                                                type: 'DRC',
                                                                                id: val._id,
                                                                                val
                                                                            })
                                                                    }
                                                                />
                                                            </span> :
                                                            <span className="minus">
                                                                <FaMinus />
                                                            </span>
                                                    }

                                                    <span className="quantity">
                                                        {val.Quantity}
                                                    </span>
                                                    <span className="plus">
                                                        <FaPlus
                                                            onClick={
                                                                () =>
                                                                    dispatch({
                                                                        type: 'INC',
                                                                        id: val._id,
                                                                        val
                                                                    })
                                                            }
                                                        />
                                                    </span>

                                                </div>

                                                {
                                                    val.addOn.length > 0 ?
                                                        <span>
                                                            ${val.Quantity * val.productPrice + addAddonPrice(val)}
                                                        </span>
                                                        : <span>  ${val.Quantity * val.productPrice}  </span>
                                                }

                                                <div className="delete">
                                                    <FaTrash
                                                        onClick={
                                                            () =>
                                                                dispatch({
                                                                    type: 'TRASH',
                                                                    id: val._id,
                                                                    val
                                                                })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <hr />
                                        </>
                                    )
                                }) : <div className={'text-center'}>
                                    Cart is empty
                                </div>
                        }
                    </div>
                    <div className={'summary'}>
                        <hr />
                        <h4>ORDER SUMMARY</h4>
                        <div className={'order-sum'}>
                            <h5>TOTAL</h5>
                            <h4>$ {totalAmount}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
const mapStateToProps = state => {
    return {
        isAuth: state.auth.isAuth,
        loading: state.auth.loading
    }
}
const mapDispatchToProps = dispatch => ({
    onAuth: (email, password, isSignUp, phoneNumber) => dispatch(action.auth(email, password, isSignUp, phoneNumber)),
    removeFromCart: (serviceId, servicePrice) => dispatch(actions.removeFromCart(serviceId, servicePrice))
})
export default connect(mapStateToProps, mapDispatchToProps)(AddToCart)

