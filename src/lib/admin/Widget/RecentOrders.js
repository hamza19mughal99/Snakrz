import React, { useEffect, useState } from 'react';
import axios from "axios";

function RecentOrders() {

   const [recentOrders, setRecentOrders] = useState(null)

   const token = localStorage.getItem('vendorToken');

   useEffect(() => {
      axios.get('/vendor/orders', { headers: { "Authorization": `Bearer ${token}` } })
         .then((res) => {
            console.log(res.data)
            setRecentOrders(res.data)
         })
   }, [])

   let orders;
   
   if (recentOrders && recentOrders.length === 0) {
      orders = (
         <p style={{ fontWeight: "bold" }} className={'text-center'}> No Orders Found </p>
      )
   }

   if (recentOrders && recentOrders.length > 0) {

      orders = (
         recentOrders && recentOrders.map((vendor, index) => {
            let status;
            if (vendor.orderStatus === "COMPLETED" || vendor.orderStatus === "UNDER_APPROVAL" || vendor.orderStatus === "IN_PROGRESS" || vendor.orderStatus === "ALMOST_READY" || vendor.orderStatus === "READY" || vendor.orderStatus === "SUCCESSFUL") {
               status = (
                  <span style={{
                     color: "green",
                     fontWeight: "bold"
                  }}> {vendor.orderStatus} </span>
               )
            }
            if (vendor.orderStatus === "REJECTED") {
               status = (
                  <span style={{
                     color: "red",
                     fontWeight: "bold"
                  }}> {vendor.orderStatus} </span>
               )
            }

            return (
               <tr key={index}>
                  <td>
                     <span className="fs-12">{index + 1}</span>
                  </td>
                  <td>
                     <span className="fs-12">{vendor.customer.name}</span>
                  </td>
                  <td>
                     <span className="fs-12">{vendor.customer.email}</span>
                  </td>
                  <td>
                     <span className="fs-12">{vendor.customer.phoneNumber}</span>
                  </td>
                  <td>
                     {
                        status
                     }
                  </td>
               </tr>
            )
         })
      )
   }


   return (
      <div className="table-responsive">
         <table className="table table-hover mb-0">
            <thead>
               <tr>
                  <th>Order No.</th>
                  <th>Customer Name</th>
                  <th>Customer Email</th>
                  <th>Mobile Number</th>
                  <th>Status</th>
               </tr>
            </thead>
            <tbody>

               {
                  orders
               }

            </tbody>
         </table>
      </div>
   );
}

export default RecentOrders;
