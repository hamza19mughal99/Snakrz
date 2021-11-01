import React from 'react';
import RctCollapsibleCard from "../../../../../lib/vendor/RctCollapsibleCard/RctCollapsibleCard";
import RecentOrdersWidget from "../../../../../lib/vendor/Widget/RecentOrders";
import BookingInfo from "../../../../../lib/vendor/Widget/BookingInfo"

const EcommerceDashboard = () => {
   
   return (
      <>
         <div className="ecom-dashboard-wrapper ">
            <title>Dashboard</title>

            <div className="d-flex flex-wrap">
               <div >
                  <RctCollapsibleCard
                     colClasses="col-sm-12 col-md-12 col-lg-12 "
                     heading={"Total Vendors"}
                     collapsible
                     reloadable
                     closeable
                     fullBlock
                  >
                     <RecentOrdersWidget />
                  </RctCollapsibleCard>
               </div>
               <div style={{width: "35%"}}>
                  <BookingInfo />
               </div>
            </div>
         </div>
      </>
   )
}
export default EcommerceDashboard;

