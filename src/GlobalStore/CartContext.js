import React, { createContext , useReducer} from 'react';
import {reducer} from "./CartReducer";

export const CartContext = createContext()

const CartContextProvider = (props) => {
   
const [state, dispatch] = useReducer(reducer, {
    shoppingCart: [],
    totalAmount: 0,
    totalQuantity: 0,
})
    return (
        <div>
            <CartContext.Provider value={{ ...state, dispatch }}>
                 {props.children}
            </CartContext.Provider>
        </div>
    )
}

export default CartContextProvider;
