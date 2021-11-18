import React, { useState, useEffect } from 'react';
import { connect } from "react-redux";
import { NavLink } from "react-router-dom"
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import { Col, Modal, Row } from "react-bootstrap";
import { Form, FormGroup, Input, Label } from "reactstrap";
import * as action from "../../../../Store/vendor/actions";
import { Controller, useForm } from "react-hook-form";
import { confirmAlert } from 'react-confirm-alert';
import Select from 'react-select'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { useToasts } from "react-toast-notifications";
import { vendorMenuDelete, vendorMenuUpdated, vendorMenuCreated }
	from "../../../../lib/customer/Toaster/Toaster";
import MenuValidation from "./MenuValidation";
import ApiError from "../../../../lib/ApiError/ApiError"
import Loader from "../../../../lib/customer/Loader/Loader";
import AsyncSelect from 'react-select/async';
import axios from "axios";
import './Menu.css'

const Menu = (props) => {

	const [show, setShow] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [submitLoader, setSubmitLoader] = useState(false);
	const [editFormData, setEditFormData] = useState(null);
	const [staffId, setStaffId] = useState('');
	const [isApiError, setIsApiError] = useState(false)
	const [isMsgError, setIsMsgError] = useState(null)
	const [addOn, setAddOn] = useState(null)
	const [category, setCategory] = useState(null)
	const [timeError, setTimeError] = useState(null)
	const [categoryMsg, setCategoryMsg] = useState(null)
	const [categoryNotSelect, setCategoryNotSelect] = useState(null)
	const [editCategoryNotSelect, setEditCategoryNotSelect] = useState(null)
	const [menuType, setMenuType] = useState(null)


	let error = {}

	const { addToast } = useToasts()

	const token = localStorage.getItem('vendorToken');

	const { register, handleSubmit, formState: { errors }, reset, control } = useForm();
	const { register: register2, handleSubmit: handleSubmit2, } = useForm();

	useEffect(() => {
		props.fetchMenu();
	}, [submitLoader])


	const onDeleteHandler = (menuId) => {
		const options = {
			title: 'Delete Menu',
			message: 'Are you sure you want to delete ?',
			buttons: [
				{
					label: 'Confirm',
					onClick: () => {
						setSubmitLoader(true)
						axios.delete('/vendor/product/' + menuId, { headers: { "Authorization": `Bearer ${token}` } })
							.then((res) => {
								setSubmitLoader(false)
								vendorMenuDelete(addToast)
							}).catch((err) => {
								setIsApiError(true)
								setIsMsgError(err.message)
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

	const editModalHandler = (menuId) => {

		axios.get('/vendor/product/' + menuId, { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data.addOn)

				let time = res.data.product.time
				console.log(time)

				let arr = time.split(':');
				res.data.product.hours = arr[0]
				res.data.product.mins = arr[1]
				console.log(res.data.product)
				setEditFormData(res.data.product);

				setAddOn(res.data.addOn)
				setCategory(res.data.category);
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR PRODUCT GET", err)
			})

		setStaffId(menuId)
		setShowEdit(!showEdit);
	}

	const handleClose = () => setShow(false);
	const handleClose2 = () => setShowEdit(false)

	const handleEditValidation = () => {
		let fields = editFormData

		if (fields) {

			if (typeof fields.productName !== "undefined") {
				if (!fields.productName.match(/^[a-zA-Z ]+$/)) {
					error.productName = "Product Name must be string"
				}
			}

			if (fields.productName === '') {
				error.productName = "Cannot be empty"
			}

		}

	}
	handleEditValidation()

	let categoryData = (
		<div>
			<p className="text-danger"> Please select a category or <NavLink to={'/vendor/category'}> Create new One! </NavLink> </p>
		</div>
	)



	const onFormSubmit = (data) => {
		console.log(data)
		setSubmitLoader(true);
		let hour = data.hour
		let min = data.min

		if (data.hour.length === 1) {
			hour = `0${data.hour}`;
		}
		if (data.min.length === 1) {
			min = `0${data.min}`;
		}

		if (data.category === undefined) {
			setCategoryNotSelect(categoryData)
			setSubmitLoader(false);
		}

		if (data.menuType === undefined) {
			setMenuType("please select a Menu Type")
		}

		else {

			if (hour >= 0 && (min > 0 && min < 60)) {

				const formData = new FormData();
				formData.append("productName", data.productName);
				formData.append("productPrice", data.productPrice);
				formData.append("productPicture", data.productPicture[0])
				formData.append("category", data.category.value)
				formData.append("menuType", data.menuType.value)
				formData.append("allergyInfo", data.allergyInfo);

				if (data.addOn) {
					formData.append("productAddOn", JSON.stringify(data.addOn))
				}
				formData.append('time', `${hour}:${min}`)

				axios.post('/vendor/product', formData, { headers: { "Authorization": `Bearer ${token}` } })
					.then(() => {
						setShow(!show)
						setSubmitLoader(false);
						vendorMenuCreated(addToast)
					})
					.catch((err) => {
						setIsApiError(true)
						setIsMsgError(err.message)
						console.log("VENDOR PRODUCT POST", err)
					})

				reset({})
			}

			else {
				setTimeError("Hour should be greater than 0 and minutes should be greater than 0 and less than 60")
				setSubmitLoader(false);

			}
		}


	}

	const addOnPromiseHandler = () =>
		new Promise(resolve => {
			axios.get('/vendor/add-on-menu', { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					resolve(res.data)
				})
		});

	const categoriesPromiseHandler = () =>
		new Promise(resolve => {
			axios.get('/vendor/category-menu', { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					setCategoryMsg(res.data.length)
					resolve(res.data)
				})
		});

	const options = [
		{ value: 'Halal', label: 'Halal' },
		{ value: 'Haram', label: 'Haram' }
	]

	const modal = (
		<Modal show={show} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Add Menu Items</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
				</div>
				<Form onSubmit={handleSubmit(onFormSubmit)}>
					<FormGroup>
						<Label for="name">Product Name</Label>
						<Input
							type="text"
							name="productName"
							placeholder="Product Name"
							{...register('productName', MenuValidation.name)}
						/>
						<small className="text-danger" style={{ fontWeight: "bold" }} >
							{errors.productName && errors.productName.message}
						</small>
					</FormGroup>
					<FormGroup>
						<Label for="name">Product Price</Label>
						<Input
							type="number"
							name="productPrice"
							placeholder="Product Price"
							{...register('productPrice', MenuValidation.price)}

						/>
						<small className="text-danger" style={{ fontWeight: "bold" }} >
							{errors.productPrice && errors.productPrice.message}
						</small>
					</FormGroup>
					<FormGroup>
						<Label>Time</Label>
						<div className={'d-flex justify-content-around'}>
							<Input
								type="number"
								name="hour"
								placeholder="Hour"
								{...register('hour', MenuValidation.time)}
							/>
							<Input
								type="number"
								name="min"
								placeholder="Minute"
								{...register('min', MenuValidation.time)}
							/>
						</div>
						<small className="text-danger" style={{ fontWeight: "bold" }} >
							{errors.hour && errors.hour.message}
							{
								timeError
							}
						</small>

					</FormGroup>

					<FormGroup>
						<Label for="Select">Category</Label>
						{
							categoryMsg === 0 ?
								<p className="text-danger"> For Creating Menu first you have to create Category
								</p>
								:
								<Controller
									name="category"
									control={control}
									render={({ field: { value, onChange, ref } }) => (
										<AsyncSelect
											name={'category'}
											cacheOptions
											defaultOptions
											required
											value={value}
											onChange={onChange}
											loadOptions={categoriesPromiseHandler}
										/>
									)}
								/>
						}
						<small className="text-danger" style={{ fontWeight: "bold" }}>
							{categoryNotSelect}
						</small>

					</FormGroup>

					<FormGroup>
						<Label for="Select">Add On</Label>
						<Controller
							name="addOn"
							control={control}
							render={({ field: { value, onChange, ref } }) => (
								<AsyncSelect
									name={'addOn'}
									cacheOptions
									isMulti

									defaultOptions
									value={value}
									onChange={onChange}
									loadOptions={addOnPromiseHandler}
								/>
							)}
						/>
					</FormGroup>

					<FormGroup>
						<Label for="Select">Menu Type</Label>
						<Controller
							name="menuType"

							control={control}
							render={({ field: { value, onChange, ref } }) => (
								<Select
									name={'menuType'}
									cacheOptions

									defaultOptions
									options={options}
									value={value}
									onChange={onChange}
								/>
							)}
						/>
					</FormGroup>

					<small className="text-danger" style={{ fontWeight: "bold" }}>
						{menuType}
					</small>

					<FormGroup>
						<Label for="name">Allergy Info</Label>
						<Input
							type="textarea"
							name="allergyInfo"
							placeholder="Allergy Info"
							{...register('allergyInfo', MenuValidation.allergyInfo)}
						/>
						<small className="text-danger" style={{ fontWeight: "bold" }} >
							{errors.allergyInfo && errors.allergyInfo.message}
						</small>
					</FormGroup>
					<div className="form-group">
						<label htmlFor="exampleFormControlFile1">Product Picture</label>
						<input type="file"
							accept=".png, .jpg, .jpeg"
							required
							className="form-control-file"
							{...register('productPicture')}
						/>
					</div>
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

	const onEditFormSubmit = (data) => {
		setSubmitLoader(true);

		if (category.value === undefined) {
			setEditCategoryNotSelect(categoryData)
			setSubmitLoader(false);
		}

		if (editFormData.menuType === undefined) {
			setMenuType("please select a Menu Type")
		}

		else {
			if (editFormData.hours >= 0 && (editFormData.mins >= 0 && editFormData.mins <= 60)) {

				let hour = editFormData.hours
				let min = editFormData.mins

				if (hour.length === 1) {
					hour = `0${editFormData.hours}`;
				}
				if (min.length === 1) {
					min = `0${editFormData.mins}`;
				}

				const formData = new FormData();
				formData.append("productName", editFormData.productName);
				formData.append("productPrice", editFormData.productPrice);
				formData.append("productPicture", data.productPicture[0]);
				formData.append("currentPicture", JSON.stringify(editFormData.productPicture))
				formData.append("category", category.value)
				formData.append("menuType", editFormData.menuType)
				formData.append("allergyInfo", editFormData.allergyInfo);
				formData.append("productAddOn", JSON.stringify(addOn))
				formData.append("time", `${hour}:${min}`)

				axios.put('/vendor/product/' + staffId, formData, { headers: { "Authorization": `Bearer ${token}` } })
					.then(() => {
						setShowEdit(!showEdit)
						setSubmitLoader(false);
						vendorMenuUpdated(addToast)
					})
					.catch((err) => {
						setIsApiError(true)
						setIsMsgError(err.message)
						console.log("VENDOR PRODUCT PUT", err)
					})
				reset({})
			}
			else {
				setTimeError("Hour should be greater than 0 and minutes should be greater than 0 and less than 60")
				setSubmitLoader(false);
			}

		}


	}

	let name, value;
	const onChangeHandler = (e) => {
		name = e.target.name
		value = e.target.value;
		setEditFormData({ ...editFormData, [name]: value })

	}

	const handleInputChange = (newValue) => {
		console.log(newValue)
		setAddOn(newValue)
	};

	const handleEditInputChange = (newValue) => {
		setCategory(newValue)
	}

	const onMenuChangeHandler = (data) => {
		console.log(data)
		setEditFormData({
			...editFormData,
			menuType: data.value,
		})
	}

	const editModal = (
		<Modal show={showEdit} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Edit Menu</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose2} title="Close Staff">X</p>
				</div>
				{
					editFormData ?
						<Form onSubmit={handleSubmit2(onEditFormSubmit)}>
							<FormGroup>
								<Label for="name">Product Name</Label>
								<Input type="text" name="productName" required placeholder="Product Name"
									value={editFormData.productName} onChange={onChangeHandler}
								/>
								<small className="text-danger" style={{ fontWeight: "bold" }} >
									{error.productName}
								</small>
							</FormGroup>
							<FormGroup>
								<Label for="name">Product Price</Label>
								<Input type="number" name="productPrice" required placeholder="Product Price"
									value={editFormData.productPrice} onChange={onChangeHandler}
								/>
								<small className="text-danger" style={{ fontWeight: "bold" }} >
									{error.productPrice}
								</small>
							</FormGroup>
							<FormGroup>
								<Label>Time</Label>
								<div className={'d-flex justify-content-around'}>
									<Input
										type="number"
										name="hours"
										required
										placeholder="Hours"
										value={editFormData.hours}
										onChange={onChangeHandler}
									/>
									<Input
										type="number"
										name="mins"
										required
										placeholder="Minutes"
										value={editFormData.mins}
										onChange={onChangeHandler}
									/>
								</div>
								<small className="text-danger" style={{ fontWeight: "bold" }} >
									{timeError}
								</small>
							</FormGroup>
							<FormGroup>
								<Label for="Select">Category</Label>
								{
									categoryMsg === 0 ?
										<p className="text-danger">
											For Creating Menu you have to create Category first
										</p>
										:
										<AsyncSelect
											name={'category'}
											required
											cacheOptions
											defaultOptions
											value={category}
											onChange={handleEditInputChange}
											loadOptions={categoriesPromiseHandler}
										/>
								}
								<small>
									{editCategoryNotSelect}
								</small>
							</FormGroup>
							<FormGroup>
								<Label for="Select">Add On</Label>
								<AsyncSelect
									name={'addOn'}
									
									cacheOptions
									defaultOptions
									isMulti
									value={addOn}
									onChange={handleInputChange}
									loadOptions={addOnPromiseHandler}
								/>
							</FormGroup>


							<FormGroup>
								<Label for="Select">Menu Type</Label>
								<Select
									name={'menuType'}
									required
									cacheOptions
									defaultOptions
									value={{ label: editFormData.menuType, value: editFormData.menuType }}
									onChange={onMenuChangeHandler}
									options={options}
								/>
							</FormGroup>

							<FormGroup>
								<Label for="name">Allergy Info</Label>
								<Input
									type="textarea"
									required
									name="allergyInfo"
									placeholder="Allergy Info"
									value={editFormData.allergyInfo}
									onChange={onChangeHandler}
								/>
							</FormGroup>

							<div className="form-group">
								<label htmlFor="exampleFormControlFile1">Product Picture</label>
								<input type="file"
									accept=".png, .jpg, .jpeg"
									className="form-control-file"
									{...register2('productPicture')}
								/>
							</div>
							<div className={'text-center'}>
								{
									!submitLoader ?
										<button
											type={'submit'}
											className={'text-center btn btn-send btn-block'}
										> Edit </button> :
										(<Loader />)
								}
							</div>
						</Form>
						: null
				}
			</Modal.Body>
		</Modal>
	)

	let menu = (
		<div className="mt-5">
			<Loader style={'text-center'} />
		</div>
	)

	if (!submitLoader && props.menu && props.menu.product && props.menu.product.length === 0) {
		menu = (
			<div className={'text-center '}>
				<p style={{ fontWeight: "bold" }}>No Menu Found</p>
			</div>
		)
	}

	if (!submitLoader && props.menu && props.menu.product && props.menu.product.length > 0) {
		menu = props.menu.product.map((menu) => (
			<>
				<Col md={4} className={'mr-3'}>
					<Row className={'shadow border-0 bg-white mt-2 mb-4'}>
						<Col md={7}>
							<div className="mt-2">
								<h3>{menu.productName}</h3>
								<div className="d-flex justify-content-between align-items-center">
									<p> {menu.productPrice}$ </p>
									<p>{menu.menuType}</p>
									<h4>{menu.time}</h4>
								</div>
								<button
									className={' btn-send px-4 mr-2'}
									onClick={() => editModalHandler(menu._id)}
								>EDIT
								</button>
								<button
									className={' btn-send px-4 '}
									onClick={() => onDeleteHandler(menu._id)}
								>DELETE
								</button>
							</div>
						</Col>
						<Col md={5} >
							<div className={'vendor-menu'}>
								<img alt={'img'} style={{ width: "100%" }} src={menu.productPicture.avatar} />
							</div>
						</Col>
					</Row>
				</Col>
			</>
		)
		)
	}
	return (
		<>
			<div>
				<ApiError show={isApiError} error={isMsgError} />
				{modal}
				{editModal}
				<PageTitleBar title='Menu' match={props.match} />
				<Row className={'justify-content-end'}>
					<Col md={2} sm={12} lg={1} className="mr-1">
						<button className={'text-center btn btn-send btn-block'}
							onClick={ModalOpenHandler} > Add </button>
					</Col>
				</Row>
				<hr />
				<div style={{ margin: '12px' }}>
					<Row className={'justify-content-center'}>
						{menu}
					</Row>
				</div>

			</div>
		</>
	);
};

const mapStateToProps = state => {
	return {
		menu: state.menu.menu,
		submitLoader: state.menu.submitLoader,
		loading: state.menu.loading,
		storeId: state.menu.storeId,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		createMenu: (formInput) => dispatch(action.createMenu(formInput)),
		fetchMenu: () => dispatch(action.fetchMenu()),
		editMenu: (menuId, formData) => dispatch(action.editMenu(menuId, formData)),
		deleteMenu: (menuId) => dispatch(action.deleteMenu(menuId))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu);
