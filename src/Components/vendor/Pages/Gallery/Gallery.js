import React, { useEffect, useState } from 'react';
import { Card, Col, Form, Row } from "react-bootstrap";
import Loader from "../../../../lib/customer/Loader/Loader";
import { useToasts } from "react-toast-notifications";
import { vendorMainImage, vendorBannerImage } from "../../../../lib/customer/Toaster/Toaster";
import ApiError from "../../../../lib/ApiError/ApiError"
import axios from "axios";

const Gallery = () => {

	const { addToast } = useToasts()

	const token = localStorage.getItem('vendorToken');
	const [mainLoader, setMainLoader] = useState(false);
	const [bannerLoader, setBannerLoader] = useState(false);
	const [images, setImages] = useState(null);
	const [shopMainImage, setShopMainImage] = useState('');
	const [shopBannerImage, setShopBannerImage] = useState('')
	const [isApiError, setIsApiError] = useState(false)
	const [isMsgError, setIsMsgError] = useState(null)

	useEffect(() => {
		axios.get('/vendor/shop-images', { headers: { "Authorization": `Bearer ${token}` } })
			.then((res) => {
				console.log(res.data)
				setImages(res.data)
			})
			.catch((err) => {
				setIsApiError(true)
				setIsMsgError(err.message)
				console.log("GALLERY GET", err)
			})
	}, [mainLoader, bannerLoader])


	const onChange = (e) => {
		setShopMainImage(e.target.files[0])
	}
	const onBannerChange = (e) => {
		setShopBannerImage(e.target.files[0])
	}

	const onSubmit = (e, whichImage) => {
		e.preventDefault();
		const formData = new FormData();
		if (whichImage === 'bannerImg') {
			setBannerLoader(true)
			formData.append('shopBannerImage', shopBannerImage)
			axios.put('/vendor/banner-image', formData, { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					setBannerLoader(false)
					vendorBannerImage(addToast)
					setShopBannerImage('');
				})
				.catch((err) => {
					setIsApiError(true)
					setIsMsgError(err.message)
					console.log("VENDOR BANNER IMAGE PUT", err)
				})
		}

		if (whichImage === 'mainImg') {
			setMainLoader(true)
			formData.append('shopImage', shopMainImage)
			axios.put('/vendor/main-image', formData, { headers: { "Authorization": `Bearer ${token}` } })
				.then((res) => {
					setMainLoader(false)
					vendorMainImage(addToast)
					setShopMainImage('');
				})
				.catch((err) => {
					setIsApiError(true)
					setIsMsgError(err.message)
					console.log("VENDOR MAIN IMAGE PUT", err)
				})
		}
	}

	let gallery = (
		<div className={'progress__bar'}>
			<Loader />
		</div>
	)
	let mainImage = <Loader style={'text-center'} />
	let bannerImage = <Loader style={'text-center'} />

	if (!bannerLoader && images) {
		bannerImage = (
			<div className={'text-center'}>
				<img alt={'shopBanner'} className={'img-fluid p-4'} src={images.shopBannerImage.avatar} />
			</div>
		)
	}
	if (!mainLoader && images) {
		mainImage = (
			<div className={'text-center'}>
				<img alt={'shopMain'} className={'img-fluid p-4'} src={images.shopImage.avatar} />
			</div>
		)
	}

	if (images) {
		gallery = (
			<>
				<Card>
					<Card.Header><h2>Restaurant Banner Image</h2></Card.Header>
					<Card.Body>
						<Row>
							<Col md={12}>
								<Form onSubmit={(e) => onSubmit(e, 'bannerImg')}>
									<div className={'form-row align-items-center'}>
										<Col md={10}>
											<div className="input-group main__img_input">
												<div className="input-group-prepend">
													<span className="input-group-text">Shop Banner Image</span>
												</div>
												<div className="custom-file">
													<input type="file" required className="custom-file-input" id="inputGroupFile01" onChange={onBannerChange} />
													<label className="custom-file-label" htmlFor="inputGroupFile01">{shopBannerImage.name}</label>
												</div>
											</div>
										</Col>
										<Col md={2}>
											<div className={'text-center'}>
												<button type={'submit'} className={'btn btn-send btn-block px-4'}>Upload</button>
											</div>
										</Col>
									</div>
								</Form>
							</Col>
							<Col md={12}>
								{bannerImage}
							</Col>
						</Row>
					</Card.Body>
				</Card>
				<Card className={'my-4'}>
					<Card.Header> <h2>Shop Main Image</h2> </Card.Header>
					<Card.Body>
						<Row>
							<Col md={12}>
								<Form onSubmit={(e) => onSubmit(e, 'mainImg')}>
									<div className={'form-row align-items-center'}>
										<Col md={10}>
											<div className="input-group main__img_input">
												<div className="input-group-prepend">
													<span className="input-group-text">Shop Main Image</span>
												</div>
												<div className="custom-file">
													<input type="file" required className="custom-file-input" id="inputGroupFile01" onChange={onChange} />
													<label className="custom-file-label" htmlFor="inputGroupFile01">{shopMainImage.name}</label>
												</div>
											</div>
										</Col>
										<Col md={2}>
											<div className={'text-center'}>
												<button type={'submit'} className={'btn btn-send btn-block px-4'}>Upload</button>
											</div>
										</Col>
									</div>
								</Form>
							</Col>
							<Col md={12}>
								{mainImage}
							</Col>
						</Row>
					</Card.Body>
				</Card>
			</>
		)
	}
	return (
		<>
			<ApiError show={isApiError} error={isMsgError}/>
			{gallery}
		</>
	);
};
export default Gallery;