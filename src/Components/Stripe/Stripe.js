import React, { useState } from "react";
import { Form, Row, Col } from "react-bootstrap";
import "./Stripe.css";
import axios from "axios";
import ReactRoundedImage from "react-rounded-image";
import Loader from "../../lib/customer/Loader/Loader";
import Logo from "../../assets/customer/img/dashboard-logo.png";
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const Stripe = () => {

    const options = [
        'US'
    ];
    const currency = [
        'usd'
    ]

    const state = [
        'NY'
    ]


    const token = localStorage.getItem("vendorToken")

    const [loaded, setLoaded] = useState(false);

    const [form1, setForm1] = useState({
        account_holder_name: '',
        account_number: '000999999991',
        routing_number: "110000000",
        country: options[0],
        currency: currency[0],
        companyName: '',
        companyPhone: '2025550162',
        companyStreet: 'New York',
        companyCity: 'New York',
        companyState: state[0],
        companyPostalCode: '10001',
        first_name: '',
        last_name: '',
        personPhone: "2025550162",
        ssn: "0000",
        personStreet: "New York",
        personState: state[0],
        personCity: "New York",
        personPostalCode: "10001",
        representative: true,
        owner: true

    })

    const [formStep, setFormStep] = useState(0);

    const handleFormSubmit = e => {

        e.preventDefault()
        const formData = {
            ...form1
        };
        setLoaded(true)

        console.log(formData)

        axios.post('/vendor/create-account', formData, { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setLoaded(false)
                window.location.href = "/vendor/dashboard"
            })
            .catch((res) => {
                setLoaded(false)
                alert('Something went wrong')
            })
    }



    const form1ChangeHandler = (e) => {
        const { name, value } = e.target
        const updated = { ...form1 }
        updated[name] = value
        setForm1(updated)
    }

    const selectChangeHandler = (data, name) => {
        console.log(form1)
        const updated = { ...form1 }
        updated[name] = data.value
        setForm1(updated)
    }

    const nextStepHandler = (e) => {
        e.preventDefault()
        setFormStep(1)
    }

    return (
        <>
            <Row>
                <Col md={6} style={{
                    backgroundColor: "#ff4200",
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                    <Row className={"justify-content-center align-items-center"}>
                        <Col md={12}>
                            <ReactRoundedImage image={Logo}
                                roundedColor="#fff"
                                imageWidth="130"
                                imageHeight="130" />
                        </Col>
                    </Row>
                </Col>

                <Col md={6}
                    style={{ backgroundColor: "#F5F5F5" }}>
                    <Row className={'justify-content-center mt-3'}>
                        <Col md={10}>
                            {
                                formStep === 0 && (
                                    <Form onSubmit={nextStepHandler}>

                                        <div>
                                            <div
                                                style={{
                                                    backgroundColor: "#fff",
                                                    padding: "30px 50px",
                                                    marginBottom: "15px"
                                                }}>
                                                <h5 style={{
                                                    fontWeight: "bold",
                                                    marginBottom: "13px"
                                                }}> ACCOUNT DETAILS </h5>
                                                <div className={'row'}>
                                                    <div className={'col-md-6'}>
                                                        <Form.Control type="text"
                                                            className="form-control mb-3"
                                                            name={'account_holder_name'}
                                                            value={form1.account_holder_name}
                                                            required
                                                            onChange={form1ChangeHandler}
                                                            placeholder=" Account Name " />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'account_number'}
                                                            value={form1.account_number}
                                                            required
                                                            disabled
                                                            onChange={form1ChangeHandler}

                                                            placeholder=" Account Number " />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'routing_number'}
                                                            value={form1.routing_number}
                                                            required
                                                            disabled
                                                            onChange={form1ChangeHandler}

                                                            placeholder=" Routing Number " />
                                                    </div>
                                                    {/* <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'country'}
                                                            value={form1.country}
                                                            required
                                                            onChange={form1ChangeHandler}

                                                            placeholder=" Country Name " />
                                                    </div> */}
                                                    <div className={'col-md-6'}>
                                                        <Dropdown options={options}
                                                            name={'country'}
                                                            value={form1.country}
                                                            onChange={(data) => selectChangeHandler(data, 'country')}

                                                            placeholder="Country" />
                                                    </div>

                                                    <div className={'col-md-6'}>
                                                        {/* <input type="text"
                                                            className="form-control mb-3"
                                                            name={'currency'}
                                                            value={form1.currency}
                                                            required
                                                            onChange={form1ChangeHandler}
                                                            placeholder=" Currency " /> */}
                                                        <Dropdown options={currency}
                                                            name={'currency'}
                                                            value={form1.currency}
                                                            onChange={(data) => selectChangeHandler(data, 'currency')}

                                                            placeholder="Currency" />
                                                    </div>

                                                </div>
                                            </div>

                                            <div
                                                style={{
                                                    backgroundColor: "#fff",
                                                    padding: "30px 50px",
                                                    marginBottom: "15px"

                                                }}>
                                                <h5 style={{
                                                    fontWeight: "bold",
                                                    marginBottom: "13px"
                                                }}>
                                                    COMPANY DETAILS
                                                </h5>
                                                <div className={'row'}>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'companyName'}
                                                            value={form1.companyName}
                                                            required
                                                            onChange={form1ChangeHandler}
                                                            placeholder="Company Name" />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'companyPhone'}
                                                            value={form1.companyPhone}
                                                            disabled
                                                            required
                                                            onChange={form1ChangeHandler}
                                                            placeholder="Phone Number" />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'companyStreet'}
                                                            value={form1.companyStreet}
                                                            required
                                                            disabled
                                                            onChange={form1ChangeHandler}

                                                            placeholder="Enter Address" />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'companyCity'}
                                                            value={form1.companyCity}
                                                            required
                                                            disabled
                                                            onChange={form1ChangeHandler}

                                                            placeholder="Enter City" />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        {/* <input type="text"
                                                            className="form-control mb-3"
                                                            name={'companyState'}
                                                            value={form1.companyState}
                                                            required
                                                            onChange={form1ChangeHandler}
                                                            placeholder="Enter State" /> */}
                                                        <Dropdown options={state}
                                                            name={'companyState'}
                                                            value={form1.companyState}
                                                            onChange={form1ChangeHandler}

                                                            placeholder="State" />
                                                    </div>
                                                    <div className={'col-md-6'}>
                                                        <input type="text"
                                                            className="form-control mb-3"
                                                            name={'companyPostalCode'}
                                                            value={form1.companyPostalCode}
                                                            required
                                                            disabled
                                                            onChange={form1ChangeHandler}
                                                            placeholder="Enter Postal Code" />
                                                    </div>


                                                </div>
                                            </div>
                                            <button type={'submit'} className="w-100 mt-3 btn btn-send btn-block mb-5"
                                            > NEXT </button>
                                        </div>
                                    </Form>
                                )
                            }

                            {
                                formStep === 1 && (
                                    <Form onSubmit={handleFormSubmit}>

                                        <div
                                            style={{
                                                backgroundColor: "#fff",
                                                padding: "30px 50px",

                                            }}>
                                            <h5 style={{
                                                fontWeight: "bold",
                                                marginBottom: "13px"
                                            }}>
                                                PERSONAL INFORMATION
                                            </h5>
                                            <div className={'row'}>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'first_name'}
                                                        value={form1.first_name}
                                                        required
                                                        onChange={form1ChangeHandler}

                                                        placeholder="First Name" />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'last_name'}
                                                        value={form1.last_name}
                                                        required
                                                        onChange={form1ChangeHandler}

                                                        placeholder="Last Name" />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'personPhone'}
                                                        value={form1.personPhone}
                                                        required
                                                        disabled
                                                        onChange={form1ChangeHandler}

                                                        placeholder="Phone Number" />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'ssn'}
                                                        value={form1.ssn}
                                                        required
                                                        disabled
                                                        onChange={form1ChangeHandler}
                                                        placeholder="Social Security No." />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'personStreet'}
                                                        value={form1.personStreet}
                                                        required
                                                        disabled
                                                        onChange={form1ChangeHandler}
                                                        placeholder="Street Address" />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    {/* <input type="text"
                                                        className="form-control mb-3"
                                                        name={'personState'}
                                                        value={form1.personState}
                                                        required
                                                        onChange={form1ChangeHandler}
                                                        placeholder="State" /> */}
                                                    <Dropdown options={state}
                                                        name={'personState'}
                                                        value={form1.personState}
                                                        onChange={form1ChangeHandler}

                                                        placeholder="State" />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'personCity'}
                                                        value={form1.personCity}
                                                        required
                                                        disabled
                                                        onChange={form1ChangeHandler}

                                                        placeholder="City" />
                                                </div>
                                                <div className={'col-md-6'}>
                                                    <input type="text"
                                                        className="form-control mb-3"
                                                        name={'personPostalCode'}
                                                        value={form1.personPostalCode}
                                                        required
                                                        disabled
                                                        onChange={form1ChangeHandler}

                                                        placeholder="Postal Code" />
                                                </div>
                                                <div className=" col-md-6 form-check">
                                                    <input className="form-check-input" type="radio"
                                                        name={'representative'}
                                                        required="required"
                                                        value={form1.representative} onChange={form1ChangeHandler} id="flexCheckDefault" />
                                                    <label className="form-check-label" for="flexCheckDefault">
                                                        Representative
                                                    </label>
                                                </div>
                                                <div className=" col-md-6 form-check">
                                                    <input className="form-check-input"
                                                        type="radio"
                                                        name={'owner'}
                                                        required="required"
                                                        value={form1.owner} onChange={form1ChangeHandler} id="flexCheckChecked" />
                                                    <label className="form-check-label" for="flexCheckChecked">
                                                        Owner
                                                    </label>
                                                </div>
                                            </div>
                                            {
                                                !loaded ? <button type={'submit'}
                                                    className={'w-100 mt-3 btn btn-send btn-block mb-5'} >
                                                    SUBMIT </button>
                                                    : <Loader style={'text-center'} />
                                            }

                                        </div>


                                    </Form>
                                )
                            }


                        </Col>
                    </Row>

                </Col>


            </Row>

        </>
    )
}









export default Stripe;





