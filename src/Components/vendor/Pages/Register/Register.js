import React from 'react';
import "../../../../assets/style.css";
import { useForm } from "react-hook-form"
import inputValidation from "./inputValidation";
import { connect } from "react-redux";
import { NavLink } from "react-router-dom";
import * as action from "../../../../Store/vendor/actions"
import Env from "../../../../assets/customer/img/env.png";
import Lock from "../../../../assets/customer/img/lock.png";
import Phone from "../../../../assets/customer/img/phone.png";
import Loader from "../../../../lib/customer/Loader/Loader";

const Register = (props) => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    let formButton = (
        <>
            <div className="col-md-10 my-4">
                <button className={'btn btn-send btn-block'} type={'submit'}>REGISTER</button>
            </div>
        </>
    )

    let errorMessage = null;

    if (props.loading) {
        formButton = (
            <>
                <div className="col-md-10 my-4">
                    <Loader style={'text-center'} />
                </div>
            </>
        )
    }
    console.log(props.error)

    if (props.error) {
        errorMessage = <p className={'text-danger font-weight-bold '}>{props.error}</p>
    }

    const onSubmit = (data) => {
        const { email, password, phoneNumber } = data;
        props.onAuth(email, password, true, phoneNumber);
    }

    return (
        <>
            <section className=" py-5 sign-up-section sign-in">
                <div className="container">
                    <div className="row">
                        <div className="col-8 sign-card">
                            <div className="card sign-up-card rounded shadow border-0 bg-white">
                                <div className="card-body text-center">
                                    <h2 style={{
                                        fontWeight: "bold",
                                        fontSize: "20px"
                                    }}
                                    >BECOME A PARTNER</h2>
                                    <small className="text-center mt-3">
                                        {errorMessage}
                                    </small>
                                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5">
                                        <div className=" container form-row justify-content-center">
                                            <div className="col-md-12 mb-4">
                                                <label>Email</label>
                                                <img src={Env} className="img-form" alt={'USER3'} />
                                                <input type="text"
                                                    className={"form-control"}
                                                    {...register('email', inputValidation.email)}
                                                    placeholder="Enter your Email Address" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.email && errors.email.message}
                                            </small>
                                            <div className="col-md-12 mb-4">
                                                <label>Phone Number</label>
                                                <img src={Phone} className="img-form" alt={'USER2'} />
                                                <input type="number"
                                                    className="form-control"
                                                    {...register('phoneNumber', inputValidation.phoneNumber)}
                                                    placeholder="Enter Your Phone Number " />
                                            </div>
                                            <small className="text-danger">
                                                {errors.phoneNumber && errors.phoneNumber.message}
                                            </small>
                                            <div className="col-md-12 mb-4">
                                                <label>Password</label>
                                                <img src={Lock} className="img-form" alt={'USER4'} />
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
                                        <p>Already Have an Account ?</p>
                                        <NavLink to="/vendor/login"><button className="btn btn-send btn-block">LOGIN</button> </NavLink>
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
        loading: state.vendorAuth.loading,
        error: state.vendorAuth.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp, phoneNumber) => dispatch(action.vendorAuth(email, password, isSignUp, phoneNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Register);

