"use client";

import React, {
    useState,
} from "react";

import { useSelector } from "react-redux";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    Search,
    ShoppingBag,
    UserRound,
    Menu,
    X,
} from "lucide-react";


export default function Header() {

    const [
        menuOpen,
        setMenuOpen
    ] = useState(false);


    const pathname =
        usePathname();


    /* =====================================================
       CLOSE MOBILE MENU
    ===================================================== */

    const closeMenu = () => {
        setMenuOpen(false);
    };


    /* =====================================================
       REDUX CART COUNT
    ===================================================== */

    const cartItems = useSelector(
        (state) => state.cart.items
    );

    const cartCount = cartItems.reduce(
        (total, item) =>
            total + (Number(item?.quantity) || 1),
        0
    );


    /* =====================================================
       ACTIVE ROUTE
    ===================================================== */

    const isActive = (
        href
    ) => {

        if (href === "/") {

            return pathname === "/";

        }

        return (
            pathname === href ||
            pathname.startsWith(
                `${href}/`
            )
        );

    };


    /* =====================================================
       DESKTOP NAV ITEM
    ===================================================== */

    const desktopNavClass = (
        href
    ) => `

        inline-flex

        min-h-[44px]

        items-center
        justify-center

        rounded-lg

        px-[11px]

        text-[14px]
        font-normal

        tracking-[0.3px]

        no-underline
        whitespace-nowrap

        transition-colors
        duration-200

        xl:px-[15px]
        xl:text-[15px]

        ${
            isActive(href)

                ? "bg-[#f2ede5] text-[#9a633b]"

                : "text-[#687080] hover:text-[#9a633b]"
        }

    `;


    /* =====================================================
       MOBILE NAV ITEM
    ===================================================== */

    const mobileNavClass = (
        href
    ) => `

        flex

        min-h-[46px]

        w-full

        items-center

        rounded-lg

        px-4

        text-[15px]
        font-normal

        no-underline

        transition-colors
        duration-200

        ${
            isActive(href)

                ? "bg-[#f2ede5] text-[#9a633b]"

                : "text-[#596170] hover:bg-[#faf7f2] hover:text-[#9a633b]"
        }

    `;


    return (

        <header
            className="
                relative
                z-[1000]
                w-full
                border-b
                border-[#e8e3dc]
                bg-white
            "
        >

            {/* =====================================================
                HEADER MAIN
            ===================================================== */}

            <div
                className="
                    flex
                    min-h-[70px]
                    w-full
                    items-center
                    justify-between
                    gap-3
                    px-3

                    sm:min-h-[72px]
                    sm:px-4

                    md:px-[22px]

                    lg:min-h-[74px]
                    lg:gap-5
                    lg:px-[30px]

                    xl:px-9
                "
            >

                {/* =================================================
                    LOGO
                ================================================= */}

                <Link
                    href="/"
                    onClick={
                        closeMenu
                    }
                    className="
                        shrink-0

                        text-[17px]
                        font-medium

                        leading-none

                        tracking-[3px]

                        text-[#1d1d1d]

                        no-underline

                        transition-colors
                        duration-200

                        sm:text-[19px]
                        sm:tracking-[3.5px]

                        lg:text-[21px]
                        lg:tracking-[4px]

                        xl:text-[22px]
                    "
                >
                    NESTRO.
                </Link>


                {/* =================================================
                    DESKTOP NAVIGATION
                ================================================= */}

                <nav
                    className="
                        hidden

                        flex-1
                        items-center
                        justify-center

                        gap-0

                        min-[951px]:flex

                        xl:gap-[5px]
                    "
                >

                    <Link
                        href="/"
                        className={
                            desktopNavClass("/")
                        }
                    >
                        Home
                    </Link>


                    <Link
                        href="/store"
                        className={
                            desktopNavClass(
                                "/store"
                            )
                        }
                    >
                        Store
                    </Link>


                    <Link
                        href="/about"
                        className={
                            desktopNavClass(
                                "/about"
                            )
                        }
                    >
                        About
                    </Link>


                    <Link
                        href="/contact"
                        className={
                            desktopNavClass(
                                "/contact"
                            )
                        }
                    >
                        Contact
                    </Link>


                    <Link
                        href="/checkout"
                        className={
                            desktopNavClass(
                                "/checkout"
                            )
                        }
                    >
                        Checkout
                    </Link>


                    <Link
                        href="/signin"
                        className={
                            desktopNavClass(
                                "/signin"
                            )
                        }
                    >
                        Sign In
                    </Link>


                    <Link
                        href="/new-design"
                        className={
                            desktopNavClass(
                                "/new-design"
                            )
                        }
                    >
                        New Design
                    </Link>

                </nav>


                {/* =================================================
                    RIGHT ACTIONS
                ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center

                        gap-1

                        sm:gap-2

                        lg:gap-2.5

                        xl:gap-3.5
                    "
                >

                    {/* =============================================
                        SEARCH
                    ============================================= */}

                    <button
                        type="button"
                        aria-label="Search"
                        className="
                            flex

                            h-[34px]
                            w-[34px]

                            cursor-pointer

                            items-center
                            justify-center

                            border-0

                            bg-transparent

                            p-0

                            text-[#303030]

                            transition-colors
                            duration-200

                            sm:h-[37px]
                            sm:w-[37px]

                            lg:h-[38px]
                            lg:w-[38px]

                            hover:text-[#a86d42]
                        "
                    >

                        <Search
                            size={23}
                            strokeWidth={1.8}
                        />

                    </button>


                    {/* =============================================
                        CART
                    ============================================= */}

                    <Link
                        href="/cart"
                        aria-label={
                            cartCount > 0
                                ? `Shopping cart with ${cartCount} items`
                                : "Shopping cart"
                        }
                        className="
                            group

                            relative

                            flex

                            h-[34px]
                            w-[34px]

                            items-center
                            justify-center

                            text-[#303030]

                            no-underline

                            transition-colors
                            duration-200

                            sm:h-[37px]
                            sm:w-[37px]

                            lg:h-[38px]
                            lg:w-[38px]

                            hover:text-[#a86d42]
                        "
                    >

                        <ShoppingBag
                            size={22}
                            strokeWidth={1.8}
                            className="
                                transition-transform
                                duration-200
                                group-hover:scale-105
                            "
                        />


                        {/* =========================================
                            CART COUNT BADGE
                        ========================================= */}

                        {cartCount > 0 && (

                            <span
                                aria-label={`${cartCount} items in cart`}
                                className="
                                    absolute

                                    -right-1
                                    -top-1

                                    flex

                                    h-[19px]

                                    min-w-[19px]

                                    items-center
                                    justify-center

                                    rounded-full

                                    bg-[#9a6845]

                                    px-1

                                    text-[9px]
                                    font-bold

                                    leading-none

                                    text-white

                                    ring-2
                                    ring-white

                                    shadow-sm

                                    transition-transform
                                    duration-200

                                    group-hover:scale-110
                                "
                            >

                                {cartCount > 99
                                    ? "99+"
                                    : cartCount}

                            </span>

                        )}

                    </Link>


                    {/* =============================================
                        PROFILE
                    ============================================= */}

                    <Link
                        href="/profile"
                        aria-label="Profile"
                        className="
                            flex

                            h-[38px]
                            w-[38px]

                            shrink-0

                            items-center
                            justify-center

                            rounded-full

                            border-[1.5px]
                            border-[#c99868]

                            bg-white

                            text-[#9a633b]

                            no-underline

                            transition-all
                            duration-200

                            sm:h-10
                            sm:w-10

                            lg:h-[42px]
                            lg:w-[42px]

                            hover:bg-[#faf6f0]
                            hover:shadow-sm
                        "
                    >

                        <UserRound
                            size={21}
                            strokeWidth={1.7}
                        />

                    </Link>


                    {/* =============================================
                        MOBILE MENU BUTTON
                    ============================================= */}

                    <button
                        type="button"
                        onClick={() =>
                            setMenuOpen(
                                !menuOpen
                            )
                        }
                        aria-label={
                            menuOpen
                                ? "Close menu"
                                : "Open menu"
                        }
                        aria-expanded={
                            menuOpen
                        }
                        className="
                            flex

                            h-[36px]
                            w-[36px]

                            cursor-pointer

                            items-center
                            justify-center

                            rounded-lg

                            border
                            border-[#e3ddd5]

                            bg-white

                            p-0

                            text-[#292929]

                            min-[951px]:hidden

                            sm:h-[38px]
                            sm:w-[38px]

                            hover:bg-[#faf7f2]
                        "
                    >

                        {menuOpen ? (

                            <X
                                size={23}
                                strokeWidth={1.8}
                            />

                        ) : (

                            <Menu
                                size={23}
                                strokeWidth={1.8}
                            />

                        )}

                    </button>

                </div>

            </div>


            {/* =========================================================
                MOBILE NAVIGATION
            ========================================================= */}

            <div
                className={`
                    overflow-hidden

                    border-t
                    border-[#eee8e1]

                    bg-white

                    transition-all
                    duration-300

                    min-[951px]:hidden

                    ${
                        menuOpen

                            ? "max-h-[500px] opacity-100"

                            : "max-h-0 border-t-transparent opacity-0"
                    }
                `}
            >

                <nav
                    className="
                        flex
                        flex-col
                        gap-1

                        px-4
                        pb-4
                        pt-2
                    "
                >

                    <Link
                        href="/"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass("/")
                        }
                    >
                        Home
                    </Link>


                    <Link
                        href="/store"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass(
                                "/store"
                            )
                        }
                    >
                        Store
                    </Link>


                    <Link
                        href="/about"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass(
                                "/about"
                            )
                        }
                    >
                        About
                    </Link>


                    <Link
                        href="/contact"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass(
                                "/contact"
                            )
                        }
                    >
                        Contact
                    </Link>


                    <Link
                        href="/checkout"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass(
                                "/checkout"
                            )
                        }
                    >
                        Checkout
                    </Link>


                    <Link
                        href="/signin"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass(
                                "/signin"
                            )
                        }
                    >
                        Sign In
                    </Link>


                    <Link
                        href="/new-design"
                        onClick={
                            closeMenu
                        }
                        className={
                            mobileNavClass(
                                "/new-design"
                            )
                        }
                    >
                        New Design
                    </Link>

                </nav>

            </div>

        </header>

    );

}