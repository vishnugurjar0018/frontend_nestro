"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    X,
    Save,
    Percent,
    Eye,
} from "lucide-react";

export default function AddHomeHeroPage() {
    const router = useRouter();

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL;

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        eyebrow: "NEW COLLECTION — SS 2026",
        title: "Modern Living",
        highlightedTitle: "Collection",
        description:
            "Timeless furniture crafted for elegant spaces. Designed with intention, built to endure.",
        primaryButtonText: "Explore Collection",
        primaryButtonLink: "/store",
        secondaryButtonText: "View Collection",
        secondaryButtonLink: "/store",
        offerText: "",
        offerPercentage: "0",
        status: true,
        sortOrder: "0",
    });

    // =====================================================
    // IMAGE
    // =====================================================

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // =====================================================
    // SAVING
    // =====================================================

    const [saving, setSaving] = useState(false);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const {
            name,
            value,
            type,
            checked,
        } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : value,
        }));
    };

    // =====================================================
    // HANDLE IMAGE
    // =====================================================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // 2MB validation
        if (file.size > 2 * 1024 * 1024) {
            alert(
                "Hero image must be less than 2MB."
            );

            e.target.value = "";
            return;
        }

        // Allowed image types
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            );

            e.target.value = "";
            return;
        }

        // Revoke previous preview
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(file);
        setImagePreview(
            URL.createObjectURL(file)
        );
    };

    // =====================================================
    // REMOVE IMAGE
    // =====================================================

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImage(null);
        setImagePreview("");
    };

    // =====================================================
    // SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!formData.title.trim()) {
            alert("Please enter hero title.");
            return;
        }

        if (!formData.description.trim()) {
            alert(
                "Please enter hero description."
            );
            return;
        }

        if (!image) {
            alert("Please upload hero image.");
            return;
        }

        const offerPercentage = Number(
            formData.offerPercentage
        );

        if (
            Number.isNaN(offerPercentage) ||
            offerPercentage < 0 ||
            offerPercentage > 100
        ) {
            alert(
                "Offer percentage must be between 0 and 100."
            );
            return;
        }

        try {
            setSaving(true);

            const data = new FormData();

            // -------------------------------------------------
            // BASIC CONTENT
            // -------------------------------------------------

            data.append(
                "eyebrow",
                formData.eyebrow.trim()
            );

            data.append(
                "title",
                formData.title.trim()
            );

            data.append(
                "highlightedTitle",
                formData.highlightedTitle.trim()
            );

            data.append(
                "description",
                formData.description.trim()
            );

            // -------------------------------------------------
            // PRIMARY BUTTON
            // -------------------------------------------------

            data.append(
                "primaryButtonText",
                formData.primaryButtonText.trim()
            );

            data.append(
                "primaryButtonLink",
                formData.primaryButtonLink.trim()
            );

            // -------------------------------------------------
            // SECONDARY BUTTON
            // -------------------------------------------------

            data.append(
                "secondaryButtonText",
                formData.secondaryButtonText.trim()
            );

            data.append(
                "secondaryButtonLink",
                formData.secondaryButtonLink.trim()
            );

            // -------------------------------------------------
            // OFFER
            // -------------------------------------------------

            data.append(
                "offerText",
                formData.offerText.trim()
            );

            data.append(
                "offerPercentage",
                String(offerPercentage)
            );

            // -------------------------------------------------
            // STATUS
            // -------------------------------------------------

            data.append(
                "status",
                String(formData.status)
            );

            // -------------------------------------------------
            // SORT ORDER
            // -------------------------------------------------

            data.append(
                "sortOrder",
                String(
                    Number(formData.sortOrder) || 0
                )
            );

            // -------------------------------------------------
            // IMAGE
            // -------------------------------------------------

            data.append("image", image);

            // -------------------------------------------------
            // HOME HERO API
            // -------------------------------------------------

            const response = await axios.post(
                `${API_BASE_URL}/home-page-hero/create`,
                data
            );

            console.log(
                "HOME HERO CREATE RESPONSE:",
                response.data
            );

            if (response.data.success) {
                alert(
                    "Home hero section created successfully."
                );

                router.push(
                    "/admin/website-content"
                );
            } else {
                alert(
                    response.data.message ||
                        "Failed to create home hero section."
                );
            }
        } catch (error) {
            console.log(
                "HOME HERO CREATE ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to create home hero section."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // RENDER
    // =====================================================

    return (
        <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3 sm:gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/website-content"
                            )
                        }
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Add Home Hero
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Create the main hero section for your home page.
                        </p>
                    </div>

                </div>

                <button
                    type="submit"
                    form="homeHeroForm"
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                >
                    <Save size={17} />

                    {saving
                        ? "Saving..."
                        : "Save Hero"}
                </button>

            </div>


            {/* =================================================
                FORM
            ================================================= */}

            <form
                id="homeHeroForm"
                onSubmit={handleSubmit}
                className="space-y-5"
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Basic Information
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Main content displayed inside the home page hero.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* EYEBROW */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Eyebrow Text
                            </label>

                            <input
                                type="text"
                                name="eyebrow"
                                value={
                                    formData.eyebrow
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="NEW COLLECTION — SS 2026"
                                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


                        {/* MAIN TITLE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Main Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Modern Living"
                                required
                                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


                        {/* HIGHLIGHTED TITLE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Highlighted Title
                            </label>

                            <input
                                type="text"
                                name="highlightedTitle"
                                value={
                                    formData.highlightedTitle
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Collection"
                                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                            <p className="mt-1.5 text-xs text-slate-400">
                                This text will be highlighted differently on the website.
                            </p>

                        </div>


                        {/* DESCRIPTION */}

                        <div className="md:col-span-2">

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Timeless furniture crafted for elegant spaces..."
                                rows={5}
                                required
                                className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    HERO BUTTONS
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Hero Buttons
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Configure the buttons displayed in the home hero.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* PRIMARY TEXT */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Primary Button Text
                            </label>

                            <input
                                type="text"
                                name="primaryButtonText"
                                value={
                                    formData.primaryButtonText
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Explore Collection"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


                        {/* PRIMARY LINK */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Primary Button Link
                            </label>

                            <input
                                type="text"
                                name="primaryButtonLink"
                                value={
                                    formData.primaryButtonLink
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="/store"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


                        {/* SECONDARY TEXT */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Secondary Button Text
                            </label>

                            <input
                                type="text"
                                name="secondaryButtonText"
                                value={
                                    formData.secondaryButtonText
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="View Collection"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


                        {/* SECONDARY LINK */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Secondary Button Link
                            </label>

                            <input
                                type="text"
                                name="secondaryButtonLink"
                                value={
                                    formData.secondaryButtonLink
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="/store"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    OFFER
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-start gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50">
                            <Percent
                                size={19}
                                className="text-teal-500"
                            />
                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Offer
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Optional promotional offer for the home hero.
                            </p>

                        </div>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-[2fr_1fr]">

                        {/* OFFER TEXT */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Offer Text
                            </label>

                            <input
                                type="text"
                                name="offerText"
                                value={
                                    formData.offerText
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Limited time offer"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


                        {/* PERCENTAGE */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Offer Percentage
                            </label>

                            <input
                                type="number"
                                name="offerPercentage"
                                value={
                                    formData.offerPercentage
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                max="100"
                                placeholder="20"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    HERO IMAGE
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Home Hero Image
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Upload the main image displayed on the home page hero.
                        </p>

                    </div>


                    {!imagePreview ? (

                        <label className="flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 text-center transition hover:border-teal-400 hover:bg-teal-50/30">

                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={
                                    handleImageChange
                                }
                                className="hidden"
                            />

                            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50">
                                <Upload
                                    size={23}
                                    className="text-teal-500"
                                />
                            </div>

                            <strong className="text-sm font-semibold text-slate-700">
                                Upload Home Hero Image
                            </strong>

                            <span className="mt-1 text-xs text-slate-500">
                                JPG, JPEG, PNG or WEBP · Max 2MB
                            </span>

                        </label>

                    ) : (

                        <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                            <img
                                src={imagePreview}
                                alt="Home Hero Preview"
                                className="block max-h-[420px] w-full object-cover"
                            />

                            <button
                                type="button"
                                onClick={
                                    removeImage
                                }
                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-md transition hover:bg-red-50"
                            >
                                <X size={18} />
                            </button>

                        </div>

                    )}

                </section>


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6">

                        <h2 className="text-lg font-bold text-slate-900">
                            Settings
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Control the visibility and display order.
                        </p>

                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* SORT ORDER */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Sort Order
                            </label>

                            <input
                                type="number"
                                name="sortOrder"
                                value={
                                    formData.sortOrder
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                className="h-11 w-full rounded-xl border border-slate-300 px-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                            <p className="mt-1.5 text-xs text-slate-400">
                                Lower number appears first.
                            </p>

                        </div>


                        {/* STATUS */}

                        <div className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 md:mt-7">

                            <div>

                                <p className="text-sm font-semibold text-slate-900">
                                    Hero Status
                                </p>

                                <p className="mt-0.5 text-xs text-slate-500">
                                    Show this hero on website
                                </p>

                            </div>


                            <label className="relative inline-flex cursor-pointer items-center">

                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={
                                        formData.status
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="peer sr-only"
                                />

                                <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-teal-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-200 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:after:translate-x-5" />

                            </label>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    BOTTOM ACTIONS
                ================================================= */}

                <div className="flex flex-col-reverse gap-3 pb-8 sm:flex-row sm:justify-end">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/website-content"
                            )
                        }
                        className="h-11 rounded-xl border border-slate-300 bg-white px-6 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-500 px-6 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                    >
                        <Save size={17} />

                        {saving
                            ? "Saving..."
                            : "Save Hero Section"}
                    </button>

                </div>

            </form>

        </div>
    );
}