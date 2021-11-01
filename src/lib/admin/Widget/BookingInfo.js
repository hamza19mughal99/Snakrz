import React, { useEffect, useState } from 'react';
import { Card } from 'reactstrap';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import axios from "axios"


const BookingInfo = () => {

    const [totalCompleted, setTotalCompleted] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    
    const token = localStorage.getItem('vendorToken');

    useEffect(() => {
        axios.get('/vendor/count-orders', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                setTotalCompleted(res.data.completedOrders)
                setTotalPending(res.data.pendingOrders)
            })
    }, [])



    return (
        <Card className="rct-block">
            <List className="p-0 fs-14">
                <ListItem className="d-flex justify-content-between border-bottom  align-items-center p-15">
                    <span style={{ color: "green", fontWeight: "900" }}>
                        <i className="material-icons mr-25 text-success fs-14">check_box</i>
                        COMPLETED
                    </span>
                    <span>{totalCompleted}</span>
                </ListItem>
                <ListItem className="d-flex justify-content-between align-items-center border-bottom p-15">
                    <span style={{ color: "red", fontWeight: "900" }}>
                        <i className="material-icons mr-25 fs-14 text-primary">add_to_photos</i>
                        PENDING
                    </span>
                    <span>{totalPending}</span>
                </ListItem>
            </List>
        </Card>
    );
}

export default BookingInfo;