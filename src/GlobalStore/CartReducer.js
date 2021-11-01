export const reducer = (state, action) => {

    const { shoppingCart, totalAmount, totalQuantity } = state;

    let product;
    let index;
    let updatedPrice;
    let updatedQty;

    let cart = JSON.parse(localStorage.getItem('cart'))

    switch (action.type) {

        case 'ADD_TO_CART':
            let check;
            if (!cart) {

                check = false

            }
            else {
                check = cart.find(
                    product => product._id === action.id
                )
            }

            if (check) {

                return {
                    state
                }
            }
            else {
                product = action.cartData;
                console.log(product)
                product.Quantity = 1
                let indQty = 1
                updatedQty = parseInt(totalQuantity) + 1;
                updatedPrice = totalAmount + product.Productprice;
                let UpdatedCart
                if ( cart && cart.length > 0) {
                     UpdatedCart = [product, ...cart,]
                } else {
                     UpdatedCart = [product]
                }
                console.log(cart)
                localStorage.setItem('cart', JSON.stringify(UpdatedCart))
                return {
                    shoppingCart: UpdatedCart,
                    totalAmount: updatedPrice,
                    totalQuantity: updatedQty,
                    indQty: indQty
                }
            }

        case 'INC':
            product = cart.map((currElem) => {
                if (currElem._id === action.id) {
                    return {
                        ...currElem,
                        Quantity: currElem.Quantity + 1,
                    }
                }
                return currElem
            })
            console.log(product)
            updatedQty = totalQuantity + 1
            index = cart.findIndex(cart => cart._id === action.id)
            updatedPrice = totalAmount + product[index].productPrice
            localStorage.setItem('cart', JSON.stringify(product))

            return {
                ...state,
                shoppingCart: [...product],
                totalQuantity: updatedQty,
                totalAmount: updatedPrice
            }

        case 'DRC':
            //    let cart = JSON.parse(localStorage.getItem('cart'))
            product = cart.map((currElem) => {
                if (currElem._id === action.id) {
                    return {
                        ...currElem,
                        Quantity: currElem.Quantity - 1,
                    }
                }
                return currElem
            })
            updatedQty = totalQuantity - 1;
            index = cart.findIndex(cart => cart._id === action.id)
            updatedPrice = totalAmount - product[index].productPrice;
            localStorage.setItem('cart', JSON.stringify(product))

            return {
                ...state,
                shoppingCart: [...product],
                totalQuantity: updatedQty,
                totalAmount: updatedPrice
            }

        case 'TRASH':
            localStorage.setItem('cart', JSON.stringify(cart.filter(
                product => product._id !== action.id
            )))
            const filtered = shoppingCart.filter(
                product => product._id !== action.id
            )
            product = action.val;
            updatedQty = totalQuantity - product.Quantity;
            updatedPrice = totalAmount - product.price * product.Quantity;
            return {
                shoppingCart: [...filtered],
                totalAmount: updatedPrice,
                totalQuantity: updatedQty
            }
        default:
            return {
                ...shoppingCart
            }

    }

}
