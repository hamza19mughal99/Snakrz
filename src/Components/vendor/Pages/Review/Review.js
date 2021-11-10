import React, { Fragment, useEffect, useState } from 'react';
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import IntlMessages from "../../../../Util/IntlMessages";
import axios from "axios";
import Loader from "../../../../lib/customer/Loader/Loader";
import RatingStar from "../../../../lib/customer/RatingStar/RatingStar";

const Review = props => {
    const columns = ['Customer Name', 'Comment', 'Rating'];
    const [reviews, setReviews] = useState(null);
    const [loader, setLoader] = useState(false);


    const token = localStorage.getItem('vendorToken');


    useEffect(() => {
        setLoader(true);
        axios.get('/vendor/reviews', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log("reviews", res.data)
                setReviews(res.data)
            })

    }, [!loader])

    const getReviewsTable = (reviews) => {

        let reviewTable = (
            <Loader style={'text-center'} />
        );

        if (reviews && reviews.length === 0) {
            reviewTable = <p className={'text-center'}>No Reviews Found</p>
        }

        if (reviews && reviews.length > 0) {
            reviewTable = (
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
                                reviews.map((review, index) => {
                                    return (
                                        (
                                            <TableRow hover key={index}>
                                                <TableCell> {review.customerId.name} </TableCell>
                                                <TableCell> {review.comment} </TableCell>
                                                <TableCell> <RatingStar value={parseInt(review.rating)} /> </TableCell>
                                                {/* <TableCell> {[...Array(reviews.rating)].map(() => (
                                                    <i className="zmdi zmdi-star-circle px-1" />
                                                ))} </TableCell> */}
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
        return reviewTable;

    }

    return (
        <>
            <div className="data-table-wrapper">
                <PageTitleBar title={<IntlMessages id="sidebar.review" />} match={props.match} />
                <div style={{ marginTop: '12px' }}>
                    <RctCollapsibleCard heading="Review list" fullBlock>
                        <div className="table-responsive">
                            {
                                getReviewsTable(reviews)
                            }
                        </div>

                    </RctCollapsibleCard>
                </div>
            </div>
        </>
    );
};

export default Review;


