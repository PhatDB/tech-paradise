import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface Customer {
    customerId: number;
    email: string;
    customerName: string;
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
}

interface AuthState {
    customer: Customer | null;
}

const initialState: AuthState = {
    customer: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCustomer(state, action: PayloadAction<Customer>) {
            state.customer = action.payload;
        },
        logout(state) {
            state.customer = null;
        },
    },
});

export const {setCustomer, logout} = authSlice.actions;
export default authSlice.reducer;
