"use client";

import { useEffect, useState } from "react";
import {
    Provider,
    useSelector,
    useDispatch,
} from "react-redux";

import { store } from "@/redux/store";
import { setCart } from "@/redux/cartSlice";

function CartPersistence({ children }) {
    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const [hydrated, setHydrated] = useState(false);

    // localStorage se cart load
    useEffect(() => {
        try {
            const savedCart =
                localStorage.getItem("cart");

            if (savedCart) {
                const parsedCart =
                    JSON.parse(savedCart);

                if (Array.isArray(parsedCart)) {
                    dispatch(setCart(parsedCart));
                }
            }
        } catch (error) {
            console.error(
                "Cart restore error:",
                error
            );
        } finally {
            setHydrated(true);
        }
    }, [dispatch]);

    // Redux → localStorage
    useEffect(() => {
        if (!hydrated) {
            return;
        }

        try {
            localStorage.setItem(
                "cart",
                JSON.stringify(cartItems)
            );
        } catch (error) {
            console.error(
                "Cart save error:",
                error
            );
        }
    }, [cartItems, hydrated]);

    return children;
}

export default function StoreProvider({
    children,
}) {
    return (
        <Provider store={store}>
            <CartPersistence>
                {children}
            </CartPersistence>
        </Provider>
    );
}