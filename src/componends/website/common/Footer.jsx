"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
    return (
        <footer className="w-full m-0 p-0 font-sans">

            {/* =====================================================
                MAIN FOOTER
            ===================================================== */}

            <section className="w-full bg-[#191108] px-5 pb-5 pt-[42px] sm:px-6 sm:pt-[48px] lg:px-[30px] lg:pt-[51px]">

                {/* =================================================
                    FOOTER CONTENT
                ================================================= */}

                <div
                    className="
                        grid
                        w-full
                        grid-cols-1
                        gap-8
                        pb-10

                        min-[521px]:grid-cols-2
                        min-[521px]:gap-x-8
                        min-[521px]:gap-y-10

                        min-[801px]:grid-cols-[1fr_1fr]
                        min-[801px]:gap-x-[30px]
                        min-[801px]:gap-y-10

                        min-[1101px]:grid-cols-[minmax(420px,2.15fr)_1fr_1fr_1fr]
                        min-[1101px]:gap-[50px]
                        min-[1101px]:pb-[58px]
                    "
                >

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div
                        className="
                            min-w-0

                            min-[521px]:col-span-2

                            min-[1101px]:col-span-1
                        "
                    >

                        {/* Logo */}

                        <Link
                            href="/"
                            className="
                                mb-[14px]
                                inline-block
                                text-[19px]
                                font-medium
                                leading-none
                                tracking-[3px]
                                text-[#c78a56]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#d99a65]
                            "
                        >
                            NESTRO.
                        </Link>


                        {/* Description */}

                        <p
                            className="
                                mb-[22px]
                                max-w-[570px]
                                text-[14px]
                                font-normal
                                leading-[1.6]
                                text-[#756c63]
                            "
                        >
                            Curated furniture for thoughtful homes.
                            Crafted with intention, made to endure.
                        </p>


                        {/* Email Form */}

                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className="
                                flex
                                h-10
                                w-full
                                max-w-[572px]
                                overflow-hidden
                                rounded-[4px]
                                border
                                border-[#594832]
                                bg-[#282117]
                            "
                        >

                            <input
                                type="email"
                                placeholder="Your email address"
                                aria-label="Email address"
                                className="
                                    min-w-0
                                    flex-1
                                    border-0
                                    bg-transparent
                                    px-[14px]
                                    text-[12px]
                                    text-white
                                    outline-none
                                    placeholder:text-[#756d64]
                                    placeholder:opacity-100
                                "
                            />

                            <button
                                type="submit"
                                className="
                                    h-full
                                    w-[103px]
                                    shrink-0
                                    border-0
                                    bg-[#a86d42]
                                    text-[12px]
                                    font-semibold
                                    text-white
                                    transition-colors
                                    duration-200
                                    hover:bg-[#b77a4c]
                                "
                            >
                                Subscribe
                            </button>

                        </form>

                    </div>


                    {/* =================================================
                        COMPANY
                    ================================================= */}

                    <div className="flex flex-col items-start">

                        <h3
                            className="
                                mb-4
                                mt-0.5
                                text-[11px]
                                font-semibold
                                leading-[1.4]
                                tracking-[2px]
                                text-[#c78a56]
                            "
                        >
                            COMPANY
                        </h3>


                        <Link
                            href="/about"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Our Story
                        </Link>


                        <Link
                            href="/sustainability"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Sustainability
                        </Link>


                        <Link
                            href="/showrooms"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Showrooms
                        </Link>


                        <Link
                            href="/careers"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Careers
                        </Link>

                    </div>


                    {/* =================================================
                        SUPPORT
                    ================================================= */}

                    <div className="flex flex-col items-start">

                        <h3
                            className="
                                mb-4
                                mt-0.5
                                text-[11px]
                                font-semibold
                                leading-[1.4]
                                tracking-[2px]
                                text-[#c78a56]
                            "
                        >
                            SUPPORT
                        </h3>


                        <Link
                            href="/track-order"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Track Order
                        </Link>


                        <Link
                            href="/returns"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Returns & Exchange
                        </Link>


                        <Link
                            href="/assembly-help"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Assembly Help
                        </Link>


                        <Link
                            href="/contact"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Contact Us
                        </Link>

                    </div>


                    {/* =================================================
                        FOLLOW US
                    ================================================= */}

                    <div className="flex flex-col items-start">

                        <h3
                            className="
                                mb-4
                                mt-0.5
                                text-[11px]
                                font-semibold
                                leading-[1.4]
                                tracking-[2px]
                                text-[#c78a56]
                            "
                        >
                            FOLLOW US
                        </h3>


                        <Link
                            href="#"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Instagram
                        </Link>


                        <Link
                            href="#"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Pinterest
                        </Link>


                        <Link
                            href="#"
                            className="
                                mb-2.5
                                text-[14px]
                                font-normal
                                leading-[1.45]
                                text-[#756c63]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Houzz
                        </Link>


                        {/* =================================================
                            SOCIAL ICONS
                        ================================================= */}

                        <div
                            className="
                                mt-2
                                flex
                                items-center
                                gap-3
                            "
                        >

                            {/* Instagram */}

                            <a
                                href="#"
                                aria-label="Instagram"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#594832]
                                    text-[#bd8150]
                                    no-underline
                                    transition-all
                                    duration-200
                                    hover:border-[#a86d42]
                                    hover:bg-[#292117]
                                "
                            >
                                <span className="text-[15px] leading-none">
                                    ◎
                                </span>
                            </a>


                            {/* Pinterest */}

                            <a
                                href="#"
                                aria-label="Pinterest"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#594832]
                                    text-[#bd8150]
                                    no-underline
                                    transition-all
                                    duration-200
                                    hover:border-[#a86d42]
                                    hover:bg-[#292117]
                                "
                            >
                                <span className="text-[15px] leading-none">
                                    P
                                </span>
                            </a>


                            {/* YouTube */}

                            <a
                                href="#"
                                aria-label="Youtube"
                                className="
                                    flex
                                    h-9
                                    w-9
                                    items-center
                                    justify-center
                                    rounded-full
                                    border
                                    border-[#594832]
                                    text-[#bd8150]
                                    no-underline
                                    transition-all
                                    duration-200
                                    hover:border-[#a86d42]
                                    hover:bg-[#292117]
                                "
                            >
                                <span className="text-[13px] leading-none">
                                    ▶
                                </span>
                            </a>

                        </div>

                    </div>

                </div>


                {/* =====================================================
                    FOOTER BOTTOM
                ===================================================== */}

                <div
                    className="
                        flex
                        w-full
                        flex-col
                        items-start
                        justify-between
                        gap-3
                        border-t
                        border-[#30261b]
                        pt-5

                        min-[521px]:flex-row
                        min-[521px]:items-center
                        min-[521px]:gap-5
                    "
                >

                    {/* Copyright */}

                    <p
                        className="
                            m-0
                            text-[12px]
                            leading-[1.5]
                            text-[#665e56]
                        "
                    >
                        © 2026 Nestro. All rights reserved.
                    </p>


                    {/* Legal Links */}

                    <div
                        className="
                            flex
                            items-center
                            gap-[7px]
                        "
                    >

                        <Link
                            href="/privacy"
                            className="
                                text-[12px]
                                text-[#665e56]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Privacy
                        </Link>

                        <span className="text-[12px] text-[#665e56]">
                            ·
                        </span>

                        <Link
                            href="/terms"
                            className="
                                text-[12px]
                                text-[#665e56]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Terms
                        </Link>

                        <span className="text-[12px] text-[#665e56]">
                            ·
                        </span>

                        <Link
                            href="/sitemap"
                            className="
                                text-[12px]
                                text-[#665e56]
                                no-underline
                                transition-colors
                                duration-200
                                hover:text-[#c78a56]
                            "
                        >
                            Sitemap
                        </Link>

                    </div>

                </div>

            </section>

        </footer>
    );
}