"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import {
    Pencil,
    Eye,
    Power,
    Plus,
    Loader2,
    Image as ImageIcon,
    Percent,
    Home,
    ShoppingBag,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function WebsiteContentPage() {
    const router = useRouter();

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL;

    // =====================================================
    // HOME STATE
    // =====================================================

    const [homeHero, setHomeHero] = useState(null);
    const [homeLoading, setHomeLoading] = useState(true);
    const [homeError, setHomeError] = useState("");
    const [homeStatusUpdating, setHomeStatusUpdating] =
        useState(false);

    // =====================================================
    // STORE STATE
    // =====================================================

    const [storeHero, setStoreHero] = useState(null);
    const [storeLoading, setStoreLoading] = useState(true);
    const [storeError, setStoreError] = useState("");
    const [storeStatusUpdating, setStoreStatusUpdating] =
        useState(false);

    // =====================================================
    // FETCH HOME HERO
    // =====================================================

    const fetchHomeHero = async () => {
        try {
            setHomeLoading(true);
            setHomeError("");

            const response = await axios.get(
                `${API_BASE_URL}/home-page-hero`
            );

            console.log(
                "HOME HERO API RESPONSE:",
                response.data
            );

            if (response.data.success) {
                const data = response.data.data;

                if (Array.isArray(data)) {
                    setHomeHero(
                        data.length > 0
                            ? data[0]
                            : null
                    );
                } else {
                    setHomeHero(data || null);
                }
            } else {
                setHomeError(
                    response.data.message ||
                        "Failed to fetch home hero section"
                );
            }
        } catch (error) {
            console.log(
                "HOME HERO FETCH ERROR:",
                error
            );

            console.log(
                "HOME ERROR RESPONSE:",
                error.response?.data
            );

            setHomeError(
                error.response?.data?.message ||
                    "Failed to connect with Home Hero API"
            );
        } finally {
            setHomeLoading(false);
        }
    };

    // =====================================================
    // FETCH STORE HERO
    // =====================================================

    const fetchStoreHero = async () => {
        try {
            setStoreLoading(true);
            setStoreError("");

            const response = await axios.get(
                `${API_BASE_URL}/store-page-hero`
            );

            console.log(
                "STORE HERO API RESPONSE:",
                response.data
            );

            if (response.data.success) {
                const data = response.data.data;

                if (Array.isArray(data)) {
                    setStoreHero(
                        data.length > 0
                            ? data[0]
                            : null
                    );
                } else {
                    setStoreHero(data || null);
                }
            } else {
                setStoreError(
                    response.data.message ||
                        "Failed to fetch store hero section"
                );
            }
        } catch (error) {
            console.log(
                "STORE HERO FETCH ERROR:",
                error
            );

            console.log(
                "STORE ERROR RESPONSE:",
                error.response?.data
            );

            setStoreError(
                error.response?.data?.message ||
                    "Failed to connect with Store Hero API"
            );
        } finally {
            setStoreLoading(false);
        }
    };

    // =====================================================
    // LOAD DATA
    // =====================================================

    useEffect(() => {
        fetchHomeHero();
        fetchStoreHero();
    }, []);

    // =====================================================
    // ACTIVE STATUS
    // =====================================================

    const isHomeActive =
        homeHero?.status === true;

    const isStoreActive =
        storeHero?.status === true;

    // =====================================================
    // HOME - ADD
    // =====================================================

    const handleAddHomeHero = () => {
        router.push(
            "/admin/website-content/home-hero/add"
        );
    };

    // =====================================================
    // HOME - EDIT
    // =====================================================

    const handleEditHomeHero = () => {
        if (!homeHero?._id) {
            alert("Home Hero section ID not found.");
            return;
        }

        router.push(
            `/admin/website-content/home-hero/edit/${homeHero._id}`
        );
    };

    // =====================================================
    // HOME - PREVIEW
    // =====================================================

    const handleHomePreview = () => {
        window.open(
            "/",
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =====================================================
    // HOME - STATUS
    // =====================================================

    const handleHomeStatusChange = async () => {
        if (!homeHero?._id) {
            alert("Home Hero section ID not found.");
            return;
        }

        const newStatus = !isHomeActive;

        try {
            setHomeStatusUpdating(true);

            const response = await axios.patch(
                `${API_BASE_URL}/home-page-hero/status/${homeHero._id}`,
                {
                    status: newStatus,
                }
            );

            console.log(
                "HOME STATUS UPDATE RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setHomeHero(response.data.data);

                alert(
                    newStatus
                        ? "Home Hero section enabled successfully."
                        : "Home Hero section disabled successfully."
                );
            } else {
                alert(
                    response.data.message ||
                        "Failed to update Home Hero status."
                );
            }
        } catch (error) {
            console.log(
                "HOME STATUS UPDATE ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update Home Hero status."
            );
        } finally {
            setHomeStatusUpdating(false);
        }
    };

    // =====================================================
    // STORE - ADD
    // =====================================================

    const handleAddStoreHero = () => {
        router.push(
            "/admin/website-content/store-hero/add"
        );
    };

    // =====================================================
    // STORE - EDIT
    // =====================================================

    const handleEditStoreHero = () => {
        if (!storeHero?._id) {
            alert("Store Hero section ID not found.");
            return;
        }

        router.push(
            `/admin/website-content/store-hero/edit/${storeHero._id}`
        );
    };

    // =====================================================
    // STORE - PREVIEW
    // =====================================================

    const handleStorePreview = () => {
        window.open(
            "/store",
            "_blank",
            "noopener,noreferrer"
        );
    };

    // =====================================================
    // STORE - STATUS
    // =====================================================

    const handleStoreStatusChange = async () => {
        if (!storeHero?._id) {
            alert("Store Hero section ID not found.");
            return;
        }

        const newStatus = !isStoreActive;

        try {
            setStoreStatusUpdating(true);

            const response = await axios.patch(
                `${API_BASE_URL}/store-page-hero/status/${storeHero._id}`,
                {
                    status: newStatus,
                }
            );

            console.log(
                "STORE STATUS UPDATE RESPONSE:",
                response.data
            );

            if (response.data.success) {
                setStoreHero(response.data.data);

                alert(
                    newStatus
                        ? "Store Hero section enabled successfully."
                        : "Store Hero section disabled successfully."
                );
            } else {
                alert(
                    response.data.message ||
                        "Failed to update Store Hero status."
                );
            }
        } catch (error) {
            console.log(
                "STORE STATUS UPDATE ERROR:",
                error
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update Store Hero status."
            );
        } finally {
            setStoreStatusUpdating(false);
        }
    };

    // =====================================================
    // HERO PREVIEW COMPONENT
    // =====================================================

    const HeroPreview = ({
        hero,
        pageName,
    }) => {
        if (!hero) {
            return null;
        }

        return (
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                {/* IMAGE */}

                {hero.image ? (
                    <img
                        src={hero.image}
                        alt={`${pageName} Hero`}
                        className="h-56 w-full object-cover"
                    />
                ) : (
                    <div className="flex h-56 w-full items-center justify-center bg-slate-100">

                        <div className="text-center">

                            <ImageIcon
                                size={34}
                                className="mx-auto text-slate-400"
                            />

                            <p className="mt-2 text-xs text-slate-400">
                                No hero image
                            </p>

                        </div>

                    </div>
                )}

                {/* CONTENT */}

                <div className="p-5">

                    {/* EYEBROW */}

                    {hero.eyebrow && (
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                            {hero.eyebrow}
                        </p>
                    )}

                    {/* TITLE */}

                    <h4 className="mt-2 text-xl font-bold text-slate-900">

                        {hero.title}

                        {hero.highlightedTitle && (
                            <span className="ml-2 font-serif italic text-amber-700">
                                {hero.highlightedTitle}
                            </span>
                        )}

                    </h4>

                    {/* DESCRIPTION */}

                    {hero.description && (
                        <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-500">
                            {hero.description}
                        </p>
                    )}

                    {/* OFFER */}

                    {(hero.offerText ||
                        Number(hero.offerPercentage) > 0) && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-amber-50 px-3 py-2">

                            <Percent
                                size={15}
                                className="text-amber-600"
                            />

                            <span className="text-xs font-semibold text-amber-700">

                                {hero.offerText ||
                                    "Special Offer"}

                                {Number(
                                    hero.offerPercentage
                                ) > 0 && (
                                    <span className="ml-1">
                                        -{" "}
                                        {
                                            hero.offerPercentage
                                        }
                                        % OFF
                                    </span>
                                )}

                            </span>

                        </div>
                    )}

                    {/* BUTTONS */}

                    <div className="mt-4 flex flex-wrap gap-2">

                        {hero.primaryButtonText && (
                            <span className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-medium text-teal-700">
                                {hero.primaryButtonText}
                            </span>
                        )}

                        {hero.secondaryButtonText && (
                            <span className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                                {hero.secondaryButtonText}
                            </span>
                        )}

                    </div>

                </div>

            </div>
        );
    };

    // =====================================================
    // HERO ACTION BUTTONS
    // =====================================================

    const HeroActions = ({
        hero,
        isActive,
        statusUpdating,
        onEdit,
        onPreview,
        onStatusChange,
    }) => {
        return (
            <div className="mt-5 flex flex-wrap gap-2">

                {/* EDIT */}

                <button
                    type="button"
                    onClick={onEdit}
                    className="inline-flex items-center gap-2 rounded-lg bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
                >
                    <Pencil size={16} />
                    Edit
                </button>

                {/* PREVIEW */}

                <button
                    type="button"
                    onClick={onPreview}
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                    <Eye size={16} />
                    Preview
                </button>

                {/* ENABLE / DISABLE */}

                <button
                    type="button"
                    onClick={onStatusChange}
                    disabled={statusUpdating}
                    className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
                        isActive
                            ? "border-orange-200 bg-white text-orange-600 hover:bg-orange-50"
                            : "border-emerald-200 bg-white text-emerald-600 hover:bg-emerald-50"
                    }`}
                >
                    {statusUpdating ? (
                        <Loader2
                            size={16}
                            className="animate-spin"
                        />
                    ) : (
                        <Power size={16} />
                    )}

                    {statusUpdating
                        ? "Updating..."
                        : isActive
                            ? "Disable"
                            : "Enable"}
                </button>

            </div>
        );
    };

    // =====================================================
    // PAGE RENDER
    // =====================================================

    return (
        <div className="min-h-full bg-slate-50 p-6">

            {/* =================================================
                PAGE HEADER
            ================================================= */}

            <div className="mb-6">

                <h1 className="text-2xl font-bold text-slate-900">
                    Website Content
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Manage your website page sections.
                </p>

            </div>


            {/* =================================================
                HOME PAGE
            ================================================= */}

            <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* HOME HEADER */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div className="flex items-center gap-4">

                        {/* ICON */}

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">

                            <Home
                                size={24}
                                className="text-teal-500"
                                strokeWidth={1.8}
                            />

                        </div>

                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Home Page
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage home page content and sections.
                            </p>

                        </div>

                    </div>

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                        1 Section
                    </span>

                </div>


                {/* HOME HERO */}

                <div className="p-6">

                    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        {/* TOP */}

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                                    <ImageIcon
                                        size={23}
                                        className="text-slate-500"
                                        strokeWidth={1.7}
                                    />

                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-slate-900">
                                        Hero Section
                                    </h3>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Manage the main home page hero banner.
                                    </p>

                                </div>

                            </div>


                            {/* STATUS */}

                            {!homeLoading &&
                                homeHero && (
                                    <div className="flex items-center gap-2 whitespace-nowrap">

                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                isHomeActive
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-400"
                                            }`}
                                        />

                                        <span
                                            className={`text-sm font-medium ${
                                                isHomeActive
                                                    ? "text-emerald-600"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {isHomeActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>
                                )}

                        </div>


                        {/* LOADING */}

                        {homeLoading && (
                            <div className="mt-5 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 py-10">

                                <Loader2
                                    size={22}
                                    className="animate-spin text-teal-500"
                                />

                                <span className="ml-2 text-sm text-slate-500">
                                    Loading home hero section...
                                </span>

                            </div>
                        )}


                        {/* ERROR */}

                        {!homeLoading &&
                            homeError && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">

                                    <p className="text-sm font-medium text-red-600">
                                        {homeError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={fetchHomeHero}
                                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                    >
                                        Retry
                                    </button>

                                </div>
                            )}


                        {/* NO DATA */}

                        {!homeLoading &&
                            !homeError &&
                            !homeHero && (
                                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">

                                        <Home
                                            size={24}
                                            className="text-slate-400"
                                        />

                                    </div>

                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        No Home Hero section found.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Create your home page hero section to get started.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleAddHomeHero}
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
                                    >
                                        <Plus size={17} />
                                        Add Hero Section
                                    </button>

                                </div>
                            )}


                        {/* HOME HERO DATA */}

                        {!homeLoading &&
                            !homeError &&
                            homeHero && (
                                <>

                                    <HeroPreview
                                        hero={homeHero}
                                        pageName="Home"
                                    />

                                    <HeroActions
                                        hero={homeHero}
                                        isActive={isHomeActive}
                                        statusUpdating={
                                            homeStatusUpdating
                                        }
                                        onEdit={
                                            handleEditHomeHero
                                        }
                                        onPreview={
                                            handleHomePreview
                                        }
                                        onStatusChange={
                                            handleHomeStatusChange
                                        }
                                    />

                                </>
                            )}

                    </div>

                </div>

            </section>


            {/* =================================================
                STORE PAGE
            ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                {/* STORE HEADER */}

                <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

                    <div className="flex items-center gap-4">

                        {/* ICON */}

                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-50">

                            <ShoppingBag
                                size={24}
                                className="text-teal-500"
                                strokeWidth={1.8}
                            />

                        </div>

                        <div>

                            <h2 className="text-xl font-bold text-slate-900">
                                Store Page
                            </h2>

                            <p className="text-sm text-slate-500">
                                Manage store page content and sections.
                            </p>

                        </div>

                    </div>

                    <span className="rounded-full bg-slate-100 px-4 py-2 text-xs font-medium text-slate-600">
                        1 Section
                    </span>

                </div>


                {/* STORE HERO */}

                <div className="p-6">

                    <div className="max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

                        {/* TOP */}

                        <div className="flex items-start justify-between gap-4">

                            <div className="flex items-start gap-4">

                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100">

                                    <ImageIcon
                                        size={23}
                                        className="text-slate-500"
                                        strokeWidth={1.7}
                                    />

                                </div>

                                <div>

                                    <h3 className="text-lg font-bold text-slate-900">
                                        Hero Section
                                    </h3>

                                    <p className="mt-1 text-sm leading-5 text-slate-500">
                                        Manage the main store page hero banner.
                                    </p>

                                </div>

                            </div>


                            {/* STATUS */}

                            {!storeLoading &&
                                storeHero && (
                                    <div className="flex items-center gap-2 whitespace-nowrap">

                                        <span
                                            className={`h-2.5 w-2.5 rounded-full ${
                                                isStoreActive
                                                    ? "bg-emerald-500"
                                                    : "bg-slate-400"
                                            }`}
                                        />

                                        <span
                                            className={`text-sm font-medium ${
                                                isStoreActive
                                                    ? "text-emerald-600"
                                                    : "text-slate-500"
                                            }`}
                                        >
                                            {isStoreActive
                                                ? "Active"
                                                : "Inactive"}
                                        </span>

                                    </div>
                                )}

                        </div>


                        {/* LOADING */}

                        {storeLoading && (
                            <div className="mt-5 flex items-center justify-center rounded-xl border border-slate-100 bg-slate-50 py-10">

                                <Loader2
                                    size={22}
                                    className="animate-spin text-teal-500"
                                />

                                <span className="ml-2 text-sm text-slate-500">
                                    Loading store hero section...
                                </span>

                            </div>
                        )}


                        {/* ERROR */}

                        {!storeLoading &&
                            storeError && (
                                <div className="mt-5 rounded-xl border border-red-200 bg-red-50 p-5">

                                    <p className="text-sm font-medium text-red-600">
                                        {storeError}
                                    </p>

                                    <button
                                        type="button"
                                        onClick={fetchStoreHero}
                                        className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                                    >
                                        Retry
                                    </button>

                                </div>
                            )}


                        {/* NO DATA */}

                        {!storeLoading &&
                            !storeError &&
                            !storeHero && (
                                <div className="mt-5 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">

                                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">

                                        <ShoppingBag
                                            size={24}
                                            className="text-slate-400"
                                        />

                                    </div>

                                    <p className="mt-3 text-sm font-medium text-slate-600">
                                        No Store Hero section found.
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Create your store page hero section to get started.
                                    </p>

                                    <button
                                        type="button"
                                        onClick={handleAddStoreHero}
                                        className="mt-5 inline-flex items-center gap-2 rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-600"
                                    >
                                        <Plus size={17} />
                                        Add Hero Section
                                    </button>

                                </div>
                            )}


                        {/* STORE HERO DATA */}

                        {!storeLoading &&
                            !storeError &&
                            storeHero && (
                                <>

                                    <HeroPreview
                                        hero={storeHero}
                                        pageName="Store"
                                    />

                                    <HeroActions
                                        hero={storeHero}
                                        isActive={isStoreActive}
                                        statusUpdating={
                                            storeStatusUpdating
                                        }
                                        onEdit={
                                            handleEditStoreHero
                                        }
                                        onPreview={
                                            handleStorePreview
                                        }
                                        onStatusChange={
                                            handleStoreStatusChange
                                        }
                                    />

                                </>
                            )}

                    </div>

                </div>

            </section>

        </div>
    );
}