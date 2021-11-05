import React, { useState } from 'react';
import './Login.css';
import { useForm } from "react-hook-form";
import axios from "axios";
import "../../../../assets/style.css";
import User from "../../../../assets/customer/img/user.png"
import Lock from "../../../../assets/customer/img/lock.png";
import Loader from "../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../lib/ApiError/ApiError"
import inputValidation from "../../../customer/Pages/Login/inputValidation";

const Login = () => {

    const [submitLoader, setSubmitLoader] = useState(false);
    const [errMsg, setErrMsg] = useState('')
    const [isApiError, setIsApiError] = useState(false)

    const { register, handleSubmit, formState: { errors } } = useForm();

    const onFormSubmit = (data) => {

        setSubmitLoader(true)
        const { email, password } = data;

        axios.post("/login", {
            email,
            password,
            role: "ADMIN"
        }
        ).then((res) => {
            localStorage.setItem('adminToken', res.data.token)
            window.location.href = "/admin/dashboard"
            setSubmitLoader(false)

        }).catch((err) => {
            console.log(err.response)
            if (err.message === "Request failed with status code 500") {
                setErrMsg('Admin Not Found')
            }
            else {
                setIsApiError(true)
            }
            setSubmitLoader(false)
        })

    }

    let formButton;

    if (submitLoader) {
        formButton = (
            <div className={'col-md-10 my-4'}>
                <Loader style={'text-center mt-5'} />
            </div>
        )
    }
    else {
        formButton = (
            <>
                <div className="col-md-10 my-4">
                    <button type="submit" className="btn btn-send btn-block">LOGIN</button>
                </div>
            </>
        )
    }


    return (
        <>
            <ApiError show={isApiError} />
            <section className=" py-5 sign-up-section sign-in">
                <div className="container">
                    <div className="row">
                        <div className="col-8 sign-card">
                            <div className="card sign-up-card rounded shadow border-0 bg-white">
                                <div className="card-body text-center">
                                    <h2 style={{ fontWeight: "bold" }}
                                    >ADMIN
                                    </h2>
                                    <div style={{color: "red", fontWeight: "bold"}}>
                                    {
                                        errMsg
                                    }
                                    </div>
                                    <form onSubmit={handleSubmit(onFormSubmit)} className="mt-5">
                                        <div className="container form-row justify-content-center">
                                            <div className="col-md-12 mb-4">
                                                <label>Email</label>
                                                <img src={User} className="img-form" alt={'user'} />
                                                <input type="text"
                                                    {...register('email', inputValidation.email)}
                                                    className="form-control"
                                                    placeholder="Enter Your Email Address" />
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
                                                    placeholder="Enter Your Password" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.password && errors.password.messages}
                                            </small>
                                            {
                                                formButton
                                            }
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};


export default Login;