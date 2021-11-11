import React, { useState, useEffect } from "react";
import { Button, Form, Container, Row, Col } from "react-bootstrap";
import { useForm } from "react-hook-form";
import inputValidation from "../customer/Pages/Register/inputValidation";
import Loader from "../../lib/customer/Loader/Loader";
import axios from "axios";
import Paper from '@material-ui/core/Paper';

const ResetPassword = props => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);



	const { register, handleSubmit, formState: { errors }, control } = useForm();

	const token = props.match.params.id;

	const onSubmit = (data) => {
		setLoading(true);
		console.log(data);
		if (data.newPassword !== data.confirmPassword) {
			setError('Password do not match')
			setLoading(false)

		} else {
			axios.put(`reset-password/${token}`, { password: data.newPassword })
				.then((res) => {
					window.location.href = '/'
				}).catch((err) => {
					setLoading(false)
					if (err.response.data.message === 'jwt expired') {
						setError('Session Expired')
					}
				})
		}



	}



	useEffect(() => {
		axios.get(`/authenticate/${token}`)
			.then((res) => {
				if (!res.data.authenticate) {
					window.location.href = '/'
				}
			})
	}, [])

	let formButton = (
		<>
			<div className="text-center">
				<button type={'submit'} className={'btn-send w-75'} >Reset Password</button>
			</div>
		</>
	)

	if (loading) {
		formButton = <Loader />
	}
	let errorMessage = null;

	if (error) {
		errorMessage = <p className={'text-danger font-weight-bold '}>{error}</p>
	}

	console.log("errors", errors)

	return (
		<>
			<div className={' h-100 justify-content-center align-items-center'}>
				<Container className={'h-100 text-center'}>
					<Row style={{ height: "100vh" }} className={' align-items-center justify-content-center'}>
						<Col md={8}>

							<Form onSubmit={handleSubmit(onSubmit)}>
								<small className="text-center" style={{ fontSize: "16px" }}>
									{errorMessage}
								</small>
								<Paper elevation={3} >

									<Row className={' justify-content-center text-center p-4'}>

										<Col md={8}>
											<div >
												<Form.Control type={'password'}
													placeholder={'New Password'}
													{...register('newPassword', inputValidation.newPassword)} className={'recovery__email py-4'} />
											</div>
											<small className="text-danger" style={{ fontSize: "10px" }}>
												{errors.newPassword && errors.newPassword.message}
											</small>
										</Col>

										<Col md={8}>
											<div >
												<Form.Control
													type={'password'}
													placeholder={'Confirm Password'}
													{...register('confirmPassword', inputValidation.confirmNewPassword)}
													className={'recovery__email py-4'}
												/>
											</div>
											<small className="text-danger" style={{ fontSize: "10px" }}>
												{errors.confirmPassword && errors.confirmPassword.message}
											</small>
										</Col>

										<Col md={8}>
											{formButton}

										</Col>
									</Row>
								</Paper>
							</Form>
						</Col>
					</Row>
				</Container>
			</div>
		</>

	)
}

export default ResetPassword