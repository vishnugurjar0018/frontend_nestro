"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "@/redux/cartSlice";

export default function AddToCartButton({ product }) {
    const [added, setAdded] = useState(false);

    const dispatch = useDispatch();

    const handleAddToCart = () => {
        // Product check
        if (!product?._id) {
            return;
        }

        try {
            // Redux me product add karo
            dispatch(
                addToCart({
                    ...product,
                    id: product._id,
                })
            );

            // Button status
            setAdded(true);

            setTimeout(() => {
                setAdded(false);
            }, 1500);

        } catch (error) {
            console.error("Add to cart error:", error);
        }
    };

    return (
        <button
            type="button"
            onClick={handleAddToCart}
            aria-label={`Add ${
                product?.name || "product"
            } to cart`}
            className="
                w-full
                rounded-xl
                border
                border-[#9a6845]
                bg-[#9a6845]
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                transition
                hover:bg-[#7f5438]
                focus:outline-none
                focus:ring-2
                focus:ring-[#9a6845]
                focus:ring-offset-2
            "
        >
            {added
                ? "Added to Cart ✓"
                : "Add to Cart"}
        </button>
    );
}