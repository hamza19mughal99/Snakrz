import React, { useState } from 'react';
// import '../Components/customer/Pages/Login/Login.css';
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { RecoveryPassword, forgetPassword } from "../../lib/customer/Toaster/Toaster";
import Loader from "../../lib/customer/Loader/Loader";
import axios from "axios";
import inputValidation from "../customer/Pages/Register/inputValidation";
import Paper from '@material-ui/core/Paper';
import { useToasts } from "react-toast-notifications";

const ForgetPassword = props => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const { addToast } = useToasts()
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onFormSubmit = (data) => {
        setLoading(true)
        const { email } = data;
        console.log(email)

        axios.post('/reset-link', { email })
            .then((res) => {
                setLoading(false)
                setError('');
                RecoveryPassword(addToast);
                console.log(res.data);
            }).catch((err) => {
                setLoading(false)
                forgetPassword(addToast, err.response.data.message)
                setError(err.response.data.message)
            })
    }


    let forgetButton = (
        <>
            <button type="submit" className={'btn-send'}>Recover your Password</button>
        </>
    )
    if (loading) {
        forgetButton = <Loader />
    }

    return (
        <div className={' h-100 justify-content-center align-items-center'}>
            <Container className={'h-100 text-center'}>
                <Row style={{ height: "100vh" }} className={' align-items-center justify-content-center'}>
                    <Col md={8}>
                        <Form onSubmit={handleSubmit(onFormSubmit)}>
                            <Paper elevation={3}>
                                <Row className={' justify-content-center text-center p-4'}>
                                    <Col md={8}>
                                        <div>
                                            <Form.Control type={'text'} placeholder={'Enter your email for recovery '} className={'recovery__email py-4'} {...register('email', inputValidation.email)} />
                                        </div>
                                    </Col>

                                    <Col md={8}>
                                        <div className={' text-center mt-3 '}>
                                            {forgetButton}
                                        </div>
                                    </Col>
                                </Row>
                            </Paper>
                        </Form>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};



export default ForgetPassword;