import React, { createContext } from 'react';
import { Menu } from "../Components/customer/Pages/Restaurant/MenuData";

export const ProductContext = createContext()

const ProductContextProvider = (props) => {

    return (
        <>
            <ProductContext.Provider value={
               {menu: [...Menu]}
            }>
               {props.children}
            </ProductContext.Provider>
        </>
    )
}

export default ProductContextProvider;