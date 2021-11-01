import React, { Fragment, useState, useEffect } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import axios from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Loader from "../../../../lib/customer/Loader/Loader";
import ApiError from "../../../../lib/ApiError/ApiError"
import "../../../../assets/style.css";

const Customers = (props) => {

    const columns = ['Name', 'Email', 'Phone'];
    const [allCustomer, setAllCustomer] = useState(null)
    const [isApiError, setIsApiError] = useState(false)

    useEffect(() => {
        axios.get('/admin/customers')
            .then((res) => {
                setAllCustomer(res.data)
            })
            .catch((err) => {
                setIsApiError(true)
            })
    }, [])

    let data = <Loader style="text-center" />

    if (allCustomer && allCustomer.length === 0) {
        data = <p style={{ fontWeight: "bold" }} className={'text-center'}>No Customers Found</p>
    }

    if (allCustomer && allCustomer.length > 0) {
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
                            allCustomer.map((customer, index) => {
                                console.log(customer)
                                const { id, name, email, phoneNumber } = customer;
                                return (
                                    (
                                        <TableRow hover key={id}>
                                            <TableCell> {name} </TableCell>
                                            <TableCell> {email} </TableCell>
                                            <TableCell> {phoneNumber} </TableCell>
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
                <RctCollapsibleCard heading="Customers list" fullBlock>
                    <Tabs>
                        <TabList>
                            <Tab>All Customers List</Tab>
                        </TabList>
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
export default Customers;
