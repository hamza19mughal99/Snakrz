import React from 'react';
import Cat1 from "../../../../assets/customer/img/cat1.png";
import Cat2 from "../../../../assets/customer/img/cat1.png";
import Cat3 from "../../../../assets/customer/img/cat1.png";
import Cat4 from "../../../../assets/customer/img/cat1.png";
import "../../../../assets/style.css";

const Common = (props) => {

    const pictures = [
        {
            id: 1,
            img: Cat1
        },
        {
            id: 2,
            img: Cat2
        },
        {
            id: 3,
            img: Cat3
        },
        {
            id: 4,
            img: Cat4
        },
        {
            id: 1,
            img: Cat2
        },
        {
            id: 2,
            img: Cat1
        },
        {
            id: 3,
            img: Cat3
        },
        {
            id: 4,
            img: Cat4
        },
        {
            id: 1,
            img: Cat3
        },
        {
            id: 2,
            img: Cat4
        },
        {
            id: 3,
            img: Cat2
        },
        {
            id: 4,
            img: Cat1
        },
    ]

    return (
        <>
            <section className="cate-banner-section">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12 text-center">
                            <div className="heading-text">
                                <h1>{props.name}</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <div className=" cata-product-section py-5">
                <div className="container">
                    <div className="row">
                        {
                            pictures.map((val) => {
                                return (
                                    <>
                                        <div className="col-md-3 mb-5">
                                            <div className="pro-img">
                                                <img src={val.img}  alt={'img'}/>
                                            </div>
                                            <div className="pro-head">
                                                <p className="text-center">{props.name}</p>
                                            </div>
                                        </div>

                                    </>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </>
    )
}
export default Common
