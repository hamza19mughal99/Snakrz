import React, { Fragment, useState, useEffect } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import axios from "axios";
import { Tabs, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loader from "../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../lib/ApiError/ApiError"
import "../../../../assets/style.css";

const Refunds = (props) => {

    const columns = ['Customer Name', 'Email', 'Phone', 'Restaurant Name', 'Total Price', 'isRefunded', 'Action'];
    const [isApiError, setIsApiError] = useState(false)
    const [loader, setLoader] = useState(false)
    const [refunds, setRefunds] = useState(null)


    useEffect(() => {

        axios.get('/admin/rejected-orders')
            .then((res) => {
                console.log(res.data)
                setRefunds(res.data)
            })
            .catch((err) => {
                setIsApiError(err.message)
            })

    }, [!loader])


    const refundModalHandler = (paymentIntentId, orderId) => {

        let refundData = {
            paymentIntentId,
            orderId
        }

        axios.post('/refund', refundData)
            .then((res) => {
                setLoader(true)

            })

    }

    let data = <Loader style="text-center" />

    if (refunds && refunds.length === 0) {
        data = <p style={{ fontWeight: "bold" }} className={'text-center'}>No Refunds Found</p>
    }

    if (refunds && refunds.length > 0) {
        data = (
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
                            refunds.map((customer, index) => {
                                console.log(customer.paymentIntentId)


                                const { totalPrice, isRefunded, paymentIntentId } = customer;
                                return (
                                    (
                                        <TableRow hover key={index + 1}>
                                            <TableCell> {customer.customer.name} </TableCell>
                                            <TableCell> {customer.customer.email} </TableCell>
                                            <TableCell> {customer.customer.phoneNumber} </TableCell>
                                            <TableCell> {customer.shop.shopName} </TableCell>
                                            <TableCell> {totalPrice} </TableCell>
                                            <TableCell> {isRefunded} </TableCell>
                                            <TableCell>
                                                {
                                                    isRefunded === 'false' ?
                                                        <button onClick={() => refundModalHandler(customer.paymentIntentId, customer._id)} className={'btn-send'}> Refund </button>
                                                        : null
                                                }
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
    return (
        <div>
            <ApiError show={isApiError} />
            <PageTitleBar title='customers' match={props.match} />
            <div className={'mt-5'}>
                <RctCollapsibleCard heading="Refunds list" fullBlock>
                    <Tabs>
                        <TabPanel>
                            <div className="table-responsive">
                                {
                                    data
                                }
                            </div>
                        </TabPanel>
                    </Tabs>
                </RctCollapsibleCard>
            </div>

        </div>
    );
}
export default Refunds;
