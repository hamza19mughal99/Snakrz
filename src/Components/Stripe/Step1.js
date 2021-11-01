import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import "./Stripe.css";
import axios from "axios";
import ReactRoundedImage from "react-rounded-image";
import Loader from "../../lib/customer/Loader/Loader";
import Logo from "../../assets/customer/img/dashboard-logo.png";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const Step1 = (props) => {

    const [formStep, setFormStep] = useState(0);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        mode: 'onChange'
    });

    const stripe = useStripe();



    const handleFormSubmit2 = (data) => {
        console.log(data)
        props.onNext(data)
        setTimeout(() => {
            console.log(props.data)
        }, 2000)
    }

    const nextStepHandler = () => {
        setFormStep(1)
    }

    const handleFormSubmit = (data) => {

        props.onNext(data)
        nextStepHandler()

    }

    return (
        <>
            




            <pre>{
                JSON.stringify(watch(), null, 2)
            }</pre>


        </>
    )
}

const mapStateToProps = state => {
    return {
        data: state.service.data
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onNext: (data) => dispatch(action.storeFormValue(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)Step1;





