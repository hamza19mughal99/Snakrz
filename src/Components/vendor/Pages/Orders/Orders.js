import React, { Fragment, useState, useEffect } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import IconButton from "@material-ui/core/IconButton";
import { useToasts } from "react-toast-notifications";
import { vendorOrderCompleted, vendorOrderRejected, VendorOrderReady } from "../../../../lib/customer/Toaster/Toaster";
import { Col, Modal, Row } from "react-bootstrap";
import { Map, GoogleApiWrapper, Marker } from "google-maps-react";
import GooglePlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import 'react-tabs/style/react-tabs.css';
import axios from "axios";
import Loader from "../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../lib/ApiError/ApiError"

const Customers = props => {

	const { addToast } = useToasts()

	const columns = ['CustomerName', 'delivery method', 'MobileNumber', 'notes', 'Price', 'Order', 'Map', 'Status', 'Actions'];
	const [show, setShow] = useState(false);
	const [show2, setShow2] = useState(false);
	const [orders, setOrders] = useState(null);
	const [underApprovalOrder, setUnderApprovalOrder] = useState(null);
	const [rejectedOrder, setRejectedOrder] = useState(null);
	const [inProgressOrder, setInProgressOrder] = useState(null);
	// const [AlmostReadyOrder, setAlmostReadyOrder] = useState(null);
	const [readyOrder, setReadyOrder] = useState(null)
	const [successfulOrder, setSuccessfulOrder] = useState(null)
	const [loader, setLoader] = useState(false);
	const [products, setProducts] = useState([])
	const [isApiError, setIsApiError] = useState(false)
	const [isMsgError, setIsMsgError] = useState(null)
	const [customerLocation, setCustomerLocation] = useState(null)
	const [showAddress, setShowAddress] = useState(null)


	const token = localStorage.getItem('vendorToken');

	useEffect(() => {
		setLoader(true);
		axios.get('/vendor/orders', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data)
				setOrders(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR ALL ORDERS GET", err)
			})

		axios.get('/vendor/under-approval', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setUnderApprovalOrder(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR UNDER APPROVAL ORDERS GET", err)
			})

		axios.get('/vendor/order-rejected', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setRejectedOrder(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR REJECTED ORDERS GET", err)
			})

		axios.get('/vendor/order-inprogress', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setInProgressOrder(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR IN PROGRESS ORDERS GET", err)
			})

		// axios.get('/vendor/order-almost-ready', { headers: { "Authorization": `Bearer ${token}` } })
		// 	.then((res) => {
		// 		setAlmostReadyOrder(res.data)
		// 	})
		// 	.catch((err) => {
		// 		setIsApiError(true)
		// 		setIsMsgError(err.message)
		// 		console.log("VENDOR ALMOST READY ORDERS GET", err)
		// 	})

		axios.get('/vendor/order-ready', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setReadyOrder(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR ALMOST READY ORDERS GET", err)
			})

		axios.get('/vendor/order-successful', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				setSuccessfulOrder(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR ALMOST READY ORDERS GET", err)
			})

		// ****************

	}, [!loader])

	// **********

	const onApprovedOrderHandler = (orderId) => {
		setLoader(false)
		axios.put('/vendor/to-progress/' + orderId)
			.then((res) => {
				setLoader(true)
				vendorOrderCompleted(addToast)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR APPROVED ORDERS PUT", err)
			})
	}

	// const onInProgressOrderHandler = (orderId) => {
	// 	setLoader(false)
	// 	axios.put('/vendor/to-almost-ready/' + orderId)
	// 		.then((res) => {
	// 			setLoader(true)
	// 			vendorOrderInProgress(addToast)
	// 		})
	// 		.catch((err) => {
	// 			setIsApiError(true)
	// 			setIsMsgError(err.message)
	// 			console.log("VENDOR ALMOST READY ORDERS PUT", err)
	// 		})
	// }


	const onRejectedOrderHandler = (orderId) => {
		setLoader(false)
		axios.put('/vendor/to-rejected/' + orderId)
			.then((res) => {
				setLoader(true)
				vendorOrderRejected(addToast)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR REJECTED ORDERS PUT", err)
			})
	}

	const onAlmostReadyOrderHandler = (orderId) => {
		setLoader(false)
		axios.put('/vendor/to-ready/' + orderId)
			.then((res) => {
				setLoader(true)
				VendorOrderReady(addToast)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR READY ORDERS PUT", err)
			})
	}

	const onReadyHandler = (orderId) => {
		setLoader(false)
		axios.put('/vendor/to-completed/' + orderId)
			.then((res) => {
				setLoader(true)
				// vendorOrderSuccessful(addToast)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("VENDOR READY ORDERS PUT", err)
			})
	}

	const handleClose = () => setShow(false);
	const handleClose2 = () => setShow2(false)

	const ModalOpenHandler = (order) => {
		setProducts(order.items)
		setShow(!show);
	}

	const MapModalHandler = (order) => {

		console.log(order)

		// navigator.geolocation.getCurrentPosition(function (position) {
        //     axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude}, ${position.coords.longitude}&key=${process.env.REACT_APP_GOOGLE_MAP_API}`)
        //         .then((res) => {
        //             let obj = {
        //                 label: res.data.results[0].formatted_address,
        //                 value: res.data.results[0],
        //             }
		// 			setShowAddress(obj)
                    
        //         })

        // });

		setCustomerLocation(order.customer.location)
		setShow2(!show2)
	}

	const modal = (
		<Modal show={show} size={'lg'} className="StaffEditCard">
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<p>Orders</p>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose} title="Close Staff">X</p>
				</div>
				<div>
					{
						products.map((product, index) => {
							console.log(product)
							return (
								<>
									<div>
										<Row style={{ justifyContent: "space-around" }} className={'d-flex'}>
											<Col md={0.5} style={{
												fontWeight: "bold",
												backgroundColor: "#ff4200",
												color: "#fff",
												paddingLeft: "5px",
												paddingRight: "5px"
											}}>
												#{index + 1}
											</Col>
											<Col md={2}>
												<span>
													<span style={{
														color: "#ff4200",
														fontWeight: "bold"
													}}> Item Name - </span> {product.itemName}
												</span>
											</Col>
											<Col md={2}>
												<span>
													<span style={{
														color: "#ff4200",
														fontWeight: "bold"
													}}> Item Quantity - </span> {product.quantity}
												</span>
											</Col>
											<Col md={4}>
												{
													product.addOn.map((addOn, index) => {
														return (
															<div key={index}>
																<span style={{ fontWeight: "bold", color: "#ff4200", marginRight: "8px" }}>
																	Add On's -
																</span>
																{addOn.name},
															</div>
														)
													})
												}
											</Col>
										</Row>
									</div>
								</>
							)
						})
					}
				</div>
			</Modal.Body>
		</Modal>
	)

	const mapModal = (
		<Modal show={show2} size={'lg'} >
			<Modal.Body>
				<div className="d-flex justify-content-between align-items-center">
					<h1>Map</h1>
					<p style={{ cursor: "pointer", fontSize: "20px" }} onClick={handleClose2} title="Close Staff">X</p>
				</div>
			</Modal.Body>

			<div className={'map_wrapper_setting'}>
				<Map google={props.google}
					initialCenter={customerLocation}
					zoom={16}
				>
					<Marker
						position={
							customerLocation
						}
						name={'Your position'} />
				</Map>
			</div>
		</Modal>
	)

	const getOrderTable = (orders) => {
		let vendorTable = (
			<div className={'mt-5'}>
				<Loader style={'text-center'} />
			</div>
		);

		if (orders && orders.length === 0) {
			vendorTable = <p style={{ fontWeight: "bold" }} className={'text-center'}>No Orders Found</p>
		}

		if (orders && orders.length > 0) {
			vendorTable = (
				<Table>
					<TableHead>
						<TableRow hover>
							{
								columns.map((col, index) => (
									<TableCell key={index}>{col}</TableCell>
								))
							}
						</TableRow>
					</TableHead>
					<TableBody>
						<Fragment>
							{
								orders.map((order, index) => {

									let customerNumber, customerName, orderStatus, delivery, notes, price;

									if (order) {
										customerName = order.customer.name
										delivery = order.delivery
										price = order.totalPrice
										customerNumber = order.customer.phoneNumber
										orderStatus = order.orderStatus
										notes = order.notes
									}

									let all; let ico1, ico2;
									if (orderStatus === "UNDER_APPROVAL") {
										all = <TableCell style={{ fontWeight: "900", color: "green" }} >   {orderStatus}  </TableCell>
										ico1 = <IconButton className="text-success px-2" title="Approved" aria-label="Approved" onClick={() => onApprovedOrderHandler(order._id)}> <i class="zmdi zmdi-check-all"></i></IconButton>
										ico2 = <IconButton className="text-danger px-2" title="Rejected" aria-label="rejected" onClick={() => onRejectedOrderHandler(order._id)}> <i class="zmdi zmdi-close"></i> </IconButton>
									}
									if (orderStatus === "IN_PROGRESS") {
										all = <TableCell style={{ fontWeight: "900", color: "green" }} >   {orderStatus}  </TableCell>
										ico1 = <IconButton className="text-success px-2" title="AllMost Ready" aria-label="AlmostReady" onClick={() => onAlmostReadyOrderHandler(order._id)}> <i class="zmdi zmdi-timer"></i></IconButton>
										ico2 = null;
									}
									if (orderStatus === "REJECTED") {
										all = <TableCell style={{ fontWeight: "900", color: "red" }} >   {orderStatus}  </TableCell>
										ico1 = null;
										ico2 = null;
									}
									if (orderStatus === "READY") {
										all = <TableCell style={{ fontWeight: "900", color: "green" }} >   {orderStatus}   </TableCell>
										ico1 = <IconButton className="text-success px-2" aria-label="Successful" onClick={() => onReadyHandler(order._id)}><i class="zmdi zmdi-thumb-up"></i></IconButton>
										ico2 = null;
									}
									if (orderStatus === "SUCCESSFUL") {
										all = <TableCell style={{ fontWeight: "900", color: "green" }} >   {orderStatus}   </TableCell>
										ico1 = null;
										ico2 = null;
									}
									return (
										(
											<TableRow hover key={index}>

												<TableCell> {customerName} </TableCell>
												<TableCell> {delivery === false ? "PickUp" : "Delivery"} </TableCell>
												<TableCell> {customerNumber} </TableCell>
												<TableCell> {notes} </TableCell>
												<TableCell> {price}  </TableCell>
												<TableCell>
													<button className={'text-center btn btn-send btn-block'}
														onClick={() => ModalOpenHandler(order)} > View Orders </button>
												</TableCell>
												{/* <TableCell> {price} </TableCell> */}
												<TableCell> <button className="text-center btn btn-send btn-block"
													onClick={() => MapModalHandler(order)}
												>
													View Map
												</button> </TableCell>
												{all}
												<TableCell>
													<div className="mr-2">
														{
															ico1
														}
														{
															ico2
														}
													</div>
												</TableCell>
											</TableRow>
										)
									)
								})
							}
						</Fragment>
					</TableBody>
				</Table>
			)
		}
		return vendorTable;

	}

	return (
		<div>
			<ApiError show={isApiError} error={isMsgError} />
			{modal}
			{mapModal}
			<PageTitleBar title='Orders' match={props.match} />
			<RctCollapsibleCard heading="Orders list" fullBlock>
				<Tabs>
					<TabList>
						<Tab>Total Orders</Tab>
						<Tab>Under Approval Orders</Tab>
						<Tab>Rejected Orders </Tab>
						<Tab>In Progress Orders</Tab>
						{/*<Tab>Almost Ready Orders</Tab>*/}
						<Tab>Ready Orders</Tab>
						<Tab>Successful Orders</Tab>

					</TabList>
					<TabPanel>
						<div className="table-responsive">
							{
								getOrderTable(orders)
							}
						</div>
					</TabPanel>
					<TabPanel>
						<div className="table-responsive">
							{
								getOrderTable(underApprovalOrder)
							}
						</div>
					</TabPanel>
					<TabPanel>
						<div className="table-responsive">
							{
								getOrderTable(rejectedOrder)
							}
						</div>
					</TabPanel>
					<TabPanel>
						<div className="table-responsive">
							{
								getOrderTable(inProgressOrder)
							}
						</div>
					</TabPanel>
					{/*<TabPanel>*/}
					{/*	<div className="table-responsive">*/}
					{/*		{*/}
					{/*			getOrderTable(AlmostReadyOrder)*/}
					{/*		}*/}
					{/*	</div>*/}
					{/*</TabPanel>*/}
					<TabPanel>
						<div className="table-responsive">
							{
								getOrderTable(readyOrder)
							}
						</div>
					</TabPanel>
					<TabPanel>
						<div className="table-responsive">
							{
								getOrderTable(successfulOrder)
							}
						</div>
					</TabPanel>
				</Tabs>
			</RctCollapsibleCard>
		</div>
	);
};
export default (GoogleApiWrapper({
	apiKey: process.env.REACT_APP_GOOGLE_MAP_API
})(Customers));
