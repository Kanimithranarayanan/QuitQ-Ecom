import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./store/reducer/productReducer";
import { sellerReducer } from "./store/reducer/sellerReducer";
import { customerReducer } from "./store/reducer/customerReducer";
import { orderReducer } from "./store/reducer/orderReducer";
import { cartReducer } from "./store/reducer/cartReducer";
import { reviewReducer } from "./store/reducer/reviewReducer";

export const store = configureStore({
    reducer: {
        products: productReducer,
        sellers: sellerReducer,
        customers: customerReducer,
        orders: orderReducer,
        cart: cartReducer,
        reviews: reviewReducer,
    }
})
