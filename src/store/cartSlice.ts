// store/cartSlice.ts
import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Cart} from '@/types/cart';

interface CartState {
    cart: Cart | null;
}

const initialState: CartState = {
    cart: null,
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        setCart(state, action: PayloadAction<Cart | null>) {
            state.cart = action.payload;
        },
        resetCart(state) {
            state.cart = null;
        },
    },
});

export const {setCart, resetCart} = cartSlice.actions;
export default cartSlice.reducer;
