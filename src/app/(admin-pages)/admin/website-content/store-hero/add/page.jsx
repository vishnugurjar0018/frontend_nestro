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
    Eye,
    Percent,
} from "lucide-react";

export default function AddStoreHeroPage() {
    const router = useRouter();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    const [formData, setFormData] = useState({
        eyebrow: "SUMMER COLLECTION 2026",
        title: "",
        highlightedTitle: "Craft",
        description: "",
        primaryButtonText: "Explore Collection",
        primaryButtonLink: "/store",
        secondaryButtonText: "View Lookbook",
        secondaryButtonLink: "/lookbook",
        offerText: "",
        offerPercentage: "0",
        status: true,
        sortOrder: "0",
    });

    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const [saving, setSaving] = useState(false);

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // =====================================================
    // HANDLE IMAGE
    // =====================================================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // 2MB frontend validation
        if (file.size > 2 * 1024 * 1024) {
            alert("Hero image must be less than 2MB.");
            e.target.value = "";
            return;
        }

        // Image type validation
        const allowedTypes = [
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, JPEG, PNG and WEBP images are allowed.");
            e.target.value = "";
            return;
        }

        setImage(file);

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setImagePreview(URL.createObjectURL(file));
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
            alert("Please enter hero description.");
            return;
        }

        if (!image) {
            alert("Please upload hero image.");
            return;
        }

        const offerPercentage = Number(formData.offerPercentage);

        if (
            Number.isNaN(offerPercentage) ||
            offerPercentage < 0 ||
            offerPercentage > 100
        ) {
            alert("Offer percentage must be between 0 and 100.");
            return;
        }

        try {
            setSaving(true);

            const data = new FormData();

            // -------------------------------------------------
            // TEXT DATA
            // -------------------------------------------------

            data.append("eyebrow", formData.eyebrow.trim());

            data.append("title", formData.title.trim());

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
                String(Number(formData.sortOrder) || 0)
            );

            // -------------------------------------------------
            // IMAGE
            // -------------------------------------------------

            data.append("image", image);

            // -------------------------------------------------
            // API
            // -------------------------------------------------

            const response = await axios.post(
                `${API_BASE_URL}/store-page-hero/create`,
                data
            );

            if (response.data.success) {
                alert("Store hero section created successfully.");

                router.push("/admin/website-content");
            } else {
                alert(
                    response.data.message ||
                    "Failed to create hero section."
                );
            }

        } catch (error) {

            console.log(
                "STORE HERO CREATE ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to create store hero section."
            );

        } finally {
            setSaving(false);
        }
    };

    // =====================================================
    // STYLES
    // =====================================================

    const labelStyle = {
        display: "block",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "600",
        color: "#111827",
        opacity: 1,
        marginBottom: "8px",
    };

    const inputStyle = {
        width: "100%",
        height: "46px",
        padding: "0 14px",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        outline: "none",
        fontSize: "14px",
        color: "#111827",
        backgroundColor: "#ffffff",
        opacity: 1,
    };

    const textareaStyle = {
        width: "100%",
        padding: "12px 14px",
        border: "1px solid #d1d5db",
        borderRadius: "10px",
        outline: "none",
        fontSize: "14px",
        lineHeight: "22px",
        color: "#111827",
        backgroundColor: "#ffffff",
        opacity: 1,
        resize: "vertical",
    };

    const sectionTitleStyle = {
        fontSize: "18px",
        fontWeight: "700",
        color: "#111827",
        margin: 0,
    };

    return (
        <div
            style={{
                minHeight: "100%",
                backgroundColor: "#f8fafc",
                padding: "30px",
            }}
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "25px",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            router.push("/admin/website-content")
                        }
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "10px",
                            border: "1px solid #dbe3ec",
                            backgroundColor: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#334155",
                        }}
                    >
                        <ArrowLeft size={19} />
                    </button>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "28px",
                                fontWeight: "700",
                                color: "#0f172a",
                            }}
                        >
                            Add Store Hero
                        </h1>

                        <p
                            style={{
                                margin: "5px 0 0",
                                fontSize: "14px",
                                color: "#64748b",
                            }}
                        >
                            Create hero section for your store page.
                        </p>
                    </div>

                </div>


                <button
                    type="submit"
                    form="storeHeroForm"
                    disabled={saving}
                    style={{
                        height: "44px",
                        padding: "0 20px",
                        border: "none",
                        borderRadius: "10px",
                        backgroundColor: saving
                            ? "#94a3b8"
                            : "#0faaa6",
                        color: "#ffffff",
                        fontSize: "14px",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        cursor: saving
                            ? "not-allowed"
                            : "pointer",
                    }}
                >
                    <Save size={17} />

                    {saving
                        ? "Saving..."
                        : "Save Hero"}
                </button>

            </div>


            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
                id="storeHeroForm"
                onSubmit={handleSubmit}
            >

                {/* ================================================= */}
                {/* BASIC INFORMATION */}
                {/* ================================================= */}

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "25px",
                        marginBottom: "20px",
                    }}
                >

                    <h2 style={sectionTitleStyle}>
                        Basic Information
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 22px",
                            color: "#64748b",
                            fontSize: "13px",
                        }}
                    >
                        Main content displayed inside the store hero.
                    </p>


                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "20px",
                        }}
                    >

                        {/* Eyebrow */}

                        <div>
                            <label style={labelStyle}>
                                Eyebrow Text
                            </label>

                            <input
                                type="text"
                                name="eyebrow"
                                value={formData.eyebrow}
                                onChange={handleChange}
                                placeholder="SUMMER COLLECTION 2026"
                                style={inputStyle}
                            />
                        </div>


                        {/* Highlighted Title */}

                        <div>
                            <label style={labelStyle}>
                                Highlighted Title
                            </label>

                            <input
                                type="text"
                                name="highlightedTitle"
                                value={
                                    formData.highlightedTitle
                                }
                                onChange={handleChange}
                                placeholder="Craft"
                                style={inputStyle}
                            />

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    fontSize: "12px",
                                    color: "#64748b",
                                }}
                            >
                                This part can be styled differently
                                on the website.
                            </p>
                        </div>


                        {/* Title */}

                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label style={labelStyle}>
                                Main Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Modern Living"
                                required
                                style={inputStyle}
                            />
                        </div>


                        {/* Description */}

                        <div
                            style={{
                                gridColumn: "1 / -1",
                            }}
                        >
                            <label style={labelStyle}>
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={handleChange}
                                placeholder="Timeless furniture crafted for elegant spaces..."
                                rows={5}
                                required
                                style={textareaStyle}
                            />
                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* BUTTONS */}
                {/* ================================================= */}

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "25px",
                        marginBottom: "20px",
                    }}
                >

                    <h2 style={sectionTitleStyle}>
                        Hero Buttons
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 22px",
                            color: "#64748b",
                            fontSize: "13px",
                        }}
                    >
                        Configure the buttons displayed in the hero.
                    </p>


                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(2, minmax(0, 1fr))",
                            gap: "20px",
                        }}
                    >

                        {/* Primary Button Text */}

                        <div>
                            <label style={labelStyle}>
                                Primary Button Text
                            </label>

                            <input
                                type="text"
                                name="primaryButtonText"
                                value={
                                    formData.primaryButtonText
                                }
                                onChange={handleChange}
                                placeholder="Explore Collection"
                                style={inputStyle}
                            />
                        </div>


                        {/* Primary Button Link */}

                        <div>
                            <label style={labelStyle}>
                                Primary Button Link
                            </label>

                            <input
                                type="text"
                                name="primaryButtonLink"
                                value={
                                    formData.primaryButtonLink
                                }
                                onChange={handleChange}
                                placeholder="/store"
                                style={inputStyle}
                            />
                        </div>


                        {/* Secondary Button Text */}

                        <div>
                            <label style={labelStyle}>
                                Secondary Button Text
                            </label>

                            <input
                                type="text"
                                name="secondaryButtonText"
                                value={
                                    formData.secondaryButtonText
                                }
                                onChange={handleChange}
                                placeholder="View Lookbook"
                                style={inputStyle}
                            />
                        </div>


                        {/* Secondary Button Link */}

                        <div>
                            <label style={labelStyle}>
                                Secondary Button Link
                            </label>

                            <input
                                type="text"
                                name="secondaryButtonLink"
                                value={
                                    formData.secondaryButtonLink
                                }
                                onChange={handleChange}
                                placeholder="/lookbook"
                                style={inputStyle}
                            />
                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* OFFER */}
                {/* ================================================= */}

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "25px",
                        marginBottom: "20px",
                    }}
                >

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "5px",
                        }}
                    >
                        <Percent
                            size={19}
                            color="#0faaa6"
                        />

                        <h2 style={sectionTitleStyle}>
                            Offer
                        </h2>
                    </div>

                    <p
                        style={{
                            margin: "5px 0 22px",
                            color: "#64748b",
                            fontSize: "13px",
                        }}
                    >
                        Optional promotional offer for this hero.
                    </p>


                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "2fr 1fr",
                            gap: "20px",
                        }}
                    >

                        <div>
                            <label style={labelStyle}>
                                Offer Text
                            </label>

                            <input
                                type="text"
                                name="offerText"
                                value={
                                    formData.offerText
                                }
                                onChange={handleChange}
                                placeholder="Get up to 20% off"
                                style={inputStyle}
                            />
                        </div>


                        <div>
                            <label style={labelStyle}>
                                Offer Percentage
                            </label>

                            <input
                                type="number"
                                name="offerPercentage"
                                value={
                                    formData.offerPercentage
                                }
                                onChange={handleChange}
                                min="0"
                                max="100"
                                placeholder="20"
                                style={inputStyle}
                            />
                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* HERO IMAGE */}
                {/* ================================================= */}

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "25px",
                        marginBottom: "20px",
                    }}
                >

                    <h2 style={sectionTitleStyle}>
                        Hero Image
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 22px",
                            color: "#64748b",
                            fontSize: "13px",
                        }}
                    >
                        Upload the main image used in the store hero.
                    </p>


                    {!imagePreview ? (

                        <label
                            style={{
                                minHeight: "220px",
                                border: "2px dashed #cbd5e1",
                                borderRadius: "14px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                backgroundColor: "#f8fafc",
                            }}
                        >

                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                onChange={handleImageChange}
                                style={{
                                    display: "none",
                                }}
                            />

                            <div
                                style={{
                                    width: "52px",
                                    height: "52px",
                                    borderRadius: "50%",
                                    backgroundColor: "#e6fffd",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: "12px",
                                }}
                            >
                                <Upload
                                    size={22}
                                    color="#0faaa6"
                                />
                            </div>

                            <strong
                                style={{
                                    fontSize: "15px",
                                    color: "#334155",
                                }}
                            >
                                Upload Hero Image
                            </strong>

                            <span
                                style={{
                                    marginTop: "5px",
                                    fontSize: "12px",
                                    color: "#64748b",
                                }}
                            >
                                JPG, JPEG, PNG or WEBP · Max 2MB
                            </span>

                        </label>

                    ) : (

                        <div
                            style={{
                                position: "relative",
                                border: "1px solid #e2e8f0",
                                borderRadius: "14px",
                                overflow: "hidden",
                                backgroundColor: "#f8fafc",
                            }}
                        >

                            <img
                                src={imagePreview}
                                alt="Hero Preview"
                                style={{
                                    width: "100%",
                                    maxHeight: "420px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />

                            <button
                                type="button"
                                onClick={removeImage}
                                style={{
                                    position: "absolute",
                                    top: "12px",
                                    right: "12px",
                                    width: "36px",
                                    height: "36px",
                                    borderRadius: "50%",
                                    border: "none",
                                    backgroundColor: "#ffffff",
                                    color: "#dc2626",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 3px 10px rgba(0,0,0,0.15)",
                                }}
                            >
                                <X size={18} />
                            </button>

                        </div>

                    )}

                </div>


                {/* ================================================= */}
                {/* SETTINGS */}
                {/* ================================================= */}

                <div
                    style={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "16px",
                        padding: "25px",
                        marginBottom: "20px",
                    }}
                >

                    <h2 style={sectionTitleStyle}>
                        Settings
                    </h2>

                    <p
                        style={{
                            margin: "5px 0 22px",
                            color: "#64748b",
                            fontSize: "13px",
                        }}
                    >
                        Control the visibility and display order.
                    </p>


                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "20px",
                        }}
                    >

                        {/* Sort Order */}

                        <div>
                            <label style={labelStyle}>
                                Sort Order
                            </label>

                            <input
                                type="number"
                                name="sortOrder"
                                value={
                                    formData.sortOrder
                                }
                                onChange={handleChange}
                                min="0"
                                style={inputStyle}
                            />

                            <p
                                style={{
                                    margin: "5px 0 0",
                                    fontSize: "12px",
                                    color: "#64748b",
                                }}
                            >
                                Lower number appears first.
                            </p>
                        </div>


                        {/* Status */}

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                border: "1px solid #e2e8f0",
                                borderRadius: "12px",
                                padding: "14px 16px",
                                marginTop: "27px",
                            }}
                        >

                            <div>

                                <div
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "600",
                                        color: "#111827",
                                    }}
                                >
                                    Hero Status
                                </div>

                                <div
                                    style={{
                                        fontSize: "12px",
                                        color: "#64748b",
                                        marginTop: "3px",
                                    }}
                                >
                                    Show this hero on website
                                </div>

                            </div>


                            <label
                                style={{
                                    position: "relative",
                                    width: "48px",
                                    height: "26px",
                                    display: "inline-block",
                                }}
                            >

                                <input
                                    type="checkbox"
                                    name="status"
                                    checked={
                                        formData.status
                                    }
                                    onChange={handleChange}
                                    style={{
                                        opacity: 0,
                                        width: 0,
                                        height: 0,
                                    }}
                                />

                                <span
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: "20px",
                                        backgroundColor:
                                            formData.status
                                                ? "#0faaa6"
                                                : "#cbd5e1",
                                        cursor: "pointer",
                                        transition:
                                            "0.2s",
                                    }}
                                >

                                    <span
                                        style={{
                                            position: "absolute",
                                            width: "20px",
                                            height: "20px",
                                            left:
                                                formData.status
                                                    ? "25px"
                                                    : "3px",
                                            top: "3px",
                                            borderRadius:
                                                "50%",
                                            backgroundColor:
                                                "#ffffff",
                                            transition:
                                                "0.2s",
                                        }}
                                    />

                                </span>

                            </label>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* BOTTOM ACTIONS */}
                {/* ================================================= */}

                <div
                    style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: "12px",
                        paddingBottom: "30px",
                    }}
                >

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/website-content"
                            )
                        }
                        style={{
                            height: "44px",
                            padding: "0 22px",
                            borderRadius: "10px",
                            border: "1px solid #cbd5e1",
                            backgroundColor: "#ffffff",
                            color: "#334155",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            height: "44px",
                            padding: "0 22px",
                            borderRadius: "10px",
                            border: "none",
                            backgroundColor: saving
                                ? "#94a3b8"
                                : "#0faaa6",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "600",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            cursor: saving
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        <Save size={17} />

                        {saving
                            ? "Saving..."
                            : "Save Hero Section"}
                    </button>

                </div>

            </form>


            {/* ================================================= */}
            {/* GLOBAL PLACEHOLDER FIX */}
            {/* ================================================= */}

            <style jsx global>{`
                input::placeholder,
                textarea::placeholder {
                    color: #64748b !important;
                    opacity: 1 !important;
                }

                input,
                textarea,
                select,
                label,
                p,
                h1,
                h2,
                h3,
                span {
                    opacity: 1 !important;
                }

                @media (max-width: 768px) {
                    form > div {
                        padding: 18px !important;
                    }
                }
            `}</style>

        </div>
    );
}