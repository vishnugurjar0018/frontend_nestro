"use client";

import Image from "next/image";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import {
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} from "@/redux/cartSlice";


/* =========================================================
   CONSTANTS
========================================================= */

const FREE_SHIPPING_LIMIT = 5000;


/* =========================================================
   FORMAT PRICE
========================================================= */

function formatPrice(value) {

    return new Intl.NumberFormat(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }
    ).format(
        Number(value) || 0
    );
}


/* =========================================================
   CART PAGE
========================================================= */

export default function CartPage() {

    const dispatch = useDispatch();

    const cartItems = useSelector(
        (state) => state.cart.items
    );


    /* =====================================================
       UPDATE QUANTITY
    ===================================================== */

    const updateQuantity = (productId, currentQuantity, nextQuantity) => {

        if (nextQuantity < 1) {
            return;
        }

        if (nextQuantity > currentQuantity) {
            dispatch(increaseQuantity(productId));
        } else if (nextQuantity < currentQuantity) {
            dispatch(decreaseQuantity(productId));
        }
    };


    /* =====================================================
       REMOVE / CLEAR CART
    ===================================================== */

    const removeItem = (productId) => {
        dispatch(removeFromCart(productId));
    };

    const handleClearCart = () => {
        dispatch(clearCart());
    };


    /* =====================================================
       CALCULATE SUBTOTAL
    ===================================================== */

    /* =====================================================
       CART PRICE TOTALS
    ===================================================== */

    const subtotal =
        cartItems.reduce(
            (
                total,
                item
            ) => {

                const salePrice =
                    Number(
                        item.finalPrice ??
                        item.salePrice ??
                        item.discountedPrice ??
                        item.price ??
                        0
                    );

                const quantity =
                    Number(
                        item.quantity ||
                        1
                    );

                return (
                    total +
                    salePrice *
                        quantity
                );

            },
            0
        );


    const originalTotal =
        cartItems.reduce(
            (
                total,
                item
            ) => {

                const salePrice =
                    Number(
                        item.finalPrice ??
                        item.salePrice ??
                        item.discountedPrice ??
                        item.price ??
                        0
                    );

                const explicitOriginal =
                    Number(
                        item.originalPrice ??
                        item.mrp ??
                        item.mrpPrice ??
                        0
                    );

                const discountPercent =
                    Number(
                        item.discountPercentage ??
                        item.discountPercent ??
                        0
                    );

                const originalPrice =
                    explicitOriginal > 0
                        ? explicitOriginal
                        : discountPercent > 0
                            ? Math.round(
                                  salePrice /
                                      (1 -
                                          discountPercent /
                                              100)
                              )
                            : salePrice;

                const quantity =
                    Number(
                        item.quantity ||
                        1
                    );

                return (
                    total +
                    originalPrice *
                        quantity
                );

            },
            0
        );


    const discount =
        Math.max(
            originalTotal -
                subtotal,
            0
        );


    /* =====================================================
       SHIPPING
    ===================================================== */

    const shipping =
        subtotal >=
        FREE_SHIPPING_LIMIT
            ? 0
            : subtotal > 0
                ? 199
                : 0;


    /* =====================================================
       TOTAL
    ===================================================== */

    const total =
        subtotal +
        shipping;


    /* =====================================================
       FREE SHIPPING PROGRESS
    ===================================================== */

    const remainingForFreeShipping =
        Math.max(
            FREE_SHIPPING_LIMIT -
                subtotal,
            0
        );


    const shippingProgress =
        Math.min(
            (
                subtotal /
                FREE_SHIPPING_LIMIT
            ) *
                100,
            100
        );


    /* =====================================================
       EMPTY CART
    ===================================================== */

    if (
        cartItems.length === 0
    ) {

        return (

            <main
                className="
                    min-h-screen
                    bg-[#faf8f5]
                    px-4
                    py-16
                    sm:px-6
                    lg:px-8
                "
            >

                <div
                    className="
                        mx-auto
                        flex
                        min-h-[65vh]
                        max-w-5xl
                        items-center
                        justify-center
                    "
                >

                    <section
                        aria-labelledby="empty-cart-title"
                        className="
                            w-full
                            max-w-xl
                            rounded-[2rem]
                            border
                            border-[#eadfd6]
                            bg-white
                            px-6
                            py-14
                            text-center
                            shadow-[0_20px_60px_rgba(65,42,27,0.06)]
                            sm:px-10
                        "
                    >

                        {/* ICON */}

                        <div
                            className="
                                mx-auto
                                flex
                                h-20
                                w-20
                                items-center
                                justify-center
                                rounded-full
                                bg-[#f4ebe3]
                                text-[#9a6845]
                            "
                        >

                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            >

                                <path
                                    d="M6 8h12l1 12H5L6 8Z"
                                />

                                <path
                                    d="M9 8a3 3 0 0 1 6 0"
                                />

                            </svg>

                        </div>


                        <p
                            className="
                                mt-7
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-[#a56f45]
                            "
                        >
                            Your Shopping Bag
                        </p>


                        <h1
                            id="empty-cart-title"
                            className="
                                mt-2
                                text-3xl
                                font-medium
                                tracking-tight
                                text-[#211812]
                            "
                        >
                            Your cart is empty
                        </h1>


                        <p
                            className="
                                mx-auto
                                mt-3
                                max-w-md
                                text-sm
                                leading-6
                                text-[#8a7b70]
                            "
                        >
                            Looks like you haven't
                            added anything yet.
                            Explore our collection
                            and find something
                            beautiful for your home.
                        </p>


                        <Link
                            href="/store"
                            className="
                                mt-8
                                inline-flex
                                h-12
                                items-center
                                justify-center
                                rounded-xl
                                bg-[#9a6845]
                                px-7
                                text-sm
                                font-semibold
                                text-white
                                shadow-sm
                                transition
                                hover:bg-[#7f5337]
                                hover:shadow-lg
                            "
                        >
                            Explore Collection
                            <span className="ml-2">
                                →
                            </span>
                        </Link>

                    </section>

                </div>

            </main>

        );

    }


    /* =====================================================
       MAIN CART
    ===================================================== */

    return (

        <main
            className="
                min-h-screen
                bg-[#faf8f5]
                px-4
                pb-20
                pt-10
                sm:px-6
                lg:px-8
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <header
                    className="
                        mb-8
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-end
                        sm:justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.25em]
                                text-[#a56f45]
                            "
                        >
                            Shopping Bag
                        </p>


                        <h1
                            className="
                                mt-2
                                text-3xl
                                font-medium
                                tracking-tight
                                text-[#211812]
                                sm:text-4xl
                            "
                        >
                            Your Cart
                        </h1>


                        <p
                            className="
                                mt-2
                                text-sm
                                text-[#8a7b70]
                            "
                        >
                            {cartItems.length}{" "}
                            {cartItems.length === 1
                                ? "item"
                                : "items"}{" "}
                            in your shopping bag
                        </p>

                    </div>


                    <Link
                        href="/store"
                        className="
                            inline-flex
                            items-center
                            text-sm
                            font-medium
                            text-[#8d6042]
                            transition
                            hover:text-[#5f3f2c]
                        "
                    >
                        ← Continue Shopping
                    </Link>

                </header>


                {/* =================================================
                    SHIPPING MESSAGE
                ================================================= */}

                <div
                    className="
                        mb-6
                        overflow-hidden
                        rounded-2xl
                        border
                        border-[#eadfd6]
                        bg-white
                        p-5
                    "
                >

                    {remainingForFreeShipping > 0 ? (

                        <>

                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-2
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                        text-[#5f5148]
                                    "
                                >
                                    Add{" "}
                                    <strong
                                        className="
                                            font-semibold
                                            text-[#2f241e]
                                        "
                                    >
                                        {formatPrice(
                                            remainingForFreeShipping
                                        )}
                                    </strong>{" "}
                                    more to unlock
                                    free shipping.
                                </p>


                                <span
                                    className="
                                        text-xs
                                        font-medium
                                        text-[#9a6845]
                                    "
                                >
                                    Free shipping
                                    over ₹5,000
                                </span>

                            </div>


                            <div
                                className="
                                    mt-4
                                    h-1.5
                                    overflow-hidden
                                    rounded-full
                                    bg-[#eee5de]
                                "
                            >

                                <div
                                    className="
                                        h-full
                                        rounded-full
                                        bg-[#9a6845]
                                        transition-all
                                    "
                                    style={{
                                        width:
                                            `${shippingProgress}%`,
                                    }}
                                />

                            </div>

                        </>

                    ) : (

                        <div
                            className="
                                flex
                                items-center
                                gap-3
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-9
                                    w-9
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#eee5de]
                                    text-[#9a6845]
                                "
                            >

                                ✓

                            </div>


                            <div>

                                <p
                                    className="
                                        text-sm
                                        font-semibold
                                        text-[#2f241e]
                                    "
                                >
                                    You've unlocked free
                                    shipping
                                </p>

                                <p
                                    className="
                                        mt-0.5
                                        text-xs
                                        text-[#8a7b70]
                                    "
                                >
                                    Enjoy complimentary
                                    delivery on your order.
                                </p>

                            </div>

                        </div>

                    )}

                </div>


                {/* =================================================
                    GRID
                ================================================= */}

                <div
                    className="
                        grid
                        grid-cols-1
                        gap-6
                        lg:grid-cols-[minmax(0,1fr)_380px]
                        lg:items-start
                    "
                >

                    {/* =================================================
                        CART ITEMS
                    ================================================= */}

                    <section
                        aria-labelledby="cart-items-heading"
                        className="
                            overflow-hidden
                            rounded-2xl
                            border
                            border-[#eadfd6]
                            bg-white
                        "
                    >

                        {/* HEADER */}

                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                border-b
                                border-[#eee5de]
                                px-5
                                py-4
                                sm:px-6
                            "
                        >

                            <div>

                                <h2
                                    id="cart-items-heading"
                                    className="
                                        text-base
                                        font-semibold
                                        text-[#211812]
                                    "
                                >
                                    Cart Items
                                </h2>

                            </div>


                            <button
                                type="button"
                                onClick={
                                    handleClearCart
                                }
                                className="
                                    text-xs
                                    font-medium
                                    text-[#8a7b70]
                                    transition
                                    hover:text-[#a14f42]
                                "
                            >
                                Clear cart
                            </button>

                        </div>


                        {/* ITEMS */}

                        <div>

                            {cartItems.map(
                                (
                                    item,
                                    index
                                ) => {

                                    const productId =
                                        item.id ||
                                        item._id ||
                                        item.productId ||
                                        index;

                                    const name =
                                        item.name ||
                                        "Untitled Product";

                                    const category =
                                        typeof item.categoryID ===
                                        "object"
                                            ? item
                                                .categoryID
                                                ?.name
                                            : item.category ||
                                              "";

                                    const image =
                                        item.thumbnail ||
                                        item.image ||
                                        item.images?.[0] ||
                                        "";

                                    // Original / Sale price
                                    /*
                                     * PRICE DATA
                                     *
                                     * Supported product fields:
                                     * originalPrice / mrp / price  -> original price
                                     * finalPrice / salePrice       -> selling price
                                     *
                                     * If your API sends a discount percentage,
                                     * we can also calculate the original price.
                                     */
                                    const salePrice =
                                        Number(
                                            item.finalPrice ??
                                            item.salePrice ??
                                            item.discountedPrice ??
                                            item.price ??
                                            0
                                        );

                                    const discountPercentFromData =
                                        Number(
                                            item.discountPercentage ??
                                            item.discountPercent ??
                                            0
                                        );

                                    const explicitOriginalPrice =
                                        Number(
                                            item.originalPrice ??
                                            item.mrp ??
                                            item.mrpPrice ??
                                            0
                                        );

                                    const originalPrice =
                                        explicitOriginalPrice > 0
                                            ? explicitOriginalPrice
                                            : discountPercentFromData > 0 &&
                                              salePrice > 0
                                                ? Math.round(
                                                      salePrice /
                                                          (1 -
                                                              discountPercentFromData /
                                                                  100)
                                                  )
                                                : salePrice;

                                    const quantity =
                                        Number(
                                            item.quantity ||
                                            1
                                        );

                                    const itemDiscount =
                                        Math.max(
                                            originalPrice -
                                                salePrice,
                                            0
                                        );

                                    const discountPercent =
                                        originalPrice > salePrice
                                            ? discountPercentFromData > 0
                                                ? Math.round(
                                                      discountPercentFromData
                                                  )
                                                : Math.round(
                                                      (itemDiscount /
                                                          originalPrice) *
                                                          100
                                                  )
                                            : 0;

                                    return (

                                        <article
                                            key={
                                                productId
                                            }
                                            className="
                                                flex
                                                gap-4
                                                border-b
                                                border-[#eee5de]
                                                p-5
                                                last:border-b-0
                                                sm:gap-5
                                                sm:p-6
                                            "
                                        >

                                            {/* IMAGE */}

                                            <Link
                                                href={
                                                    item.slug
                                                        ? `/product/${item.slug}`
                                                        : `/product/${productId}`
                                                }
                                                className="
                                                    relative
                                                    h-28
                                                    w-24
                                                    shrink-0
                                                    overflow-hidden
                                                    rounded-xl
                                                    bg-[#f2ece5]
                                                    sm:h-32
                                                    sm:w-32
                                                "
                                            >

                                                {image ? (

                                                    <Image
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            name
                                                        }
                                                        fill
                                                        sizes="
                                                            (max-width: 639px)
                                                            96px,
                                                            128px
                                                        "
                                                        className="
                                                            object-cover
                                                            transition
                                                            duration-500
                                                            hover:scale-105
                                                        "
                                                    />

                                                ) : (

                                                    <div
                                                        className="
                                                            flex
                                                            h-full
                                                            w-full
                                                            items-center
                                                            justify-center
                                                            text-xs
                                                            text-[#9a8a7e]
                                                        "
                                                    >
                                                        No image
                                                    </div>

                                                )}

                                            </Link>


                                            {/* DETAILS */}

                                            <div
                                                className="
                                                    min-w-0
                                                    flex-1
                                                "
                                            >

                                                {category && (

                                                    <p
                                                        className="
                                                            text-[10px]
                                                            font-semibold
                                                            uppercase
                                                            tracking-[0.18em]
                                                            text-[#a56f45]
                                                        "
                                                    >
                                                        {
                                                            category
                                                        }
                                                    </p>

                                                )}


                                                <Link
                                                    href={
                                                        item.slug
                                                            ? `/product/${item.slug}`
                                                            : `/product/${productId}`
                                                    }
                                                    className="
                                                        mt-1
                                                        block
                                                        line-clamp-2
                                                        text-sm
                                                        font-medium
                                                        leading-5
                                                        text-[#2f241e]
                                                        transition
                                                        hover:text-[#9a6845]
                                                        sm:text-base
                                                    "
                                                >
                                                    {name}
                                                </Link>


                                                {/* PRICE / DISCOUNT */}

                                                <div className="mt-3">

                                                    <div className="flex flex-wrap items-center gap-2">

                                                        {/* SALE PRICE */}
                                                        <span
                                                            className="
                                                                text-lg
                                                                font-bold
                                                                tracking-tight
                                                                text-[#211812]
                                                            "
                                                        >
                                                            {formatPrice(
                                                                salePrice
                                                            )}
                                                        </span>

                                                        {/* DISCOUNT BADGE */}
                                                        {discountPercent > 0 && (
                                                            <span
                                                                className="
                                                                    inline-flex
                                                                    items-center
                                                                    rounded-full
                                                                    bg-[#f1e1d3]
                                                                    px-2.5
                                                                    py-1
                                                                    text-[10px]
                                                                    font-bold
                                                                    uppercase
                                                                    tracking-wide
                                                                    text-[#9a6845]
                                                                "
                                                            >
                                                                {discountPercent}% OFF
                                                            </span>
                                                        )}

                                                        {/* ORIGINAL PRICE */}
                                                        {discountPercent > 0 && (
                                                            <span
                                                                className="
                                                                    text-sm
                                                                    font-medium
                                                                    text-[#a3958b]
                                                                    line-through
                                                                "
                                                            >
                                                                {formatPrice(
                                                                    originalPrice
                                                                )}
                                                            </span>
                                                        )}

                                                    </div>

                                                    {/* SAVING */}
                                                    {itemDiscount > 0 && (
                                                        <div
                                                            className="
                                                                mt-2
                                                                inline-flex
                                                                items-center
                                                                gap-1.5
                                                                rounded-md
                                                                bg-[#eef5e9]
                                                                px-2.5
                                                                py-1.5
                                                                text-xs
                                                                font-medium
                                                                text-[#5f7d4e]
                                                            "
                                                        >
                                                            <span>✓</span>
                                                            <span>
                                                                You save{" "}
                                                                {formatPrice(
                                                                    itemDiscount
                                                                )}{" "}
                                                                per item
                                                            </span>
                                                        </div>
                                                    )}

                                                </div>


                                                {/* CONTROLS */}

                                                <div
                                                    className="
                                                        mt-4
                                                        flex
                                                        items-center
                                                        justify-between
                                                        gap-3
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            inline-flex
                                                            h-9
                                                            items-center
                                                            overflow-hidden
                                                            rounded-lg
                                                            border
                                                            border-[#e5d9d0]
                                                            bg-[#faf8f5]
                                                        "
                                                    >

                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                dispatch(
                                                                    decreaseQuantity(productId)
                                                                )
                                                            }
                                                            disabled={
                                                                quantity <=
                                                                1
                                                            }
                                                            aria-label="Decrease quantity"
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                text-[#5f5148]
                                                                transition
                                                                hover:bg-[#eee5de]
                                                                disabled:cursor-not-allowed
                                                                disabled:opacity-40
                                                            "
                                                        >
                                                            −
                                                        </button>


                                                        <span
                                                            className="
                                                                flex
                                                                h-9
                                                                min-w-9
                                                                items-center
                                                                justify-center
                                                                border-x
                                                                border-[#e5d9d0]
                                                                bg-white
                                                                px-2
                                                                text-xs
                                                                font-semibold
                                                                text-[#2f241e]
                                                            "
                                                        >
                                                            {
                                                                quantity
                                                            }
                                                        </span>


                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                dispatch(
                                                                    increaseQuantity(productId)
                                                                )
                                                            }
                                                            aria-label="Increase quantity"
                                                            className="
                                                                flex
                                                                h-9
                                                                w-9
                                                                items-center
                                                                justify-center
                                                                text-[#5f5148]
                                                                transition
                                                                hover:bg-[#eee5de]
                                                            "
                                                        >
                                                            +
                                                        </button>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            dispatch(
                                                                removeFromCart(productId)
                                                            )
                                                        }
                                                        className="
                                                            text-xs
                                                            font-medium
                                                            text-[#8a7b70]
                                                            transition
                                                            hover:text-[#a14f42]
                                                        "
                                                    >
                                                        Remove
                                                    </button>

                                                </div>

                                            </div>

                                        </article>

                                    );

                                }
                            )}

                        </div>

                    </section>


                    {/* =================================================
                        ORDER SUMMARY
                    ================================================= */}

                    <aside
                        aria-labelledby="order-summary-heading"
                        className="
                            lg:sticky
                            lg:top-6
                        "
                    >

                        <div
                            className="
                                overflow-hidden
                                rounded-2xl
                                border
                                border-[#e5d8ce]
                                bg-[#2f211a]
                                text-white
                                shadow-[0_20px_60px_rgba(48,32,23,0.12)]
                            "
                        >

                            {/* HEADER */}

                            <div
                                className="
                                    border-b
                                    border-white/10
                                    px-6
                                    py-6
                                "
                            >

                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.24em]
                                        text-[#d9a67c]
                                    "
                                >
                                    Checkout
                                </p>


                                <h2
                                    id="order-summary-heading"
                                    className="
                                        mt-1
                                        text-xl
                                        font-medium
                                    "
                                >
                                    Order Summary
                                </h2>

                            </div>


                            {/* SUMMARY */}

                            <div
                                className="
                                    px-6
                                    py-6
                                "
                            >

                                <div
                                    className="
                                        space-y-4
                                    "
                                >

                                    {/* ORIGINAL PRICE */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            text-sm
                                            text-white/55
                                        "
                                    >

                                        <span>
                                            Original Price
                                        </span>

                                        <span
                                            className="
                                                font-medium
                                                text-white/55
                                                line-through
                                            "
                                        >
                                            {formatPrice(
                                                originalTotal
                                            )}
                                        </span>

                                    </div>


                                    {/* SALE PRICE */}

                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            text-sm
                                            text-white/75
                                        "
                                    >

                                        <span>
                                            Sale Price
                                        </span>

                                        <span
                                            className="
                                                font-semibold
                                                text-white
                                            "
                                        >
                                            {formatPrice(
                                                subtotal
                                            )}
                                        </span>

                                    </div>


                                    {/* TOTAL SAVING */}

                                    {discount > 0 && (

                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-between
                                                rounded-xl
                                                border
                                                border-[#c18a5d]/20
                                                bg-[#c18a5d]/10
                                                px-3
                                                py-2.5
                                                text-sm
                                                text-white/70
                                            "
                                        >

                                            <span className="flex items-center gap-2">
                                                <span
                                                    className="
                                                        flex
                                                        h-5
                                                        w-5
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-[#c18a5d]/20
                                                        text-[10px]
                                                        font-bold
                                                        text-[#d9a67c]
                                                    "
                                                >
                                                    %
                                                </span>

                                                <span>
                                                    You Save
                                                </span>
                                            </span>

                                            <span
                                                className="
                                                    font-bold
                                                    text-[#d9a67c]
                                                "
                                            >
                                                -{" "}
                                                {formatPrice(
                                                    discount
                                                )}
                                            </span>

                                        </div>

                                    )}


                                    <div
                                        className="
                                            flex
                                            items-center
                                            justify-between
                                            text-sm
                                            text-white/65
                                        "
                                    >

                                        <span>
                                            Shipping
                                        </span>

                                        <span
                                            className="
                                                font-medium
                                                text-white
                                            "
                                        >
                                            {shipping ===
                                            0
                                                ? "FREE"
                                                : formatPrice(
                                                    shipping
                                                )}
                                        </span>

                                    </div>

                                </div>


                                {/* DIVIDER */}

                                <div
                                    className="
                                        my-6
                                        h-px
                                        bg-white/10
                                    "
                                />


                                {/* TOTAL */}

                                <div
                                    className="
                                        flex
                                        items-end
                                        justify-between
                                    "
                                >

                                    <div>

                                        <p
                                            className="
                                                text-xs
                                                text-white/50
                                            "
                                        >
                                            Total
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-2xl
                                                font-semibold
                                                tracking-tight
                                            "
                                        >
                                            {formatPrice(
                                                total
                                            )}
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-white/10
                                            px-3
                                            py-1
                                            text-[10px]
                                            uppercase
                                            tracking-wider
                                            text-white/50
                                        "
                                    >
                                        INR
                                    </span>

                                </div>


                                {/* CHECKOUT BUTTON */}

                                <Link
                                    href="/checkout"
                                    className="
                                        mt-7
                                        flex
                                        h-13
                                        w-full
                                        items-center
                                        justify-center
                                        rounded-xl
                                        bg-[#c18a5d]
                                        px-5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition
                                        hover:bg-[#d09a6b]
                                        hover:shadow-lg
                                    "
                                >
                                    Proceed to Checkout

                                    <span
                                        className="
                                            ml-2
                                            text-base
                                        "
                                    >
                                        →
                                    </span>

                                </Link>


                                {/* SECURITY */}

                                <div
                                    className="
                                        mt-5
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        text-[10px]
                                        text-white/45
                                    "
                                >

                                    <span>
                                        🔒
                                    </span>

                                    Secure & encrypted
                                    checkout

                                </div>

                            </div>

                        </div>


                        {/* TRUST POINTS */}

                        <div
                            className="
                                mt-4
                                grid
                                grid-cols-3
                                gap-2
                            "
                        >

                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[#eadfd6]
                                    bg-white
                                    p-3
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                    "
                                >
                                    ✓
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        font-medium
                                        text-[#6f6259]
                                    "
                                >
                                    Secure
                                    Payment
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[#eadfd6]
                                    bg-white
                                    p-3
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                    "
                                >
                                    ↻
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        font-medium
                                        text-[#6f6259]
                                    "
                                >
                                    Easy
                                    Returns
                                </p>

                            </div>


                            <div
                                className="
                                    rounded-xl
                                    border
                                    border-[#eadfd6]
                                    bg-white
                                    p-3
                                    text-center
                                "
                            >

                                <p
                                    className="
                                        text-sm
                                    "
                                >
                                    ♢
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        font-medium
                                        text-[#6f6259]
                                    "
                                >
                                    Quality
                                    Furniture
                                </p>

                            </div>

                        </div>

                    </aside>

                </div>

            </div>

        </main>

    );

}