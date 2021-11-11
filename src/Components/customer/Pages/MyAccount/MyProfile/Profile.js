import React, { useState, useEffect } from "react";
import "../../../../../assets/style.css";
import { useForm } from "react-hook-form";
import axios from "axios";
import Env from "../../../../../assets/customer/img/env.png";
import { PasswordChangeSuccessfully } from "../../../../../lib/customer/Toaster/Toaster"
import Loader from "../../../../../lib/customer/Loader/Loader";
import { useToasts } from "react-toast-notifications";
import User from "../../../../../assets/customer/img/user.png"
import Phone from "../../../../../assets/customer/img/phone.png";
import Lock from "../../../../../assets/customer/img/lock.png";
import ApiError from "../../../../../lib/ApiError/ApiError"
import inputValidation from "../../Login/inputValidation";

const Profile = (props) => {

    const [user, setUser] = useState({})
    const [isApiError, setIsApiError] = useState(false)
    const [isMsgError, setIsMsgError] = useState(null)
    const [errorMsg, setErrorMsg] = useState(null)
    const [getPassword, setGetPassword] = useState(null)
    const [loading, setLoading] = useState(false);

    const { addToast } = useToasts()

    const { register, handleSubmit, formState: { errors } } = useForm();

    const token = localStorage.getItem('token');


    useEffect(() => {

        axios.get('/current-user', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("CUSTOMER PROFILE GET", err.response.data.message)
            })
    }, [])

    const handleFormSubmit = (data) => {
        setLoading(true);


        if (data.CurrentPassword !== data.NewPassword) {

            if (data.NewPassword === data.ConfirmPassword) {

                const updatedPassword = {
                    currentPassword: data.CurrentPassword,
                    newPassword: data.NewPassword
                }

                axios.put('/change-password/', updatedPassword, { headers: { "Authorization": `Bearer ${token}` } })
                    .then((res) => {
                        if(res.data.updated){
                            PasswordChangeSuccessfully(addToast)
                            window.location.reload();
                        }
                        
                    }).catch((err) => {
                        setLoading(false)
                        setErrorMsg(err.response.data.message)
                        if (err.response.data.message === 'jwt expired') {
                            setErrorMsg("session expired")
                        }
                    })

            }
            else {
                setErrorMsg("Password do not match")
                setLoading(false)
            }
        }
        else {
            setErrorMsg("current and new password cannot be same")
            setLoading(false)
        }

    }


    let formButton = <button type="submit" className={'btn-send w-50'} >Submit</button>

    if (loading) {
        formButton = <Loader />
    }

    return (
        <>
            <ApiError show={isApiError} error={isMsgError} />
            <section className=" sign-up-section sign-in">
                <div className="container">
                    <div className="row">
                        <div className="col-8 sign-card">
                            <div>
                                <div className="card-body text-center ">
                                    <h5 style={{ fontWeight: "bold" }}>MY PROFILE</h5>
                                    <hr className={'mb-5'} />
                                    <form className="mt-3" onSubmit={handleSubmit(handleFormSubmit)}>
                                        <div className="form-row justify-content-center">
                                            <div className="col-md-8 mb-4">
                                                <img src={User} className="img-form" alt={'user'} />
                                                <input type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={user.name}
                                                    placeholder="Type your Name" />
                                            </div>
                                            <div className="col-md-8 mb-4">
                                                <img src={Env} className="img-form" alt={'env'} />
                                                <input type="text"
                                                    className="form-control"
                                                    disabled
                                                    value={user.email}
                                                    placeholder="Type your Email" />
                                            </div>
                                            <div className="col-md-8 mb-2">
                                                <img src={Phone} className="img-form" alt={'lock'} />
                                                <input type="number"
                                                    className="form-control"
                                                    disabled
                                                    value={user.phoneNumber}
                                                    placeholder="Type Your Mobile Number" />
                                            </div>

                                            <div className="col-md-8 mb-3">
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('CurrentPassword', inputValidation.password)}
                                                    placeholder="Type Current Password" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.password && errors.password.messages}
                                            </small>

                                            <div className="col-md-8 mb-3">
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('NewPassword', inputValidation.password)}
                                                    placeholder="Type New Password" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.password && errors.password.messages}
                                            </small>

                                            <div className="col-md-8 mb-3">
                                                <img src={Lock} className="img-form" alt={'lock'} />
                                                <input type="password"
                                                    className="form-control"
                                                    {...register('ConfirmPassword', inputValidation.password)}
                                                    placeholder="ReType New Password" />
                                            </div>
                                            <small className="text-danger">
                                                {errors.password && errors.password.messages}
                                            </small>
                                            <div className="col-md-8 mb-3 text-danger">
                                                {
                                                    errorMsg
                                                }

                                            </div>

                                            <div className="col-md-8 mb-3">

                                                {formButton}
                                            </div>
                                        </div>
                                    </form>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Profile;