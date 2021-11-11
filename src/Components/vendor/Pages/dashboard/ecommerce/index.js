import React, { useState, useEffect } from 'react';
import axios from "axios";
import { DailyUsersAreaChart, WeeklyUsersAreaChart, MonthlyUsersAreaChart } from "../../../../../lib/vendor/Widget/SalesAreaChart";
import RctCollapsibleCard from "../../../../../lib/admin/RctCollapsibleCard/RctCollapsibleCard";
import RecentOrdersWidget from "../../../../../lib/admin/Widget/RecentOrders";
import BookingInfo from "../../../../../lib/admin/Widget/BookingInfo"
import TodayOrdersStats from "../../../../../lib/admin/Widget/TodayOrdersStats";
import ApiError from "../../../../../lib/ApiError/ApiError"
import "./index.css";

const VendorDashboard = () => {

   const token = localStorage.getItem('vendorToken');
   const [dailySales, setDailySales] = useState(0)
   const [weeklySales, setWeeklySales] = useState(0)
   const [monthlySales, setMonthlySales] = useState(0)
   const [isApiError, setIsApiError] = useState(false)
   const [isMsgError, setIsMsgError] = useState(null)

   useEffect(() => {
      axios.get('/vendor/sales-orders', { headers: { "Authorization": `Bearer ${token}` } })
         .then((res) => {
            setDailySales(res.data.dailySales)
            setMonthlySales(res.data.monthlySales)
            setWeeklySales(res.data.weeklySales)
         })
         .catch((err) => {
            setIsApiError(true)
            setIsMsgError(err.message)
            console.log("VENDORS SALES ORDER GET", err)
         })
   }, [])

   return (
      <>
         <ApiError show={isApiError} error={isMsgError} />

         <title>Dashboard</title>
         <div className="row justify-content-center">
            <div className="col-sm-4 col-md-4 w-xs-full">
               <DailyUsersAreaChart data={dailySales} />
            </div>
            <div className="col-sm-4 col-md-4 w-xs-full">
               <WeeklyUsersAreaChart data={weeklySales} />
            </div>
            <div className="col-sm-4 col-md-4 w-xs-full">
               <MonthlyUsersAreaChart data={monthlySales} />
            </div>
         </div>

         <div className="d-flex ">
            <div className={''}>
               <RctCollapsibleCard
                  colClasses="col-md-12"
                  heading={"Recent Orders"}
                  reloadable
                  fullBlock
               >
                  <RecentOrdersWidget />
               </RctCollapsibleCard>
            </div>
            <div className={'vendor-dash'}>
               <TodayOrdersStats />
               <BookingInfo />
            </div>
         </div>
      </>
   )
}
export default VendorDashboard;


