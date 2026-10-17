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
    Eye,
    Link as LinkIcon,
    Tag,
    LayoutTemplate,
} from "lucide-react";

export default function EditStoreHeroPage() {
    const router = useRouter();
    const params = useParams();

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api";

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
    // FETCH HERO
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
                `${API_BASE_URL}/store-page-hero/${id}`
            );

            console.log("STORE HERO RESPONSE:", response.data);

            if (response.data?.success) {
                const hero = response.data.data;

                setFormData({
                    eyebrow: hero?.eyebrow || "",
                    title: hero?.title || "",
                    highlightedTitle: hero?.highlightedTitle || "",
                    description: hero?.description || "",

                    primaryButtonText:
                        hero?.primaryButtonText || "",

                    primaryButtonLink:
                        hero?.primaryButtonLink || "",

                    secondaryButtonText:
                        hero?.secondaryButtonText || "",

                    secondaryButtonLink:
                        hero?.secondaryButtonLink || "",

                    offerText: hero?.offerText || "",

                    offerPercentage:
                        hero?.offerPercentage !== undefined
                            ? String(hero.offerPercentage)
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

                setExistingImage(hero?.image || "");
            } else {
                alert(
                    response.data?.message ||
                        "Failed to fetch hero section."
                );

                router.push("/admin/website-content");
            }
        } catch (error) {
            console.log("STORE HERO FETCH ERROR:", error);
            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load hero section."
            );

            router.push("/admin/website-content");
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

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

        // 1 MB
        if (file.size > 1 * 1024 * 1024) {
            alert("Image must be less than 1MB.");
            e.target.value = "";
            return;
        }

        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");
            e.target.value = "";
            return;
        }

        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        setNewImage(file);

        const previewUrl = URL.createObjectURL(file);
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
    // UPDATE HERO
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
            alert("Hero description is required.");
            return;
        }

        if (
            Number(formData.offerPercentage) < 0 ||
            Number(formData.offerPercentage) > 100
        ) {
            alert(
                "Offer percentage must be between 0 and 100."
            );
            return;
        }

        try {
            setSaving(true);

            const data = new FormData();

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

            data.append(
                "primaryButtonText",
                formData.primaryButtonText.trim()
            );

            data.append(
                "primaryButtonLink",
                formData.primaryButtonLink.trim()
            );

            data.append(
                "secondaryButtonText",
                formData.secondaryButtonText.trim()
            );

            data.append(
                "secondaryButtonLink",
                formData.secondaryButtonLink.trim()
            );

            data.append(
                "offerText",
                formData.offerText.trim()
            );

            data.append(
                "offerPercentage",
                String(
                    formData.offerPercentage || 0
                )
            );

            data.append(
                "status",
                String(formData.status)
            );

            data.append(
                "sortOrder",
                String(formData.sortOrder || 0)
            );

            // New image only
            if (newImage) {
                data.append("image", newImage);
            }

            const response = await axios.patch(
                `${API_BASE_URL}/store-page-hero/${id}`,
                data
            );

            console.log(
                "STORE HERO UPDATE RESPONSE:",
                response.data
            );

            if (response.data?.success) {
                alert(
                    "Store hero section updated successfully."
                );

                router.push(
                    "/admin/website-content"
                );
            } else {
                alert(
                    response.data?.message ||
                        "Failed to update hero section."
                );
            }
        } catch (error) {
            console.log(
                "STORE HERO UPDATE ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update hero section."
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
        marginBottom: "8px",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "600",
        color: "#111827",
        opacity: 1,
    };

    const inputStyle = {
        width: "100%",
        height: "46px",
        padding: "0 14px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
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
        borderRadius: "12px",
        outline: "none",
        fontSize: "14px",
        lineHeight: "22px",
        color: "#111827",
        backgroundColor: "#ffffff",
        resize: "vertical",
        opacity: 1,
    };

    const sectionStyle = {
        background: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "20px",
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    background: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#111827",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        fontSize: "16px",
                    }}
                >
                    <Loader2
                        size={22}
                        style={{
                            animation:
                                "spin 1s linear infinite",
                        }}
                    />

                    Loading hero section...
                </div>

                <style jsx global>{`
                    @keyframes spin {
                        from {
                            transform: rotate(0deg);
                        }

                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}</style>
            </div>
        );
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f8fafc",
                color: "#111827",
                padding: "30px",
                opacity: 1,
            }}
        >
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "28px",
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
                            router.push(
                                "/admin/website-content"
                            )
                        }
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            border: "1px solid #d1d5db",
                            background: "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            color: "#111827",
                        }}
                    >
                        <ArrowLeft size={20} />
                    </button>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "28px",
                                lineHeight: "36px",
                                fontWeight: "700",
                                color: "#111827",
                            }}
                        >
                            Edit Store Hero
                        </h1>

                        <p
                            style={{
                                margin: "4px 0 0",
                                color: "#6b7280",
                                fontSize: "14px",
                            }}
                        >
                            Update your store page hero
                            section.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    form="storeHeroForm"
                    disabled={saving}
                    style={{
                        height: "46px",
                        padding: "0 20px",
                        border: "none",
                        borderRadius: "12px",
                        background:
                            saving
                                ? "#9ca3af"
                                : "#08b7ad",
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
                    {saving ? (
                        <>
                            <Loader2
                                size={18}
                                style={{
                                    animation:
                                        "spin 1s linear infinite",
                                }}
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

                <div style={sectionStyle}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            marginBottom: "22px",
                        }}
                    >
                        <div
                            style={{
                                width: "42px",
                                height: "42px",
                                borderRadius: "12px",
                                background: "#ecfeff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#08a9a1",
                            }}
                        >
                            <LayoutTemplate size={21} />
                        </div>

                        <div>
                            <h2
                                style={{
                                    ...labelStyle,
                                    fontSize: "18px",
                                    marginBottom: "2px",
                                }}
                            >
                                Hero Content
                            </h2>

                            <p
                                style={{
                                    margin: 0,
                                    fontSize: "13px",
                                    color: "#6b7280",
                                }}
                            >
                                Main content displayed on
                                the store page hero.
                            </p>
                        </div>
                    </div>

                    {/* Eyebrow */}

                    <div
                        style={{
                            marginBottom: "20px",
                        }}
                    >
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

                    {/* Title */}

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "18px",
                            marginBottom: "20px",
                        }}
                    >
                        <div>
                            <label style={labelStyle}>
                                Main Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="Modern Living"
                                style={inputStyle}
                            />
                        </div>

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
                        </div>
                    </div>

                    {/* Description */}

                    <div>
                        <label style={labelStyle}>
                            Description *
                        </label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Write your hero section description..."
                            rows={5}
                            style={textareaStyle}
                        />
                    </div>
                </div>

                {/* ================================================= */}
                {/* BUTTONS */}
                {/* ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "22px",
                        }}
                    >
                        <LinkIcon
                            size={20}
                            color="#08a9a1"
                        />

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#111827",
                            }}
                        >
                            Hero Buttons
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "24px",
                        }}
                    >
                        {/* Primary */}

                        <div
                            style={{
                                padding: "18px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "14px",
                                background: "#fafafa",
                            }}
                        >
                            <h3
                                style={{
                                    margin: "0 0 16px",
                                    fontSize: "15px",
                                    color: "#111827",
                                }}
                            >
                                Primary Button
                            </h3>

                            <div
                                style={{
                                    marginBottom:
                                        "14px",
                                }}
                            >
                                <label
                                    style={labelStyle}
                                >
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
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label
                                    style={labelStyle}
                                >
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
                                    style={inputStyle}
                                />
                            </div>
                        </div>

                        {/* Secondary */}

                        <div
                            style={{
                                padding: "18px",
                                border: "1px solid #e5e7eb",
                                borderRadius: "14px",
                                background: "#fafafa",
                            }}
                        >
                            <h3
                                style={{
                                    margin: "0 0 16px",
                                    fontSize: "15px",
                                    color: "#111827",
                                }}
                            >
                                Secondary Button
                            </h3>

                            <div
                                style={{
                                    marginBottom:
                                        "14px",
                                }}
                            >
                                <label
                                    style={labelStyle}
                                >
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
                                    placeholder="View Lookbook"
                                    style={inputStyle}
                                />
                            </div>

                            <div>
                                <label
                                    style={labelStyle}
                                >
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
                                    placeholder="/lookbook"
                                    style={inputStyle}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* OFFER */}
                {/* ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "22px",
                        }}
                    >
                        <Tag
                            size={20}
                            color="#08a9a1"
                        />

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#111827",
                            }}
                        >
                            Offer
                        </h2>
                    </div>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 220px",
                            gap: "18px",
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
                                placeholder="Get ready for summer with special offers"
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
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* HERO IMAGE */}
                {/* ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            marginBottom: "22px",
                        }}
                    >
                        <ImageIcon
                            size={20}
                            color="#08a9a1"
                        />

                        <h2
                            style={{
                                margin: 0,
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "#111827",
                            }}
                        >
                            Hero Image
                        </h2>
                    </div>

                    {/* New Image Preview */}

                    {imagePreview ? (
                        <div
                            style={{
                                position: "relative",
                                borderRadius: "14px",
                                overflow: "hidden",
                                border: "1px solid #d1d5db",
                                marginBottom: "18px",
                            }}
                        >
                            <img
                                src={imagePreview}
                                alt="New hero preview"
                                style={{
                                    width: "100%",
                                    height: "360px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />

                            <button
                                type="button"
                                onClick={
                                    removeNewImage
                                }
                                style={{
                                    position:
                                        "absolute",
                                    top: "12px",
                                    right: "12px",
                                    width: "38px",
                                    height: "38px",
                                    borderRadius: "50%",
                                    border: "none",
                                    background:
                                        "#ffffff",
                                    color: "#dc2626",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    cursor: "pointer",
                                    boxShadow:
                                        "0 4px 12px rgba(0,0,0,0.15)",
                                }}
                            >
                                <X size={19} />
                            </button>

                            <div
                                style={{
                                    position:
                                        "absolute",
                                    bottom: "12px",
                                    left: "12px",
                                    padding:
                                        "7px 12px",
                                    borderRadius: "8px",
                                    background:
                                        "rgba(0,0,0,0.65)",
                                    color: "#ffffff",
                                    fontSize: "12px",
                                }}
                            >
                                New Image
                            </div>
                        </div>
                    ) : existingImage ? (
                        <div
                            style={{
                                position: "relative",
                                borderRadius: "14px",
                                overflow: "hidden",
                                border: "1px solid #d1d5db",
                                marginBottom: "18px",
                            }}
                        >
                            <img
                                src={existingImage}
                                alt="Current hero"
                                style={{
                                    width: "100%",
                                    height: "360px",
                                    objectFit: "cover",
                                    display: "block",
                                }}
                            />

                            <div
                                style={{
                                    position:
                                        "absolute",
                                    bottom: "12px",
                                    left: "12px",
                                    padding:
                                        "7px 12px",
                                    borderRadius: "8px",
                                    background:
                                        "rgba(0,0,0,0.65)",
                                    color: "#ffffff",
                                    fontSize: "12px",
                                }}
                            >
                                Current Image
                            </div>
                        </div>
                    ) : (
                        <div
                            style={{
                                height: "220px",
                                borderRadius: "14px",
                                border: "1px dashed #cbd5e1",
                                background: "#f8fafc",
                                display: "flex",
                                flexDirection:
                                    "column",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                color: "#64748b",
                                marginBottom: "18px",
                            }}
                        >
                            <ImageIcon
                                size={40}
                                strokeWidth={1.5}
                            />

                            <p
                                style={{
                                    margin:
                                        "10px 0 0",
                                    fontSize: "14px",
                                }}
                            >
                                No hero image
                                uploaded
                            </p>
                        </div>
                    )}

                    {/* Upload */}

                    <label
                        htmlFor="heroImage"
                        style={{
                            minHeight: "120px",
                            border: "1px dashed #94a3b8",
                            borderRadius: "14px",
                            background: "#f8fafc",
                            display: "flex",
                            flexDirection:
                                "column",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            cursor: "pointer",
                            color: "#475569",
                        }}
                    >
                        <Upload size={25} />

                        <span
                            style={{
                                marginTop: "8px",
                                fontSize: "14px",
                                fontWeight: "600",
                            }}
                        >
                            Change Hero Image
                        </span>

                        <span
                            style={{
                                marginTop: "4px",
                                fontSize: "12px",
                                color: "#64748b",
                            }}
                        >
                            JPG, JPEG, PNG or WEBP
                            • Max 1MB
                        </span>

                        <input
                            id="heroImage"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={
                                handleImageChange
                            }
                            style={{
                                display: "none",
                            }}
                        />
                    </label>
                </div>

                {/* ================================================= */}
                {/* SETTINGS */}
                {/* ================================================= */}

                <div style={sectionStyle}>
                    <h2
                        style={{
                            margin: "0 0 22px",
                            fontSize: "18px",
                            fontWeight: "600",
                            color: "#111827",
                        }}
                    >
                        Section Settings
                    </h2>

                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "18px",
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
                                    margin:
                                        "6px 0 0",
                                    fontSize: "12px",
                                    color: "#6b7280",
                                }}
                            >
                                Lower number appears
                                first.
                            </p>
                        </div>

                        {/* Status */}

                        <div>
                            <label style={labelStyle}>
                                Status
                            </label>

                            <div
                                style={{
                                    height: "46px",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "12px",
                                    padding:
                                        "0 14px",
                                    display: "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    background:
                                        "#ffffff",
                                }}
                            >
                                <div>
                                    <span
                                        style={{
                                            fontSize:
                                                "14px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#111827",
                                        }}
                                    >
                                        {formData.status
                                            ? "Active"
                                            : "Inactive"}
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,
                                                status:
                                                    !prev.status,
                                            })
                                        )
                                    }
                                    style={{
                                        width: "48px",
                                        height: "26px",
                                        borderRadius:
                                            "999px",
                                        border: "none",
                                        background:
                                            formData.status
                                                ? "#08b7ad"
                                                : "#cbd5e1",
                                        cursor: "pointer",
                                        padding:
                                            "3px",
                                        display:
                                            "flex",
                                        justifyContent:
                                            formData.status
                                                ? "flex-end"
                                                : "flex-start",
                                        transition:
                                            "0.2s",
                                    }}
                                >
                                    <span
                                        style={{
                                            width: "20px",
                                            height: "20px",
                                            borderRadius:
                                                "50%",
                                            background:
                                                "#ffffff",
                                            display:
                                                "block",
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ================================================= */}
                {/* BOTTOM ACTIONS */}
                {/* ================================================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
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
                            height: "46px",
                            padding: "0 20px",
                            border: "1px solid #d1d5db",
                            borderRadius: "12px",
                            background: "#ffffff",
                            color: "#374151",
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
                            height: "46px",
                            padding: "0 22px",
                            border: "none",
                            borderRadius: "12px",
                            background:
                                saving
                                    ? "#9ca3af"
                                    : "#08b7ad",
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
                        {saving ? (
                            <>
                                <Loader2
                                    size={18}
                                    style={{
                                        animation:
                                            "spin 1s linear infinite",
                                    }}
                                />

                                Updating...
                            </>
                        ) : (
                            <>
                                <Save size={18} />

                                Update Hero
                            </>
                        )}
                    </button>
                </div>
            </form>

            {/* ================================================= */}
            {/* GLOBAL STYLES */}
            {/* ================================================= */}

            <style jsx global>{`
                input::placeholder,
                textarea::placeholder {
                    color: #6b7280 !important;
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

                @keyframes spin {
                    from {
                        transform: rotate(0deg);
                    }

                    to {
                        transform: rotate(360deg);
                    }
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