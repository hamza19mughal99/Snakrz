import React from 'react';
import './Login.css';
import { useForm } from "react-hook-form";
import { connect } from "react-redux";
import { Form } from "react-bootstrap";
import { NavLink } from "react-router-dom"
import "../../../../assets/style.css";
import Lock from "../../../../assets/customer/img/lock.png";
import User from "../../../../assets/customer/img/user.png"
import * as action from "../../../../Store/vendor/actions";
import Loader from "../../../../lib/customer/Loader/Loader";
import inputValidation from "../../../customer/Pages/Login/inputValidation";

const Login = props => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onFormSubmit = (data) => {
        const { email, password } = data;
        props.onAuth(email, password, false);
    }

    let formButton = (
        <>
            <div className="col-md-10 my-4">
                <button type={'submit'} className="btn btn-send btn-block">LOGIN</button>
            </div>
        </>
    )

    if (props.loading) {
        formButton = (
            <>
                <div className={'col-md-10 mt-4'}>
                    <Loader style={'text-center mt-5'} />
                </div>
            </>
        )
    }

    let errorMessage = null;

    console.log(props.error)

    if (props.error) {
        errorMessage = <p className={'text-danger font-weight-bold '}>{props.error}</p>
    }

    return (
        <section className=" py-5 sign-up-section sign-in">
            <div className="container">
                <div className="row">
                    <div className="col-8 sign-card">
                        <div className="card sign-up-card rounded shadow border-0 bg-white">
                            <div className="card-body text-center">
                                <h2 style={{
                                    fontWeight: "bold",
                                    fontSize: "23px"
                                }}
                                >LOGIN</h2>
                                <small className="text-center mt-4">
                                    {errorMessage}
                                </small>
                                <Form onSubmit={handleSubmit(onFormSubmit)} className="mt-5">
                                    <div className=" form-row justify-content-center">
                                        <div className="col-md-12 mb-4">
                                            <label>Email</label>
                                            <img src={User} className="img-form" alt={'user1'} />
                                            <input
                                                type="text"
                                                {...register('email', inputValidation.email)}
                                                className="form-control"
                                                placeholder="affaq@designhenge.co" />
                                        </div>
                                        <small className="text-danger">
                                            {errors.email && errors.email.message}
                                        </small>
                                        <div className="col-md-12 mb-4">
                                            <label>Password</label>
                                            <img src={Lock} className="img-form" alt={'user2'} />
                                            <input
                                                type="password"
                                                {...register('password', inputValidation.password)}
                                                className="form-control"
                                                placeholder="min 8 characters" />
                                        </div>
                                        <small className="text-danger">
                                            {errors.password && errors.password.message}
                                        </small>
                                        {formButton}
                                    </div>
                                </Form>
                                <NavLink to="/forgetPassword"> <p style={{ fontWeight: "bold" }}> Forget Password ? </p> </NavLink>
                                <div className={'customer__login__bottom-02 text-center p-4'}>
                                    <p>Don't have account?</p>
                                    <NavLink to="/vendor/register"><button className="btn btn-send btn-block">REGISTER NOW</button> </NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section >
    );
};
const mapStateToProps = state => {
    return {
        loading: state.vendorAuth.loading,
        error: state.vendorAuth.error
    }
}
const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignUp) => dispatch(action.vendorAuth(email, password, isSignUp))
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(Login);
