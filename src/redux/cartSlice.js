import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",

    initialState,

    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;

            const existingProduct = state.items.find(
                (item) => item.id === product.id
            );

            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                state.items.push({
                    ...product,
                    quantity: 1,
                });
            }
        },

        removeFromCart: (state, action) => {
            state.items = state.items.filter(
                (item) => item.id !== action.payload
            );
        },

        increaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item) {
                item.quantity += 1;
            }
        },

        decreaseQuantity: (state, action) => {
            const item = state.items.find(
                (item) => item.id === action.payload
            );

            if (item && item.quantity > 1) {
                item.quantity -= 1;
            }
        },

        clearCart: (state) => {
            state.items = [];
        },

        // localStorage se cart restore karne ke liye
        setCart: (state, action) => {
            state.items = action.payload;
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    setCart,
} = cartSlice.actions;

export default cartSlice.reducer;