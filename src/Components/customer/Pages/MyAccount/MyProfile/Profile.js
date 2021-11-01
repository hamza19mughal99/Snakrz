import React, { useState, useEffect } from "react";
import "../../../../../assets/style.css";
import axios from "axios";
import Env from "../../../../../assets/customer/img/env.png";
import User from "../../../../../assets/customer/img/user.png"
import Phone from "../../../../../assets/customer/img/phone.png";
import ApiError from "../../../../../lib/ApiError/ApiError"

const Profile = () => {

    const [user, setUser] = useState({})
    const [isApiError, setIsApiError] = useState(false)
    const [isMsgError, setIsMsgError] = useState(null)

    const token = localStorage.getItem('token');

    useEffect(() => {

        axios.get('/current-user', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setUser(res.data)
            })
            .catch((err) => {
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("CUSTOMER PROFILE GET", err)
            })
    }, [])

    return (
        <>
            <ApiError show={isApiError} error={isMsgError}/>
            <section className=" sign-up-section sign-in">
                <div className="container">
                    <div className="row">
                        <div className="col-8 sign-card">
                            <div>
                                <div className="card-body text-center ">
                                    <h5 style={{ fontWeight: "bold" }}>MY PROFILE</h5>
                                    <hr className={'mb-5'} />
                                    <form className="mt-3">
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