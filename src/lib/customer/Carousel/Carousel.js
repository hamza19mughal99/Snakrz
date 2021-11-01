import React from 'react';
import Slider from 'react-slick'
import "./carousel.css";
const Carousel = props => {

	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 3,
		initialSlide: 0,
		responsive: [
			{
				breakpoint: 1024,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				}
			},
			{
				breakpoint: 940,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 3,
				}
			},
			{
				breakpoint: 767,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 2
				}
			},
			{
				breakpoint: 575,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1
				}
			}
		]
	};

console.log(props.images)
	return (
		<div>
			<Slider {...settings}>
				{
					props.images.map((image, index) => (
						<div key={index}>
							<img  className=" carousel-img img-fluid" alt="img" src={image.avatar} />
						</div>
					))
				}
			</Slider>

		</div>
	);
};

export default Carousel;

