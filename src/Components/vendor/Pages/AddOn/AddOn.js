import React, { Fragment, useEffect, useState } from 'react';
import ApiError from "../../../../lib/ApiError/ApiError";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import { Col, Modal, Row } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import {
	addOnAddSuccessfully,
	addOnDeletedError,
	addOnDeletedSuccessfully,
	addOnEditSuccessfully
} from "../../../../lib/customer/Toaster/Toaster";
import { confirmAlert } from "react-confirm-alert";
import { Form, FormGroup, Input, Label } from "reactstrap";
import Loader from "../../../../lib/customer/Loader/Loader";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

const AddOn = props => {
	const columns = ['Title', 'AddOn', 'Actions'];
	const [addOns, setAddOns] = useState(null);
	const [show, setShow] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [submitLoader, setSubmitLoader] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
		name: '',
		price: ''
	})
	const [editFormData, setEditFormData] = useState({
		title: '',
		name: '',
		price: ''
	});
	const [addOnError, setAddOnError] = useState(null)
	const [staffId, setStaffId] = useState(null);
	const [isApiError, setIsApiError] = useState(false)
	const [isMsgError, setIsMsgError] = useState(null)
	const [addOnArr, setAddOnArr] = useState([]);
	const [editAddOnArr, setEditAddOnArr] = useState([]);

	const { addToast } = useToasts()

	const token = localStorage.getItem('vendorToken');

	useEffect(() => {
		axios.get('/vendor/add-ons', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setAddOns(res.data);
			})
	}, [submitLoader])


	const onDeleteHandler = (menuId) => {
		const options = {
			title: 'Delete Add On',
			message: 'Are you sure you want to delete ?',
			buttons: [
				{
					label: 'Confirm',
					onClick: () => {
						setSubmitLoader(true)
						axios.delete('/vendor/add-on/' + menuId, { headers: { "Authorization": `Bearer ${token}` } })
							.then((res) => {
								console.log(res.data)
								if (!res.data.deleted) {
									setSubmitLoader(false)
									addOnDeletedError(addToast)
								}
								else {
									setSubmitLoader(false)
									addOnDeletedSuccessfully(addToast)
								}

							}).catch((err) => {
								setIsApiError(true)
								setIsMsgError(err.message)
								console.log("VENDOR MENU DELETE", err)
								setSubmitLoader(false)
							})
					}
				},
				{
					label: 'Cancel',
					onClick: () => console.log('Click No')
				}
			],
			childrenElement: () => <div />,
			closeOnEscape: true,
			closeOnClickOutside: true,
			overlayClassName: "overlay-custom-class-name"
		};
		confirmAlert(options);
	}

	const ModalOpenHandler = () => {
		setShow(!show);
	}

	const editModalHandler = (addOnId) => {
		console.log(addOnId)
		axios.get('/vendor/add-on/' + addOnId, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setEditFormData({
					...editFormData,
					title: res.data.title
				});
				setEditAddOnArr(res.data.addOn)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR PRODUCT GET", err)
			})

		setStaffId(addOnId)
		setShowEdit(!showEdit);
	}

	const handleClose = () => setShow(false);
	const handleEditClose = () => setShowEdit(false)

	const onFormSubmit = (e) => {
		e.preventDefault();
		setSubmitLoader(true);
		const form = {
			title: formData.title,
			addOn: addOnArr
		}
		console.log("SUBMITTED", form)
		axios.post('/vendor/add-on', form, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setSubmitLoader(false);
				setShow(false)
				addOnAddSuccessfully(addToast)
				setFormData({
					title: '',
					name: '',
					price: ''
				})
				setAddOnArr([])
			})
	}

	const onEditFormSubmit = (e) => {
		e.preventDefault();
		setSubmitLoader(true);
		const form = {
			title: editFormData.title,
			addOn: editAddOnArr
		}
		axios.put('/vendor/add-on/' + staffId, form, { headers: { "Authorization": `Bearer ${token}` } })
			.then(() => {
				setSubmitLoader(false);
				setShowEdit(false)
				addOnEditSuccessfully(addToast)
			})
	}

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value
		})
	}

	const [editAddOnErrors, setEditAddOnErrors] = useState('')

	const [editDisabledBtn, setEditDisabledBtn] = useState(false)

	const onAddEditHandler = () => {
		if (editFormData.title === '' || editFormData.name === '' || editFormData.price === '') {
			setEditAddOnErrors('All Fields cannot be empty')

		}
		else {
			setEditAddOnErrors(' ')
			let arr = editAddOnArr;
			let bool = false;
			arr.forEach((item) => {
				if (item.name === editFormData.name) {
					setAddOnError('Item Already Added')
					bool = true
				}
			})
			if (!bool) {
				setAddOnError(' ')
				setEditDisabledBtn(false)
				setEditAddOnArr([...editAddOnArr, {
					name: editFormData.name,
					price: editFormData.price
				}])
			}
			setEditFormData({
				title: editFormData.title,
				name: '',
				price: ''
			})
		}
	}

	const [addOnErrors, setAddOnErrors] = useState()

	const [disabledBtn, setDisabledBtn] = useState(true)

	const onAddHandler = () => {

		if (formData.title === '' || formData.name === '' || formData.price === '') {
			setAddOnErrors('All Fields cannot be empty')
		}

		else {
			setAddOnErrors(' ')
			let arr = addOnArr;
			let bool = false;

			arr.forEach((item) => {
				if (item.name === formData.name) {
					setAddOnError('Item Already Added')
					bool = true
				}

			})
			if (!bool) {
				setAddOnError(" ")
				setDisabledBtn(false)
				setAddOnArr([...addOnArr, {
					name: formData.name,
					price: formData.price
				}])
			}
			setFormData({
				title: formData.title,
				name: '',
				price: ''
			})

		}
	}

	const onRemoveEditHandler = (item) => {
		console.log(editAddOnArr.length)

		let arr;
		arr = editAddOnArr
		let selectedItemIndex = arr.indexOf(item)
		arr.splice(selectedItemIndex, 1)
		setEditAddOnArr([...arr])
		if (arr.length === 0) {
			console.log("length of bucket", arr.length)

			setEditDisabledBtn(true)
		}
		
	}

	const onRemoveHandler = (item) => {
		console.log("HELLO WORLD")

		let arr;
		arr = addOnArr
		let selectedItemIndex = arr.indexOf(item)
		arr.splice(selectedItemIndex, 1)
		setAddOnArr([...arr])
		
		if(arr.length === 0) {
			setDisabledBtn(true)
		}
	}

	const onEditChangeHandler = (e) => {
		const { name, value } = e.target;
		console.log(name, value)
		setEditFormData({
			...editFormData,
			[name]: value
		})
	}

	const modal = (
		<Modal show={show} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<h2 style={{ fontWeight: "bold" }}> Add Add On </h2>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
				</div>
				<p style={{ fontWeight: "bold", color: 'red' }}>
					{addOnErrors}
				</p>
				<Form onSubmit={onFormSubmit}>
					<FormGroup>
						<h3 style={{ fontWeight: "bold" }}> Title </h3>
						{
							addOnArr.length === 0 ?
								<Input
									type="text"
									name="title"
									placeholder="Title"
									value={formData.title}
									onChange={onChangeHandler}
								/>
								: <Input
									type="text"
									disabled
									name="title"
									placeholder="Title"
									value={formData.title}
									onChange={onChangeHandler}
								/>
						}
						<h3 style={{ fontWeight: "bold" }} className={'mt-3'}> Create Add On </h3>
						<Row >
							<Col md={5}>
								<Input
									type="text"
									name="name"
									placeholder="Name"
									className={'my-2'}
									value={formData.name}
									onChange={onChangeHandler}
								/>
							</Col>

							<Col md={5}>
								<Input
									type="number"
									name="price"
									className={'my-2'}
									placeholder="Price"
									value={formData.price}
									onChange={onChangeHandler}
								/>
							</Col>

							<Col md={2}>
								<i
									style={{ fontSize: "38px", color: "#ff4200", cursor: "pointer" }}
									className="zmdi zmdi-plus-circle-o mt-1"
									onClick={onAddHandler}
								>
								</i>
							</Col>
						</Row>

					</FormGroup>

					<p style={{ color: "red", fontWeight: "bold", }}
						className={'text-center'}> {addOnError} </p>

					{
						addOnArr.length > 0 ?
							addOnArr.map((arr, index) => (
								<>
									<div style={{
										display: "flex", justifyContent: "space-around",
										backgroundColor: "#F5F5F5"
									}} className={'mb-3 pt-2'}>
										<p> <span style={{ fontWeight: "bold" }}> No. </span> {index + 1} </p>
										<p> <span style={{ fontWeight: "bold" }}> Name: </span> {arr.name}</p>
										<p> <span style={{ fontWeight: "bold" }}>  Price: </span> {arr.price}</p>
										<i className="zmdi zmdi-close-circle" style={{ fontSize: '30px', color: "#ff4200", cursor: "pointer" }} onClick={() => onRemoveHandler(arr)} />
									</div>

								</>
							))
							: null
					}
					<div className={'text-center'}>
						{
							disabledBtn ?
								!submitLoader ?
									<button type={'submit'} disabled style={{ opacity: "0.5" }} className={'px-5 btn btn-send btn-block'}>Add</button>
									: (<Loader style={'text-center'} />)

								:
								!submitLoader ?
									<button type={'submit'} className={'px-5 btn btn-send btn-block'}>Add</button>
									: (<Loader style={'text-center'} />)
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)

	const editModal = (
		<Modal show={showEdit} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p style={{ fontWeight: "bold" }}>Edit Add On</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleEditClose} title="Close Staff">X</p>
				</div>
				<p style={{ fontWeight: "bold", color: 'red' }}>
					{editAddOnErrors}
				</p>
				<Form onSubmit={onEditFormSubmit}>
					<FormGroup>
						<h3 style={{ fontWeight: "bold" }}> Title </h3>
						{
							editAddOnArr.length === 0 ?
								<Input
									type="text"
									name="title"
									placeholder="Title"
									value={editFormData.title}
									onChange={onEditChangeHandler}
								/>
								: <Input
									type="text"
									disabled
									name="title"
									placeholder="Title"
									value={editFormData.title}
									onChange={onEditChangeHandler}
								/>
						}
						<h3 style={{ fontWeight: "bold" }} className={'mt-3'}> Create Add On </h3>
						<Row>
							<Col md={5}>
								<Input
									type="text"
									name="name"
									placeholder="Name"
									className={'my-2'}
									value={editFormData.name}
									onChange={onEditChangeHandler}
								/>
							</Col>
							<Col md={5}>
								<Input
									type="number"
									name="price"
									className={'my-2'}
									placeholder="Price"
									value={editFormData.price}
									onChange={onEditChangeHandler}
								/>
							</Col>
							<Col md={2}>
								<i
									style={{ fontSize: "38px", color: "#ff4200", cursor: "pointer" }}
									className="zmdi zmdi-plus-circle-o mt-1"
									onClick={onAddEditHandler}
								/>
							</Col>
						</Row>
					</FormGroup>

					<p style={{ color: "red", fontWeight: "bold", }}
						className={'text-center'}> {addOnError} </p>

					{
						editAddOnArr.length > 0 ?
							editAddOnArr.map((arr, index) => (
								<>
									<div style={{
										display: "flex", justifyContent: "space-around",
										backgroundColor: "#F5F5F5"
									}} className={'mb-3 pt-2'}>
										<p> <span style={{ fontWeight: "bold" }}> No. </span> {index + 1} </p>
										<p> <span style={{ fontWeight: "bold" }}> Name: </span> {arr.name}</p>
										<p> <span style={{ fontWeight: "bold" }}>  Price: </span> {arr.price}</p>
										<i className="zmdi zmdi-close-circle" style={{ fontSize: '30px', color: "#ff4200", cursor: "pointer" }} onClick={() => onRemoveEditHandler(arr)} />
									</div>
								</>
							))
							: null
					}
					<div className={'text-center'}>
						{

							editDisabledBtn ?
								!submitLoader ?
									<button type={'submit'} disabled style={{ opacity: "0.5" }} className={'px-5 btn btn-send btn-block'}>Edit</button>
									: (<Loader style={'text-center'} />)
								:
								!submitLoader ?
									<button type={'submit'} className={'px-5 btn btn-send btn-block'}>Edit</button>
									: (<Loader style={'text-center'} />)
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)

	let addOnTable = (
		<div className="mt-5">
			<Loader style={'text-center'} />
		</div>
	)

	if (!submitLoader && addOns && addOns.length === 0) {
		addOnTable = (
			<div className={'text-center '}>
				<p style={{ fontWeight: "bold" }}>No Add-On Found</p>
			</div>
		)
	}

	if (!submitLoader && addOns && addOns.length > 0) {
		addOnTable = (
			<>
				<Table>
					<TableHead>
						<TableRow style={{
							backgroundColor: "#ff4200"
						}} hover>
							{
								columns.map((col, index) => (
									<TableCell key={index}
										style={{ fontWeight: "bold" }}
									>{col}</TableCell>
								))
							}
						</TableRow>
					</TableHead>
					<TableBody>
						<Fragment>
							{
								addOns.map((addOn, index) => {
									console.log(addOn)
									return (
										(
											<TableRow hover key={index}>
												<TableCell> {addOn.title} </TableCell>

												<TableCell>{
													addOn.addOn.map((addOn) => {
														return `${addOn.name}, `
													})
												}</TableCell>
												<TableCell>
													<i className="zmdi zmdi-edit mr-3"
														style={{ fontSize: "28px", cursor: "pointer" }}
														onClick={() => editModalHandler(addOn._id)}
													/>
													<i className="zmdi zmdi-delete"
														style={{ fontSize: "28px", cursor: "pointer", color: "red" }}
														onClick={() => onDeleteHandler(addOn._id)} />
												</TableCell>
											</TableRow>
										)
									)
								})
							}
						</Fragment>
					</TableBody>
				</Table>
			</>
		)
	}
	return (
		<>
			<div>
				<ApiError show={isApiError} error={isMsgError} />
				{modal}
				{editModal}
				<PageTitleBar title='Add On' match={props.match} />
				<Row className={'justify-content-end'}>
					<Col md={2} sm={12} lg={1} className="mr-1">
						<button className={'text-center btn btn-send btn-block'}
							onClick={ModalOpenHandler} > Add </button>
					</Col>
				</Row>
				<hr />
				<div style={{ margin: '12px' }}>
					<Row className={'table-responsive'}>
						{addOnTable}
					</Row>
				</div>

			</div>
		</>
	);
};

export default AddOn;
