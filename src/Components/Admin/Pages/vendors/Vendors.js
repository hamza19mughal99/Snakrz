import React, { useState, useEffect, Fragment } from 'react';
import PageTitleBar from "../../../../lib/vendor/PageTitleBar/PageTitleBar";
import RctCollapsibleCard from "../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import axios from "axios";
import { useToasts } from "react-toast-notifications";
import { adminActive, adminInActive } from "../../../../lib/customer/Toaster/Toaster";
import ApiError from "../../../../lib/ApiError/ApiError"
import Loader from "../../../../lib/customer/Loader/Loader";
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';

const Vendors = (props) => {
    const columns = ['ShopName', 'VendorEmail', 'ShopAddress', 'Status', 'Actions'];

    const [allVendors, setAllVendors] = useState(null);
    const [visibleVendors, setVisibleVendors] = useState(null);
    const [invisibleVendors, setInvisibleVendors] = useState(null);
    const [loader, setLoader] = useState(false);
    const [isApiError, setIsApiError] = useState(false)
    const [isMsgError, setIsMsgError] = useState(null)

    const { addToast } = useToasts()

    useEffect(() => {
        setLoader(true);
        axios.get('/admin/vendors')
            .then((res) => {
                setAllVendors(res.data)
            })
            .catch((err)=>{
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("ADMIN ALL VENDORS GET", err)
            })

        axios.get('/admin/active-vendors')
            .then((res) => {
                setVisibleVendors(res.data)
            })
            .catch((err)=>{
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("ADMIN ACTIVE VENDORS GET", err)
            })

        axios.get('/admin/inActive-vendors')
            .then((res) => {
                setInvisibleVendors(res.data)
            })
            .catch((err)=>{
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("ADMIN INACTIVE VENDORS GET", err)
            })

    }, [!loader])

    const VisiblibiltyHandler = (id) => {
        setLoader(false)
        axios.put('/admin/to-active/' + id)
            .then((res) => {
                setLoader(true)
                adminActive(addToast)
            })
            .catch((err)=>{
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("ADMIN ACTIVE VENDORS PUT", err)
            })
    }
    const InVisibiltyHandler = (id) => {
        setLoader(false)
        axios.put('/admin/to-inActive/' + id)
            .then((res) => {
                setLoader(true)
                adminInActive(addToast)
            })
            .catch((err)=>{
                setIsApiError(true)
                setIsMsgError(err.message)
                console.log("ADMIN INACTIVE VENDORS PUT", err)
            })
    }

    const getvendorTable = (vendors) => {
        
        let vendorTable = <Loader style={'text-center mt-5'} />

        if (vendors && vendors.length === 0) {
            vendorTable = <p style={{fontWeight: "bold"}} className={'text-center'}>No Vendors Found</p>
        }

        if (vendors && vendors.length > 0) {
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
                                vendors.map((vendor, index) => {
                                    let shopName, shopAddress, shopStatus, id, email, all, icon1;
                                    console.log(vendor)
                                    if (vendor) {
                                        shopName = vendor.shop.shopName
                                        shopAddress = vendor.shop.address
                                        email = vendor.email;
                                        shopStatus = vendor.shop.shopStatus
                                        id = vendor.shop._id
                                    }
                                    if (shopStatus === "ACTIVE") {
                                        all = <TableCell style={{ fontWeight: "900", color: "green" }}>   {shopStatus}  </TableCell>
                                        icon1 = <VisibilityOffIcon style={{ cursor: "pointer" }} onClick={() => InVisibiltyHandler(id)} />
                                    }
                                    if (shopStatus === "INACTIVE") {
                                        all = <TableCell style={{ fontWeight: "900", color: "red" }} >   {shopStatus}   </TableCell>
                                        icon1 = <VisibilityIcon style={{ cursor: "pointer" }} onClick={() => VisiblibiltyHandler(id)} />
                                    }
                                    return (
                                        (
                                            <TableRow hover key={index}>
                                                <TableCell> {shopName} </TableCell>
                                                <TableCell> {email} </TableCell>
                                                <TableCell> {shopAddress} </TableCell>
                                                {all}
                                                <TableCell>
                                                    <div className="mr-2">
                                                        {
                                                            icon1
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
            <PageTitleBar title='vendors' match={props.match} />
            <RctCollapsibleCard heading="Customers list" fullBlock>
                <Tabs>
                    <TabList>
                        <Tab>All Vendors</Tab>
                        <Tab>Active Vendors</Tab>
                        <Tab>InActive Vendors</Tab>
                    </TabList>
                    <TabPanel>
                        <div className="table-responsive">
                            {
                                getvendorTable(allVendors)
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="table-responsive">
                            {
                                getvendorTable(visibleVendors)
                            }
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="table-responsive">
                            {
                                getvendorTable(invisibleVendors)
                            }
                        </div>
                    </TabPanel>
                </Tabs>
            </RctCollapsibleCard>
        </div>
    );
}
export default Vendors;
