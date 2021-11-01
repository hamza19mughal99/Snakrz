import React, {useMemo, useState} from 'react';
import {Card, Col, Form, Row} from "react-bootstrap";
import {Controller, useForm} from "react-hook-form";
import Select from "react-select";
import {FormGroup, Label} from "reactstrap";
import ProgressBar from "../../../../lib/customer/ProgressBar/ProgressBar";
import 'react-dropzone-uploader/dist/styles.css'
import axios from "axios";
import {useDropzone} from "react-dropzone";



const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '20px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out'
};

const activeStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

const ShopCreate = props => {
	const { register,getValues, handleSubmit, watch, formState: { errors }, control } = useForm();
	const [fileNames, setFileNames] = useState([]);

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject
	} = useDropzone({
		accept: 'image/*',
		onDrop: acceptedFiles => {
			setFileNames(acceptedFiles)
		}
	});

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	]);
	const [loader, setLoader] = useState(false);
	const token = localStorage.getItem('vendorToken');
	const [gallery, setGallery] = useState([])
	const imgs = [];
	const onSubmit = data => {
		setLoader(true);
		console.log(imgs)
		const formData = new FormData();

		formData.append('shopName', data.shopName);
		formData.append('shopType', data.shopType.value);
		formData.append('description', data.description);
		formData.append('address', data.address);
		formData.append('shopVisibility', data.shopVisibility);
		formData.append('schedule', JSON.stringify(data.schedule));
		formData.append('address', data.address);
		formData.append('shopImage', data.shopImage[0]);
		formData.append('shopBannerImage', data.shopBannerImage[0]);
		formData.append('gallery', JSON.stringify(gallery));
		axios.post('/vendor/shop', formData, {headers: {"Authorization": `Bearer ${token}`}})
			.then((res) => {
				console.log(res.data);
				// localStorage.setItem('isProfileSetup', res.data.profileSetup);
				setLoader(false)
				// window.location.href = '/vendor/dashboard/'
			})
	};





	const shopTypeOption = [
		{
			label: 'Aesthetic Doctor',
			value: 'Aesthetic Doctor'
		},
		{
			label: 'Barbers',
			value: 'Barbers'
		},
		{
			label: 'Beautician',
			value: 'Beautician'
		},
		{
			label: 'Smile Dentist',
			value: 'Smile Dentist'
		},
	]






	// receives array of files that are done uploading when submit button is clicked
	return (
		<div id="settings" className={'p-5'}>
			<h3 className={'text-center'}>Create Your Shop</h3>
			<Row className={'justify-content-center'}>
				<Col md={8}>
					<Form onSubmit={handleSubmit(onSubmit)}>
						<Card>
							<Card.Body>
								<Form.Group>
									<Form.Label> Shop Name </Form.Label>
									<Form.Control type={'text'} required {...register("shopName")} />
								</Form.Group>
								<Form.Group className={'py-3'}>
									<Form.Label> Shop Type </Form.Label>
									<Controller
										name="shopType"
										control={control}
										render={({ field: { value, onChange, ref} }) => (


											<Select
												className="basic-single"
												classNamePrefix="select"
												value={value}
												defaultOptions
												required
												onChange={onChange}
												name="color"
												options={shopTypeOption}
											/>

										)}
									/>
								</Form.Group>
								<Form.Group className={'py-3'}>
									<Form.Label> Shop Description </Form.Label>
									<Form.Control as="textarea" required placeholder="Leave Description Here"  {...register("description")}/>
								</Form.Group>

								<Form.Group className={'py-3'}>
									<Form.Label> Shop Address </Form.Label>
									<Form.Control type={'text'} required  {...register("address")} />
								</Form.Group>

								<FormGroup>
									{/*<Label for="name">Shop Visibility</Label>*/}
									{/*<Controller*/}
									{/*	name="shopVisibility"*/}
									{/*	control={control}*/}
									{/*	render={({ field: { value, onChange, ref} }) => (*/}
									{/*		<Switch*/}
									{/*			value={value}*/}
									{/*			required*/}
									{/*			onChange={onChange}*/}
									{/*			defaultValue={false}*/}
									{/*			name={'visible'}*/}
									{/*			color={'default'}*/}
									{/*		/>*/}
									{/*	)}*/}
									{/*/>*/}

								</FormGroup>
							</Card.Body>
						</Card>

						<Card className={'my-4'}>
							<Card.Body>
								<p className={'text-center'}>Opening Hour</p>
								<Form.Group className={'py-3'}>
									<Form.Label className={'d-block'}> Monday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.monday")} />

									<Form.Label className={'d-block'}> Tuesday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.tuesday")} />

									<Form.Label className={'d-block'}> Wednesday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.wednesday")} />

									<Form.Label className={'d-block'}> Thursday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.thursday")} />

									<Form.Label className={'d-block'}> Friday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.friday")} />

									<Form.Label className={'d-block'}> Saturday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.saturday")} />

									<Form.Label className={'d-block'}> Sunday </Form.Label>
									<Form.Control type={'text'} required placeholder={'9:00 AM - 5:00 PM OR 9:00 AM - 11:00 AM & 2:00 PM - 5:00 PM'}  {...register("schedule.sunday")} />
								</Form.Group>
							</Card.Body>
						</Card>

						<Card className={'my-4'}>
							<Card.Body>
								<p className={'text-center'}>Gallery</p>
								<Form.Group className={'py-3'}>
									<label htmlFor="exampleFormControlFile1">Shop Main Image</label>
									<input type="file"
									       required
									       accept=".png, .jpg, .jpeg"
									       className="form-control-file"
									       {...register('shopImage')} />
								</Form.Group>

								<Form.Group className={'py-3'}>
									<label htmlFor="exampleFormControlFile1">Shop Banner Image</label>
									<input type="file"
									       required
									       accept=".png, .jpg, .jpeg"
									       className="form-control-file"
									       {...register('shopBannerImage')} />
								</Form.Group>

								<div className="container">
									<div {...getRootProps({style})}>
										<input {...getInputProps()} name={'gallery'} />
										<p>Drag 'n' drop some files here, or click to select files</p>
									</div>
								</div>

							</Card.Body>
						</Card>

						<div className={'text-center'}>
							{
								loader ? <ProgressBar /> : <button className={'save__btn px-4'} type={'submit'}>Save</button>
							}
						</div>

					</Form>
				</Col>
			</Row>
		</div>
	);
};

export default ShopCreate;
