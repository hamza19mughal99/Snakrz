import React from 'react';
import './Login.css';
import { connect } from "react-redux";
import { useForm } from "react-hook-form"
import { NavLink } from "react-router-dom"
import * as action from '../../../../Store/customer/actions/index';
import "../../../../assets/style.css";
import User from "../../../../assets/customer/img/user.png"
import Lock from "../../../../assets/customer/img/lock.png";
import Loader from "../../../../lib/customer/Loader/Loader";
import inputValidation from "./inputValidation";


const Login = props => {

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onFormSubmit = (data) => {
        const { email, password } = data;
        props.onAuth(email, password, false);
    }

    let formButton = (
        <div className="col-md-10 my-4">
            <button type="submit" className="btn btn-send btn-block">LOGIN</button>
        </div>
    )

    if (props.loading) {
        formButton = (
            <div className="col-md-10 my-4">
                <Loader style={'text-center'} />
            </div>
        )
    }

    let errorMessage = null;
    if (props.error) {
        console.log(props.error)
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
                                {errorMessage}
                                <form onSubmit={handleSubmit(onFormSubmit)} className="mt-5">
                                    <div className=" form-row justify-content-center">
                                        <div className="col-md-12 mb-4">
                                            <label>Email</label>
                                            <img src={User} className="img-form" alt={'user'} />
                                            <input type="text"
                                                {...register('email', inputValidation.email)}
                                                className="form-control"
                                                placeholder="affaq@designhenge.co" />
                                        </div>
                                        <small className="text-danger">
                                            {errors.email && errors.email.message}
                                        </small>
                                        <div className="col-md-12 mb-4">
                                            <label>Password</label>
                                            <img src={Lock} className="img-form" alt={'lock'} />
                                            <input type="password"
                                                {...register('password', inputValidation.password)}
                                                className="form-control"
                                                placeholder="min 8 characters" />
                                        </div>

                                        <small className="text-danger">
                                            {errors.password && errors.password.message}
                                        </small>
                                        {formButton}
                                    </div>
                                </form>
                                <NavLink to="/forgetPassword"> <p style={{fontWeight: "bold"}}> Forget Password ? </p> </NavLink>
                                <div className={'customer__login__bottom-02 text-center p-4'}>
                                    <p>New to Snakrs?</p>
                                    <NavLink to={'/register'}><button className={'btn btn-send btn-block'}>REGISTER NOW</button></NavLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (name, email, password, isSignUp, phoneNumber) => dispatch(action.auth(name, email, password, isSignUp, phoneNumber))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);