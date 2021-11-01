import React, { useEffect, useState } from 'react';
import axios from "axios";
import ApiError from "../../../lib/ApiError/ApiError"

function RecentOrders() {

   const [totalVendors, setTotalVendors] = useState([])
   const [isApiError, setIsApiError] = useState(false)
   const token = localStorage.getItem('adminToken');

   useEffect(() => {
      axios.get('/admin/vendors', { headers: { "Authorization": `Bearer ${token}` } })
         .then((res) => {
            console.log(res.data)
            setTotalVendors(res.data)
         })
         .catch((err) => {
            setIsApiError(true)
         })
   }, [])

   return (
      <>
         <ApiError show={isApiError} />
         <div className="table-responsive">
            <table className="table table-hover mb-0">
               <thead>
                  <tr>
                     <th>Shop Name</th>
                     <th>Vendor Email</th>
                     <th>Shop Address</th>
                     <th>Status</th>
                  </tr>
               </thead>
               <tbody>
                  {totalVendors && totalVendors.map((vendor, key) => {
                     let status;
                     if (vendor.shop.shopStatus === "ACTIVE") {
                        status = (
                           <span style={{
                              color: "green",
                              fontWeight: "bold"
                           }}> {vendor.shop.shopStatus} </span>
                        )
                     }
                     if (vendor.shop.shopStatus === "INACTIVE") {
                        status = (
                           <span style={{
                              color: "red",
                              fontWeight: "bold"
                           }}> {vendor.shop.shopStatus} </span>
                        )
                     }

                     return (
                        <tr key={key}>
                           <td>
                              <span className="fs-12">{vendor.shop.shopName}</span>
                           </td>
                           <td>
                              <span className="fs-12">{vendor.email}</span>
                           </td>
                           <td>
                              <span className="fs-12">{vendor.shop.address}</span>
                           </td>
                           <td>
                              {
                                 status
                              }
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </>
   );
}
export default RecentOrders;