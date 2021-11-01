import React, { Fragment, useEffect, useState } from 'react';
import ApiError from "../../../../lib/ApiError/ApiError";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import { Col, Modal, Row } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import {
	addOnAddSuccessfully,
	addOnDeletedSuccessfully,
	addOnEditSuccessfully
} from "../../../../lib/customer/Toaster/Toaster";
import { confirmAlert } from "react-confirm-alert";
import { Form, FormGroup, Input } from "reactstrap";
import Loader from "../../../../lib/customer/Loader/Loader";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";

const Category = props => {
	const columns = ['Title', 'Actions'];
	const [category, setCategory] = useState(null);
	const [show, setShow] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [submitLoader, setSubmitLoader] = useState(false);
	const [formData, setFormData] = useState({
		title: '',
	})
	const [editFormData, setEditFormData] = useState({
		title: '',
	});
	const [staffId, setStaffId] = useState('');
	const [isApiError, setIsApiError] = useState(false)
	const [isMsgError, setIsMsgError] = useState(null)

	const { addToast } = useToasts()

	const token = localStorage.getItem('vendorToken');

	useEffect(() => {
		axios.get('/vendor/category', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setCategory(res.data);
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
						axios.delete('/vendor/category/' + menuId, { headers: { "Authorization": `Bearer ${token}` } })
							.then((res) => {
								if (!res.data.deleted) {
									setSubmitLoader(false)
								} else {
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

	const editModalHandler = (categoryId) => {
		console.log(categoryId)
		axios.get('/vendor/category/' + categoryId, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setEditFormData({
					...editFormData,
					title: res.data.title
				});
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR PRODUCT GET", err)
			})
		setStaffId(categoryId)
		setShowEdit(!showEdit);
	}

	const handleClose = () => setShow(false);
	const handleEditClose = () => setShowEdit(false)

	const onFormSubmit = (e) => {
		e.preventDefault();
		setSubmitLoader(true);
		const form = {
			title: formData.title,
		}
		axios.post('/vendor/category', form, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setSubmitLoader(false);
				setShow(false)
				addOnAddSuccessfully(addToast)
				setFormData({
					title: '',
				})
			})
	}

	const onEditFormSubmit = (e) => {
		e.preventDefault();
		setSubmitLoader(true);
		const form = {
			title: editFormData.title,
		}
		axios.put('/vendor/category/' + staffId, form, { headers: { "Authorization": `Bearer ${token}` } })
			.then(() => {
				setSubmitLoader(false);
				setShowEdit(false)
				addOnEditSuccessfully(addToast)
			})
	}

	const onChangeHandler = (e) => {
		const { name, value } = e.target;
		console.log(name, value)
		setFormData({
			...formData,
			[name]: value
		})
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
					<h2 style={{ fontWeight: "bold" }}> Add Category </h2>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
				</div>
				<Form onSubmit={onFormSubmit}>
					<FormGroup>
						<h3 style={{ fontWeight: "bold" }}> Title </h3>
						<Input
							type="text"
							name="title"
							placeholder="Title"
							value={formData.title}
							onChange={onChangeHandler}
						/>

					</FormGroup>
					<div className={'text-center'}>
						{
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
				<Form onSubmit={onEditFormSubmit}>
					<FormGroup>
						<h3 style={{ fontWeight: "bold" }}> Title </h3>
						<Input
							type="text"
							name="title"
							placeholder="Title"
							value={editFormData.title}
							onChange={onEditChangeHandler}
						/>

					</FormGroup>
					<div className={'text-center'}>
						{
							!submitLoader ?
								<button type={'submit'} className={'px-5 btn btn-send btn-block'}>Edit</button>
								: (<Loader style={'text-center'} />)
						}
					</div>
				</Form>
			</Modal.Body>
		</Modal>
	)

	let categoryTable = (
		<div className="mt-5">
			<Loader style={'text-center'} />
		</div>
	)

	if (!submitLoader && category && category.length === 0) {
		categoryTable = (
			<div className={'text-center '}>
				<p style={{ fontWeight: "bold" }}>No Category Found</p>
			</div>
		)
	}

	if (!submitLoader && category && category.length > 0) {
		categoryTable = (
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
								category.map((category, index) => {
									return (
										(
											<TableRow hover key={index}>
												<TableCell> {category.title} </TableCell>

												<TableCell>
													<i className="zmdi zmdi-edit mr-3"
														style={{ fontSize: "28px", cursor: "pointer" }}
														onClick={() => editModalHandler(category._id)}
													/>
													<i className="zmdi zmdi-delete"
														style={{ fontSize: "28px", cursor: "pointer", color: "red" }}
														onClick={() => onDeleteHandler(category._id)} />
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
						{categoryTable}
					</Row>
				</div>

			</div>
		</>
	);
};
export default Category;