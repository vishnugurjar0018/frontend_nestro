"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";

import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    X,
    Save,
    Loader2,
    Link as LinkIcon,
    Tag,
    LayoutTemplate,
} from "lucide-react";

export default function EditHomeHeroPage() {
    const router = useRouter();
    const params = useParams();

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "http://localhost:5000/api";

    const id = params?.id;

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        eyebrow: "",
        title: "",
        highlightedTitle: "",
        description: "",

        primaryButtonText: "",
        primaryButtonLink: "",

        secondaryButtonText: "",
        secondaryButtonLink: "",

        offerText: "",
        offerPercentage: "0",

        status: true,
        sortOrder: "0",
    });

    // =====================================================
    // IMAGE
    // =====================================================

    const [existingImage, setExistingImage] = useState("");
    const [newImage, setNewImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    // =====================================================
    // STATES
    // =====================================================

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // =====================================================
    // FETCH HOME HERO
    // =====================================================

    useEffect(() => {
        if (id) {
            fetchHeroSection();
        }
    }, [id]);

    const fetchHeroSection = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/home-page-hero/${id}`
            );

            console.log(
                "HOME HERO RESPONSE:",
                response.data
            );

            if (response.data?.success) {
                const hero = response.data.data;

                setFormData({
                    eyebrow: hero?.eyebrow || "",
                    title: hero?.title || "",
                    highlightedTitle:
                        hero?.highlightedTitle || "",

                    description:
                        hero?.description || "",

                    primaryButtonText:
                        hero?.primaryButtonText || "",

                    primaryButtonLink:
                        hero?.primaryButtonLink || "",

                    secondaryButtonText:
                        hero?.secondaryButtonText || "",

                    secondaryButtonLink:
                        hero?.secondaryButtonLink || "",

                    offerText:
                        hero?.offerText || "",

                    offerPercentage:
                        hero?.offerPercentage !== undefined
                            ? String(
                                  hero.offerPercentage
                              )
                            : "0",

                    status:
                        hero?.status !== undefined
                            ? Boolean(hero.status)
                            : true,

                    sortOrder:
                        hero?.sortOrder !== undefined
                            ? String(hero.sortOrder)
                            : "0",
                });

                setExistingImage(
                    hero?.image || ""
                );
            } else {
                alert(
                    response.data?.message ||
                        "Failed to fetch home hero section."
                );

                router.push(
                    "/admin/website-content"
                );
            }
        } catch (error) {
            console.log(
                "HOME HERO FETCH ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load home hero section."
            );

            router.push(
                "/admin/website-content"
            );
        } finally {
            setLoading(false);
        }
    };

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
    // IMAGE CHANGE
    // =====================================================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // Backend limit = 1MB
        if (file.size > 1 * 1024 * 1024) {
            alert(
                "Image must be less than 1MB."
            );

            e.target.value = "";
            return;
        }

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

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setNewImage(file);

        const previewUrl =
            URL.createObjectURL(file);

        setImagePreview(previewUrl);
    };

    // =====================================================
    // REMOVE NEW IMAGE
    // =====================================================

    const removeNewImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setNewImage(null);
        setImagePreview("");
    };

    // =====================================================
    // UPDATE HOME HERO
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

        if (!formData.title.trim()) {
            alert("Hero title is required.");
            return;
        }

        if (!formData.description.trim()) {
            alert(
                "Hero description is required."
            );
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
            // NEW IMAGE
            // -------------------------------------------------

            if (newImage) {
                data.append(
                    "image",
                    newImage
                );
            }

            // -------------------------------------------------
            // HOME HERO UPDATE API
            // -------------------------------------------------

            const response = await axios.patch(
                `${API_BASE_URL}/home-page-hero/${id}`,
                data
            );

            console.log(
                "HOME HERO UPDATE RESPONSE:",
                response.data
            );

            if (response.data?.success) {
                alert(
                    "Home hero section updated successfully."
                );

                router.push(
                    "/admin/website-content"
                );
            } else {
                alert(
                    response.data?.message ||
                        "Failed to update home hero section."
                );
            }
        } catch (error) {
            console.log(
                "HOME HERO UPDATE ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update home hero section."
            );
        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">

                <div className="flex items-center gap-3 text-sm text-slate-600">

                    <Loader2
                        size={22}
                        className="animate-spin text-teal-500"
                    />

                    Loading home hero section...

                </div>

            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-slate-50 p-4 text-slate-900 sm:p-6 lg:p-8">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3 sm:gap-4">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/website-content"
                            )
                        }
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50"
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>

                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                            Edit Home Hero
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            Update your home page hero section.
                        </p>

                    </div>

                </div>


                <button
                    type="submit"
                    form="homeHeroForm"
                    disabled={saving}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-teal-500 px-5 text-sm font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-400"
                >

                    {saving ? (
                        <>
                            <Loader2
                                size={18}
                                className="animate-spin"
                            />

                            Saving...
                        </>
                    ) : (
                        <>
                            <Save size={18} />

                            Save Changes
                        </>
                    )}

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

                    <div className="mb-6 flex items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-500">
                            <LayoutTemplate size={21} />
                        </div>

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Home Hero Content
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-500">
                                Main content displayed on the home page hero.
                            </p>

                        </div>

                    </div>


                    {/* EYEBROW */}

                    <div className="mb-5">

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


                    {/* TITLE */}

                    <div className="mb-5 grid grid-cols-1 gap-5 md:grid-cols-2">

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
                                This part will be highlighted differently on the website.
                            </p>

                        </div>

                    </div>


                    {/* DESCRIPTION */}

                    <div>

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

                </section>


                {/* =================================================
                    BUTTONS
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <LinkIcon
                            size={20}
                            className="text-teal-500"
                        />

                        <h2 className="text-lg font-bold text-slate-900">
                            Home Hero Buttons
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                        {/* PRIMARY */}

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <h3 className="mb-4 text-sm font-bold text-slate-900">
                                Primary Button
                            </h3>

                            <div className="mb-4">

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Button Text
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
                                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Button Link
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
                                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                />

                            </div>

                        </div>


                        {/* SECONDARY */}

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                            <h3 className="mb-4 text-sm font-bold text-slate-900">
                                Secondary Button
                            </h3>

                            <div className="mb-4">

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Button Text
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
                                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                />

                            </div>


                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-900">
                                    Button Link
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
                                    className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                                />

                            </div>

                        </div>

                    </div>

                </section>


                {/* =================================================
                    OFFER
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <Tag
                            size={20}
                            className="text-teal-500"
                        />

                        <h2 className="text-lg font-bold text-slate-900">
                            Offer
                        </h2>

                    </div>


                    <div className="grid grid-cols-1 gap-5 md:grid-cols-[1fr_220px]">

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
                                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>


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
                                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                        </div>

                    </div>

                </section>


                {/* =================================================
                    HERO IMAGE
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <div className="mb-6 flex items-center gap-3">

                        <ImageIcon
                            size={20}
                            className="text-teal-500"
                        />

                        <div>

                            <h2 className="text-lg font-bold text-slate-900">
                                Home Hero Image
                            </h2>

                            <p className="mt-0.5 text-sm text-slate-500">
                                Main image displayed on the home page.
                            </p>

                        </div>

                    </div>


                    {/* NEW IMAGE */}

                    {imagePreview ? (

                        <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200">

                            <img
                                src={imagePreview}
                                alt="New home hero preview"
                                className="block h-[220px] w-full object-cover sm:h-[320px] lg:h-[360px]"
                            />

                            <button
                                type="button"
                                onClick={
                                    removeNewImage
                                }
                                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow-lg transition hover:bg-red-50"
                            >
                                <X size={19} />
                            </button>

                            <span className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-medium text-white">
                                New Image
                            </span>

                        </div>

                    ) : existingImage ? (

                        <div className="relative mb-5 overflow-hidden rounded-2xl border border-slate-200">

                            <img
                                src={existingImage}
                                alt="Current home hero"
                                className="block h-[220px] w-full object-cover sm:h-[320px] lg:h-[360px]"
                            />

                            <span className="absolute bottom-3 left-3 rounded-lg bg-black/65 px-3 py-1.5 text-xs font-medium text-white">
                                Current Image
                            </span>

                        </div>

                    ) : (

                        <div className="mb-5 flex h-[220px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-slate-400">

                            <ImageIcon
                                size={40}
                                strokeWidth={1.5}
                            />

                            <p className="mt-2 text-sm">
                                No hero image uploaded
                            </p>

                        </div>

                    )}


                    {/* UPLOAD */}

                    <label
                        htmlFor="heroImage"
                        className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 text-center text-slate-600 transition hover:border-teal-400 hover:bg-teal-50/30"
                    >

                        <Upload size={25} />

                        <span className="mt-2 text-sm font-semibold">
                            Change Home Hero Image
                        </span>

                        <span className="mt-1 text-xs text-slate-500">
                            JPG, JPEG, PNG or WEBP • Max 1MB
                        </span>

                        <input
                            id="heroImage"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={
                                handleImageChange
                            }
                            className="hidden"
                        />

                    </label>

                </section>


                {/* =================================================
                    SETTINGS
                ================================================= */}

                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">

                    <h2 className="mb-6 text-lg font-bold text-slate-900">
                        Section Settings
                    </h2>


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
                                className="h-11 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
                            />

                            <p className="mt-1.5 text-xs text-slate-400">
                                Lower number appears first.
                            </p>

                        </div>


                        {/* STATUS */}

                        <div>

                            <label className="mb-2 block text-sm font-semibold text-slate-900">
                                Status
                            </label>

                            <div className="flex h-11 items-center justify-between rounded-xl border border-slate-300 bg-white px-4">

                                <span className="text-sm font-semibold text-slate-900">
                                    {formData.status
                                        ? "Active"
                                        : "Inactive"}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(
                                            (prev) => ({
                                                ...prev,
                                                status:
                                                    !prev.status,
                                            })
                                        )
                                    }
                                    className={`relative flex h-6 w-11 items-center rounded-full p-[3px] transition ${
                                        formData.status
                                            ? "justify-end bg-teal-500"
                                            : "justify-start bg-slate-300"
                                    }`}
                                >
                                    <span className="block h-5 w-5 rounded-full bg-white shadow-sm" />
                                </button>

                            </div>

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

                        {saving ? (
                            <>
                                <Loader2
                                    size={18}
                                    className="animate-spin"
                                />

                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />

                                Update Home Hero
                            </>
                        )}

                    </button>

                </div>

            </form>

        </div>
    );
}