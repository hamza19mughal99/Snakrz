import React, { useEffect, useState } from 'react';
import axios from "axios";
import CountUp from 'react-countup';
import { RctCardContent } from '../../../lib/vendor/RctCard';

const TotalOrderStats = () => {

    const [todayOrders, setTodayOrders] = useState(0);

    const token = localStorage.getItem('vendorToken');

    useEffect(() => {
        axios.get('/vendor/today-orders', { headers: { "Authorization": `Bearer ${token}` } })
            .then((res) => {
                console.log(res.data)
                setTodayOrders(res.data)
            })
    }, [])

    return (
        <div className="current-widget bg-primary">
            <RctCardContent>
                <div className="d-flex justify-content-between">
                    <div className="align-items-start">
                        <h3 className="mb-10">Today Orders</h3>
                        <h2 className="mb-0">
                            {
                                todayOrders ? <CountUp
                                    start={0}
                                    end={todayOrders}
                                    duration={1}
                                /> : <CountUp
                                    start={0}
                                    end={0}
                                    duration={2}
                                />
                            }
                        </h2>
                    </div>
                    <div className="align-items-end">
                        <i className="zmdi zmdi-time"></i>
                    </div>
                </div>
            </RctCardContent>
        </div>
    )
};

export default TotalOrderStats;
