"use client";

import Link from "next/link";
import { useSelector } from "react-redux";

export default function CartIcon() {
    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + (Number(item.quantity) || 1),
        0
    );

    return (
        <Link
            href="/cart"
            className="relative flex items-center justify-center"
            aria-label={`Cart with ${cartCount} items`}
        >
            {/* Cart Icon */}
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M6 8h12l1 12H5L6 8Z" />
                <path d="M9 8a3 3 0 0 1 6 0" />
            </svg>

            {/* Count */}
            {cartCount > 0 && (
                <span
                    className="
                        absolute
                        -right-2
                        -top-2
                        flex
                        h-5
                        min-w-5
                        items-center
                        justify-center
                        rounded-full
                        bg-[#9a6845]
                        px-1
                        text-[10px]
                        font-bold
                        text-white
                    "
                >
                    {cartCount > 99 ? "99+" : cartCount}
                </span>
            )}
        </Link>
    );
}