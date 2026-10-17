"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    Upload,
    Image as ImageIcon,
    X,
    Save,
    Package,
    ChevronDown,
} from "lucide-react";

export default function AddProductPage() {
    const router = useRouter();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

    // =====================================================
    // FORM DATA
    // =====================================================

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        shortDescription: "",
        description: "",

        categoryID: "",
        roomID: "",

        price: "",
        discount: "0",

        stock: true,

        material: "Wood",
        color: "",

        length: "",
        width: "",
        height: "",
        dimensionUnit: "cm",

        weight: "",
        weightUnit: "kg",

        featured: false,
        newArrival: false,
        status: true,
    });

    // =====================================================
    // CATEGORY / ROOM
    // =====================================================

    const [categories, setCategories] = useState([]);
    const [rooms, setRooms] = useState([]);

    const [categoryLoading, setCategoryLoading] = useState(true);
    const [roomLoading, setRoomLoading] = useState(true);

    // =====================================================
    // SAVE STATE
    // =====================================================

    const [saving, setSaving] = useState(false);

    // =====================================================
    // IMAGE STATES
    // =====================================================

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState("");

    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryPreviews, setGalleryPreviews] = useState([]);

    // =====================================================
    // AUTOMATIC FINAL PRICE
    // =====================================================

    const finalPrice = Math.round(
        Number(formData.price || 0) -
        (Number(formData.price || 0) *
            Number(formData.discount || 0)) /
        100
    );

    // =====================================================
    // FETCH CATEGORY + ROOM
    // =====================================================

    useEffect(() => {
        fetchCategories();
        fetchRooms();
    }, []);

    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    const fetchCategories = async () => {
        try {
            setCategoryLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/category`
            );

            if (response.data.success) {
                setCategories(response.data.data || []);
            }
        } catch (error) {
            console.log("CATEGORY FETCH ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load categories."
            );
        } finally {
            setCategoryLoading(false);
        }
    };

    // =====================================================
    // FETCH ROOMS
    // =====================================================

    const fetchRooms = async () => {
        try {
            setRoomLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/room`
            );

            if (response.data.success) {
                setRooms(response.data.data || []);
            }
        } catch (error) {
            console.log("ROOM FETCH ERROR:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load rooms."
            );
        } finally {
            setRoomLoading(false);
        }
    };

    // =====================================================
    // SLUG GENERATOR
    // =====================================================

    const generateSlug = (value) => {
        return value
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/--+/g, "-");
    };

    // =====================================================
    // PRODUCT NAME CHANGE
    // =====================================================

    const handleNameChange = (e) => {
        const value = e.target.value;

        setFormData((prev) => ({
            ...prev,
            name: value,
            slug: generateSlug(value),
        }));
    };

    // =====================================================
    // COMMON INPUT CHANGE
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
    // THUMBNAIL CHANGE
    // =====================================================

    const handleThumbnailChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        // 1 MB validation
        if (file.size > 1 * 1024 * 1024) {
            alert(
                "Thumbnail image must be less than 1MB."
            );

            e.target.value = "";
            return;
        }

        // Image type validation
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image.");

            e.target.value = "";
            return;
        }

        setThumbnail(file);

        setThumbnailPreview(
            URL.createObjectURL(file)
        );
    };

    // =====================================================
    // REMOVE THUMBNAIL
    // =====================================================

    const removeThumbnail = () => {
        if (thumbnailPreview) {
            URL.revokeObjectURL(thumbnailPreview);
        }

        setThumbnail(null);
        setThumbnailPreview("");
    };

    // =====================================================
    // GALLERY CHANGE
    // =====================================================

    const handleGalleryChange = (e) => {
        const files = Array.from(
            e.target.files || []
        );

        if (!files.length) return;

        const remainingSlots =
            10 - galleryImages.length;

        if (remainingSlots <= 0) {
            alert(
                "Maximum 10 gallery images are allowed."
            );

            e.target.value = "";
            return;
        }

        const selectedFiles = files.slice(
            0,
            remainingSlots
        );

        const validFiles = selectedFiles.filter(
            (file) => {
                if (file.size > 1 * 1024 * 1024) {
                    alert(
                        `${file.name} is larger than 1MB and was not added.`
                    );

                    return false;
                }

                if (!file.type.startsWith("image/")) {
                    alert(
                        `${file.name} is not a valid image.`
                    );

                    return false;
                }

                return true;
            }
        );

        const newPreviews = validFiles.map(
            (file) =>
                URL.createObjectURL(file)
        );

        setGalleryImages((prev) => [
            ...prev,
            ...validFiles,
        ]);

        setGalleryPreviews((prev) => [
            ...prev,
            ...newPreviews,
        ]);

        e.target.value = "";
    };

    // =====================================================
    // REMOVE GALLERY IMAGE
    // =====================================================

    const removeGalleryImage = (index) => {
        const preview =
            galleryPreviews[index];

        if (preview) {
            URL.revokeObjectURL(preview);
        }

        setGalleryImages((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );

        setGalleryPreviews((prev) =>
            prev.filter(
                (_, i) => i !== index
            )
        );
    };

    // =====================================================
    // SUBMIT PRODUCT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // =================================================
        // VALIDATION
        // =================================================

        if (!formData.name.trim()) {
            alert("Please enter product name.");
            return;
        }

        if (!formData.slug.trim()) {
            alert("Please enter product slug.");
            return;
        }

        if (!formData.categoryID) {
            alert("Please select category.");
            return;
        }

        if (!formData.roomID) {
            alert("Please select room.");
            return;
        }

        if (!formData.price) {
            alert("Please enter product price.");
            return;
        }

        if (Number(formData.price) < 200) {
            alert(
                "Product price must be at least ₹200."
            );
            return;
        }

        if (
            Number(formData.discount) < 0 ||
            Number(formData.discount) > 100
        ) {
            alert(
                "Discount must be between 0% and 100%."
            );
            return;
        }

        if (!thumbnail) {
            alert(
                "Please upload product thumbnail."
            );
            return;
        }

        try {
            setSaving(true);

            // =================================================
            // FORM DATA
            // =================================================

            const data = new FormData();

            data.append(
                "name",
                formData.name.trim()
            );

            data.append(
                "slug",
                formData.slug.trim()
            );

            data.append(
                "shortDescription",
                formData.shortDescription.trim()
            );

            data.append(
                "description",
                formData.description.trim()
            );

            data.append(
                "categoryID",
                formData.categoryID
            );

            data.append(
                "roomID",
                formData.roomID
            );

            data.append(
                "price",
                formData.price
            );

            data.append(
                "discount",
                formData.discount || "0"
            );

            data.append(
                "stock",
                String(formData.stock)
            );

            data.append(
                "material",
                formData.material
            );

            data.append(
                "color",
                formData.color.trim()
            );

            // =================================================
            // DIMENSIONS
            // =================================================

            const dimensions = {
                length: formData.length
                    ? Number(formData.length)
                    : null,

                width: formData.width
                    ? Number(formData.width)
                    : null,

                height: formData.height
                    ? Number(formData.height)
                    : null,

                unit: formData.dimensionUnit,
            };

            data.append(
                "dimensions",
                JSON.stringify(dimensions)
            );

            // =================================================
            // WEIGHT
            // =================================================

            const weight = {
                value: formData.weight
                    ? Number(formData.weight)
                    : null,

                unit: formData.weightUnit,
            };

            data.append(
                "weight",
                JSON.stringify(weight)
            );

            // =================================================
            // SETTINGS
            // =================================================

            data.append(
                "featured",
                String(formData.featured)
            );

            data.append(
                "newArrival",
                String(formData.newArrival)
            );

            data.append(
                "status",
                String(formData.status)
            );

            // =================================================
            // THUMBNAIL
            // =================================================

            data.append(
                "thumbnail",
                thumbnail
            );

            // =================================================
            // GALLERY IMAGES
            // =================================================

            galleryImages.forEach((file) => {
                data.append(
                    "images",
                    file
                );
            });

            // =================================================
            // API CALL
            // =================================================

            const response = await axios.post(
                `${API_BASE_URL}/product/create`,
                data
            );

            if (response.data.success) {
                alert(
                    "Product created successfully."
                );

                router.push(
                    "/admin/products"
                );
            }
        } catch (error) {
            console.log(
                "PRODUCT CREATE ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to create product."
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
        height: "44px",
        padding: "0 14px",
        border: "1px solid #d1d5db",
        borderRadius: "12px",
        outline: "none",
        fontSize: "14px",
        lineHeight: "20px",
        fontWeight: "400",
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
        fontWeight: "400",
        color: "#111827",
        backgroundColor: "#ffffff",
        opacity: 1,
        resize: "vertical",
    };

    const sectionTitleStyle = {
        fontSize: "18px",
        lineHeight: "28px",
        fontWeight: "600",
        color: "#111827",
        opacity: 1,
        margin: 0,
    };

    const sectionDescriptionStyle = {
        fontSize: "12px",
        lineHeight: "18px",
        color: "#6b7280",
        opacity: 1,
        margin: "4px 0 0",
    };

    const helpTextStyle = {
        fontSize: "12px",
        lineHeight: "18px",
        color: "#6b7280",
        opacity: 1,
        margin: "5px 0 0",
    };

    const sectionStyle = {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "18px",
        marginBottom: "24px",
        overflow: "hidden",
    };

    const sectionHeaderStyle = {
        padding: "24px 26px",
        borderBottom: "1px solid #e5e7eb",
    };

    const sectionBodyStyle = {
        padding: "26px",
    };

    // =====================================================
    // RETURN UI
    // =====================================================

    return (
        <div
            style={{
                width: "100%",
                minHeight: "100vh",
                backgroundColor: "#f6f8fb",
                padding: "28px",
                color: "#111827",
                opacity: 1,
            }}
        >
            {/* =====================================================
                HEADER
            ===================================================== */}

            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
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
                                "/admin/products"
                            )
                        }
                        style={{
                            width: "42px",
                            height: "42px",
                            borderRadius: "12px",
                            border: "1px solid #e5e7eb",
                            backgroundColor:
                                "#ffffff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            cursor: "pointer",
                            color: "#111827",
                        }}
                    >
                        <ArrowLeft
                            size={19}
                        />
                    </button>

                    <div>
                        <h1
                            style={{
                                margin: 0,
                                fontSize: "26px",
                                lineHeight: "34px",
                                fontWeight: "700",
                                color: "#111827",
                            }}
                        >
                            Add Product
                        </h1>

                        <p
                            style={{
                                margin: "4px 0 0",
                                fontSize: "14px",
                                color: "#6b7280",
                            }}
                        >
                            Create a new product
                            for your store.
                        </p>
                    </div>
                </div>

                <button
                    type="submit"
                    form="product-form"
                    disabled={saving}
                    style={{
                        height: "44px",
                        padding: "0 20px",
                        border: "none",
                        borderRadius: "12px",
                        backgroundColor:
                            saving
                                ? "#94a3b8"
                                : "#0ea5a8",
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
                        : "Save Product"}
                </button>
            </div>

            {/* =====================================================
                FORM
            ===================================================== */}

            <form
                id="product-form"
                onSubmit={handleSubmit}
            >
                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={
                            sectionHeaderStyle
                        }
                    >
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Basic Information
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Add basic information
                            about your product.
                        </p>
                    </div>

                    <div
                        style={
                            sectionBodyStyle
                        }
                    >
                        {/* PRODUCT NAME */}

                        <div
                            style={{
                                marginBottom:
                                    "22px",
                            }}
                        >
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Product Name{" "}
                                <span
                                    style={{
                                        color:
                                            "#ef4444",
                                    }}
                                >
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={
                                    handleNameChange
                                }
                                placeholder="Enter product name"
                                style={
                                    inputStyle
                                }
                            />
                        </div>

                        {/* SLUG */}

                        <div
                            style={{
                                marginBottom:
                                    "22px",
                            }}
                        >
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Slug{" "}
                                <span
                                    style={{
                                        color:
                                            "#ef4444",
                                    }}
                                >
                                    *
                                </span>
                            </label>

                            <input
                                type="text"
                                name="slug"
                                value={
                                    formData.slug
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="product-slug"
                                style={
                                    inputStyle
                                }
                            />

                            <p
                                style={
                                    helpTextStyle
                                }
                            >
                                Slug is automatically
                                generated from product
                                name.
                            </p>
                        </div>

                        {/* SHORT DESCRIPTION */}

                        <div
                            style={{
                                marginBottom:
                                    "22px",
                            }}
                        >
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Short Description
                            </label>

                            <textarea
                                name="shortDescription"
                                value={
                                    formData.shortDescription
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter short product description"
                                rows={3}
                                style={
                                    textareaStyle
                                }
                            />
                        </div>

                        {/* DESCRIPTION */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Description
                            </label>

                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter detailed product description"
                                rows={6}
                                style={
                                    textareaStyle
                                }
                            />
                        </div>
                    </div>
                </div>

                {/* =================================================
                    PRODUCT CLASSIFICATION
                ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={
                            sectionHeaderStyle
                        }
                    >
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Product Classification
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Select category and room
                            for this product.
                        </p>
                    </div>

                    <div
                        style={{
                            ...sectionBodyStyle,
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr",
                            gap: "24px",
                        }}
                    >
                        {/* CATEGORY */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Category{" "}
                                <span
                                    style={{
                                        color:
                                            "#ef4444",
                                    }}
                                >
                                    *
                                </span>
                            </label>

                            <div
                                style={{
                                    position:
                                        "relative",
                                }}
                            >
                                <select
                                    name="categoryID"
                                    value={
                                        formData.categoryID
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={{
                                        ...inputStyle,
                                        appearance:
                                            "none",
                                        paddingRight:
                                            "42px",
                                    }}
                                >
                                    <option value="">
                                        {categoryLoading
                                            ? "Loading Categories..."
                                            : "Select Category"}
                                    </option>

                                    {categories.map(
                                        (
                                            category
                                        ) => (
                                            <option
                                                key={
                                                    category._id
                                                }
                                                value={
                                                    category._id
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown
                                    size={18}
                                    style={{
                                        position:
                                            "absolute",
                                        right:
                                            "14px",
                                        top:
                                            "50%",
                                        transform:
                                            "translateY(-50%)",
                                        pointerEvents:
                                            "none",
                                        color:
                                            "#6b7280",
                                    }}
                                />
                            </div>
                        </div>

                        {/* ROOM */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Room{" "}
                                <span
                                    style={{
                                        color:
                                            "#ef4444",
                                    }}
                                >
                                    *
                                </span>
                            </label>

                            <div
                                style={{
                                    position:
                                        "relative",
                                }}
                            >
                                <select
                                    name="roomID"
                                    value={
                                        formData.roomID
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    style={{
                                        ...inputStyle,
                                        appearance:
                                            "none",
                                        paddingRight:
                                            "42px",
                                    }}
                                >
                                    <option value="">
                                        {roomLoading
                                            ? "Loading Rooms..."
                                            : "Select Room"}
                                    </option>

                                    {rooms.map(
                                        (room) => (
                                            <option
                                                key={
                                                    room._id
                                                }
                                                value={
                                                    room._id
                                                }
                                            >
                                                {
                                                    room.name
                                                }
                                            </option>
                                        )
                                    )}
                                </select>

                                <ChevronDown
                                    size={18}
                                    style={{
                                        position:
                                            "absolute",
                                        right:
                                            "14px",
                                        top:
                                            "50%",
                                        transform:
                                            "translateY(-50%)",
                                        pointerEvents:
                                            "none",
                                        color:
                                            "#6b7280",
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    PRICE & STOCK
                ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={
                            sectionHeaderStyle
                        }
                    >
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Price & Stock
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Set product price,
                            discount and stock
                            availability.
                        </p>
                    </div>

                    <div
                        style={{
                            ...sectionBodyStyle,
                            display: "grid",
                            gridTemplateColumns:
                                "1fr 1fr 1fr 1fr",
                            gap: "24px",
                        }}
                    >
                        {/* PRICE */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Price (₹){" "}
                                <span
                                    style={{
                                        color:
                                            "#ef4444",
                                    }}
                                >
                                    *
                                </span>
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter price"
                                min="200"
                                style={
                                    inputStyle
                                }
                            />

                            <p
                                style={
                                    helpTextStyle
                                }
                            >
                                Minimum price ₹200
                            </p>
                        </div>

                        {/* DISCOUNT */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Discount (%)
                            </label>

                            <input
                                type="number"
                                name="discount"
                                value={
                                    formData.discount
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="0"
                                min="0"
                                max="100"
                                style={
                                    inputStyle
                                }
                            />

                            <p
                                style={
                                    helpTextStyle
                                }
                            >
                                Enter discount
                                between 0–100%
                            </p>
                        </div>

                        {/* FINAL PRICE */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Final Price (₹)
                            </label>

                            <input
                                type="text"
                                value={
                                    formData.price
                                        ? `₹${finalPrice.toLocaleString("en-IN")}`
                                        : "₹0"
                                }
                                readOnly
                                style={{
                                    ...inputStyle,
                                    backgroundColor:
                                        "#f0fdf4",
                                    fontWeight:
                                        "700",
                                    color:
                                        "#059669",
                                    cursor:
                                        "not-allowed",
                                    border:
                                        "1px solid #bbf7d0",
                                }}
                            />

                            <p
                                style={{
                                    ...helpTextStyle,
                                    color:
                                        "#059669",
                                }}
                            >
                                Automatically
                                calculated
                            </p>
                        </div>

                        {/* STOCK */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Stock
                            </label>

                            <div
                                style={{
                                    ...inputStyle,
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                }}
                            >
                                <span
                                    style={{
                                        color:
                                            "#111827",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {formData.stock
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </span>

                                <button
                                    type="button"
                                    onClick={() =>
                                        setFormData(
                                            (
                                                prev
                                            ) => ({
                                                ...prev,
                                                stock: !prev.stock,
                                            })
                                        )
                                    }
                                    style={{
                                        width:
                                            "56px",
                                        height:
                                            "32px",
                                        borderRadius:
                                            "20px",
                                        border:
                                            "none",
                                        backgroundColor:
                                            formData.stock
                                                ? "#0ea5a8"
                                                : "#d1d5db",
                                        position:
                                            "relative",
                                        cursor:
                                            "pointer",
                                        padding: 0,
                                    }}
                                >
                                    <span
                                        style={{
                                            position:
                                                "absolute",
                                            top:
                                                "4px",
                                            left:
                                                formData.stock
                                                    ? "28px"
                                                    : "4px",
                                            width:
                                                "24px",
                                            height:
                                                "24px",
                                            backgroundColor:
                                                "#ffffff",
                                            borderRadius:
                                                "50%",
                                            transition:
                                                "0.2s",
                                        }}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    PRODUCT DETAILS
                ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={
                            sectionHeaderStyle
                        }
                    >
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Product Details
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Add material, color,
                            dimensions and weight.
                        </p>
                    </div>

                    <div
                        style={
                            sectionBodyStyle
                        }
                    >
                        {/* MATERIAL + COLOR */}

                        <div
                            style={{
                                display: "grid",
                                gridTemplateColumns:
                                    "1fr 1fr",
                                gap: "24px",
                                marginBottom:
                                    "24px",
                            }}
                        >
                            {/* MATERIAL */}

                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Material
                                </label>

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <select
                                        name="material"
                                        value={
                                            formData.material
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={{
                                            ...inputStyle,
                                            appearance:
                                                "none",
                                            paddingRight:
                                                "42px",
                                        }}
                                    >
                                        <option value="Wood">
                                            Wood
                                        </option>

                                        <option value="Sheesham">
                                            Sheesham
                                        </option>

                                        <option value="Engineered Wood">
                                            Engineered
                                            Wood
                                        </option>

                                        <option value="Metal">
                                            Metal
                                        </option>

                                        <option value="Steel">
                                            Steel
                                        </option>

                                        <option value="Plastic">
                                            Plastic
                                        </option>

                                        <option value="Glass">
                                            Glass
                                        </option>

                                        <option value="Marble">
                                            Marble
                                        </option>

                                        <option value="Fabric">
                                            Fabric
                                        </option>

                                        <option value="Leather">
                                            Leather
                                        </option>
                                    </select>

                                    <ChevronDown
                                        size={18}
                                        style={{
                                            position:
                                                "absolute",
                                            right:
                                                "14px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            pointerEvents:
                                                "none",
                                            color:
                                                "#6b7280",
                                        }}
                                    />
                                </div>
                            </div>

                            {/* COLOR */}

                            <div>
                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Color
                                </label>

                                <input
                                    type="text"
                                    name="color"
                                    value={
                                        formData.color
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="e.g. Walnut Brown"
                                    style={
                                        inputStyle
                                    }
                                />
                            </div>
                        </div>

                        {/* DIMENSIONS */}

                        <div
                            style={{
                                marginBottom:
                                    "24px",
                            }}
                        >
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Dimensions
                            </label>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 1fr 1fr 1fr",
                                    gap: "14px",
                                }}
                            >
                                <input
                                    type="number"
                                    name="length"
                                    value={
                                        formData.length
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Length"
                                    min="0"
                                    style={
                                        inputStyle
                                    }
                                />

                                <input
                                    type="number"
                                    name="width"
                                    value={
                                        formData.width
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Width"
                                    min="0"
                                    style={
                                        inputStyle
                                    }
                                />

                                <input
                                    type="number"
                                    name="height"
                                    value={
                                        formData.height
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Height"
                                    min="0"
                                    style={
                                        inputStyle
                                    }
                                />

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <select
                                        name="dimensionUnit"
                                        value={
                                            formData.dimensionUnit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={{
                                            ...inputStyle,
                                            appearance:
                                                "none",
                                            paddingRight:
                                                "38px",
                                        }}
                                    >
                                        <option value="cm">
                                            Centimeter
                                            (cm)
                                        </option>

                                        <option value="inch">
                                            Inch (in)
                                        </option>

                                        <option value="ft">
                                            Feet (ft)
                                        </option>

                                        <option value="mm">
                                            Millimeter
                                            (mm)
                                        </option>
                                    </select>

                                    <ChevronDown
                                        size={18}
                                        style={{
                                            position:
                                                "absolute",
                                            right:
                                                "12px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            pointerEvents:
                                                "none",
                                            color:
                                                "#6b7280",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* WEIGHT */}

                        <div>
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Weight
                            </label>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr 180px",
                                    gap: "14px",
                                }}
                            >
                                <input
                                    type="number"
                                    name="weight"
                                    value={
                                        formData.weight
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter weight"
                                    min="0"
                                    style={
                                        inputStyle
                                    }
                                />

                                <div
                                    style={{
                                        position:
                                            "relative",
                                    }}
                                >
                                    <select
                                        name="weightUnit"
                                        value={
                                            formData.weightUnit
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        style={{
                                            ...inputStyle,
                                            appearance:
                                                "none",
                                            paddingRight:
                                                "40px",
                                        }}
                                    >
                                        <option value="kg">
                                            Kilogram
                                            (kg)
                                        </option>

                                        <option value="g">
                                            Gram (g)
                                        </option>

                                        <option value="lb">
                                            Pound (lb)
                                        </option>
                                    </select>

                                    <ChevronDown
                                        size={18}
                                        style={{
                                            position:
                                                "absolute",
                                            right:
                                                "12px",
                                            top:
                                                "50%",
                                            transform:
                                                "translateY(-50%)",
                                            pointerEvents:
                                                "none",
                                            color:
                                                "#6b7280",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    PRODUCT IMAGES
                ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={
                            sectionHeaderStyle
                        }
                    >
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Product Images
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Upload thumbnail and
                            gallery images.
                        </p>
                    </div>

                    <div
                        style={
                            sectionBodyStyle
                        }
                    >
                        {/* THUMBNAIL */}

                        <div
                            style={{
                                marginBottom:
                                    "28px",
                            }}
                        >
                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Product Thumbnail{" "}
                                <span
                                    style={{
                                        color:
                                            "#ef4444",
                                    }}
                                >
                                    *
                                </span>
                            </label>

                            {!thumbnailPreview ? (
                                <label
                                    style={{
                                        width:
                                            "260px",
                                        height:
                                            "220px",
                                        border:
                                            "2px dashed #d1d5db",
                                        borderRadius:
                                            "16px",
                                        backgroundColor:
                                            "#f9fafb",
                                        display:
                                            "flex",
                                        flexDirection:
                                            "column",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        cursor:
                                            "pointer",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    <Upload
                                        size={30}
                                        style={{
                                            marginBottom:
                                                "10px",
                                        }}
                                    />

                                    <span
                                        style={{
                                            fontSize:
                                                "14px",
                                            fontWeight:
                                                "600",
                                            color:
                                                "#374151",
                                        }}
                                    >
                                        Upload Thumbnail
                                    </span>

                                    <span
                                        style={{
                                            fontSize:
                                                "12px",
                                            marginTop:
                                                "5px",
                                        }}
                                    >
                                        JPG, PNG, WEBP
                                    </span>

                                    <span
                                        style={{
                                            fontSize:
                                                "11px",
                                            marginTop:
                                                "3px",
                                        }}
                                    >
                                        Maximum 1MB
                                    </span>

                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={
                                            handleThumbnailChange
                                        }
                                        style={{
                                            display:
                                                "none",
                                        }}
                                    />
                                </label>
                            ) : (
                                <div
                                    style={{
                                        position:
                                            "relative",
                                        width:
                                            "260px",
                                        height:
                                            "220px",
                                        borderRadius:
                                            "16px",
                                        overflow:
                                            "hidden",
                                        border:
                                            "1px solid #e5e7eb",
                                    }}
                                >
                                    <img
                                        src={
                                            thumbnailPreview
                                        }
                                        alt="Thumbnail"
                                        style={{
                                            width:
                                                "100%",
                                            height:
                                                "100%",
                                            objectFit:
                                                "cover",
                                        }}
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            removeThumbnail
                                        }
                                        style={{
                                            position:
                                                "absolute",
                                            top:
                                                "10px",
                                            right:
                                                "10px",
                                            width:
                                                "34px",
                                            height:
                                                "34px",
                                            border:
                                                "none",
                                            borderRadius:
                                                "50%",
                                            backgroundColor:
                                                "rgba(0,0,0,0.7)",
                                            color:
                                                "#ffffff",
                                            display:
                                                "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            cursor:
                                                "pointer",
                                        }}
                                    >
                                        <X
                                            size={17}
                                        />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* GALLERY */}

                        <div>
                            <div
                                style={{
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "space-between",
                                    marginBottom:
                                        "8px",
                                }}
                            >
                                <label
                                    style={{
                                        ...labelStyle,
                                        marginBottom:
                                            0,
                                    }}
                                >
                                    Gallery Images
                                </label>

                                <span
                                    style={{
                                        fontSize:
                                            "12px",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    {
                                        galleryImages.length
                                    }
                                    /10
                                </span>
                            </div>

                            <p
                                style={{
                                    ...helpTextStyle,
                                    marginBottom:
                                        "14px",
                                }}
                            >
                                You can upload up
                                to 10 gallery images.
                                Maximum 1MB each.
                            </p>

                            <div
                                style={{
                                    display:
                                        "flex",
                                    flexWrap:
                                        "wrap",
                                    gap: "14px",
                                }}
                            >
                                {/* UPLOAD BUTTON */}

                                {galleryImages.length <
                                    10 && (
                                        <label
                                            style={{
                                                width:
                                                    "150px",
                                                height:
                                                    "150px",
                                                border:
                                                    "2px dashed #d1d5db",
                                                borderRadius:
                                                    "14px",
                                                backgroundColor:
                                                    "#f9fafb",
                                                display:
                                                    "flex",
                                                flexDirection:
                                                    "column",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                cursor:
                                                    "pointer",
                                                color:
                                                    "#6b7280",
                                            }}
                                        >
                                            <ImageIcon
                                                size={26}
                                            />

                                            <span
                                                style={{
                                                    fontSize:
                                                        "12px",
                                                    fontWeight:
                                                        "600",
                                                    marginTop:
                                                        "8px",
                                                    color:
                                                        "#374151",
                                                }}
                                            >
                                                Add Images
                                            </span>

                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={
                                                    handleGalleryChange
                                                }
                                                style={{
                                                    display:
                                                        "none",
                                                }}
                                            />
                                        </label>
                                    )}

                                {/* GALLERY PREVIEWS */}

                                {galleryPreviews.map(
                                    (
                                        preview,
                                        index
                                    ) => (
                                        <div
                                            key={
                                                index
                                            }
                                            style={{
                                                width:
                                                    "150px",
                                                height:
                                                    "150px",
                                                borderRadius:
                                                    "14px",
                                                overflow:
                                                    "hidden",
                                                position:
                                                    "relative",
                                                border:
                                                    "1px solid #e5e7eb",
                                            }}
                                        >
                                            <img
                                                src={
                                                    preview
                                                }
                                                alt={`Gallery ${index +
                                                    1
                                                    }`}
                                                style={{
                                                    width:
                                                        "100%",
                                                    height:
                                                        "100%",
                                                    objectFit:
                                                        "cover",
                                                }}
                                            />

                                            <button
                                                type="button"
                                                onClick={() =>
                                                    removeGalleryImage(
                                                        index
                                                    )
                                                }
                                                style={{
                                                    position:
                                                        "absolute",
                                                    top:
                                                        "7px",
                                                    right:
                                                        "7px",
                                                    width:
                                                        "28px",
                                                    height:
                                                        "28px",
                                                    border:
                                                        "none",
                                                    borderRadius:
                                                        "50%",
                                                    backgroundColor:
                                                        "rgba(0,0,0,0.7)",
                                                    color:
                                                        "#ffffff",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    cursor:
                                                        "pointer",
                                                }}
                                            >
                                                <X
                                                    size={
                                                        15
                                                    }
                                                />
                                            </button>
                                        </div>
                                    )
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* =================================================
                    PRODUCT SETTINGS
                ================================================= */}

                <div style={sectionStyle}>
                    <div
                        style={
                            sectionHeaderStyle
                        }
                    >
                        <h2
                            style={
                                sectionTitleStyle
                            }
                        >
                            Product Settings
                        </h2>

                        <p
                            style={
                                sectionDescriptionStyle
                            }
                        >
                            Manage product visibility
                            and listing options.
                        </p>
                    </div>

                    <div
                        style={{
                            ...sectionBodyStyle,
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(3, 1fr)",
                            gap: "16px",
                        }}
                    >
                        {/* FEATURED */}

                        <label
                            style={{
                                border:
                                    "1px solid #e5e7eb",
                                borderRadius:
                                    "14px",
                                padding:
                                    "18px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                cursor:
                                    "pointer",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin:
                                            0,
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
                                        color:
                                            "#111827",
                                    }}
                                >
                                    Featured Product
                                </p>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        fontSize:
                                            "12px",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Show as featured
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                name="featured"
                                checked={
                                    formData.featured
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    width:
                                        "18px",
                                    height:
                                        "18px",
                                    accentColor:
                                        "#0ea5a8",
                                }}
                            />
                        </label>

                        {/* NEW ARRIVAL */}

                        <label
                            style={{
                                border:
                                    "1px solid #e5e7eb",
                                borderRadius:
                                    "14px",
                                padding:
                                    "18px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                cursor:
                                    "pointer",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin:
                                            0,
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
                                        color:
                                            "#111827",
                                    }}
                                >
                                    New Arrival
                                </p>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        fontSize:
                                            "12px",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Mark as new
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                name="newArrival"
                                checked={
                                    formData.newArrival
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    width:
                                        "18px",
                                    height:
                                        "18px",
                                    accentColor:
                                        "#0ea5a8",
                                }}
                            />
                        </label>

                        {/* STATUS */}

                        <label
                            style={{
                                border:
                                    "1px solid #e5e7eb",
                                borderRadius:
                                    "14px",
                                padding:
                                    "18px",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "space-between",
                                cursor:
                                    "pointer",
                            }}
                        >
                            <div>
                                <p
                                    style={{
                                        margin:
                                            0,
                                        fontSize:
                                            "14px",
                                        fontWeight:
                                            "600",
                                        color:
                                            "#111827",
                                    }}
                                >
                                    Product Status
                                </p>

                                <p
                                    style={{
                                        margin:
                                            "4px 0 0",
                                        fontSize:
                                            "12px",
                                        color:
                                            "#6b7280",
                                    }}
                                >
                                    Active on store
                                </p>
                            </div>

                            <input
                                type="checkbox"
                                name="status"
                                checked={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                style={{
                                    width:
                                        "18px",
                                    height:
                                        "18px",
                                    accentColor:
                                        "#0ea5a8",
                                }}
                            />
                        </label>
                    </div>
                </div>

                {/* =================================================
                    BOTTOM BUTTONS
                ================================================= */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                            "flex-end",
                        gap: "12px",
                        paddingBottom:
                            "30px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/products"
                            )
                        }
                        style={{
                            height: "44px",
                            padding: "0 22px",
                            border:
                                "1px solid #d1d5db",
                            borderRadius: "12px",
                            backgroundColor:
                                "#ffffff",
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
                            height: "44px",
                            padding: "0 22px",
                            border: "none",
                            borderRadius: "12px",
                            backgroundColor:
                                saving
                                    ? "#94a3b8"
                                    : "#0ea5a8",
                            color: "#ffffff",
                            fontSize: "14px",
                            fontWeight: "600",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            gap: "8px",
                            cursor: saving
                                ? "not-allowed"
                                : "pointer",
                        }}
                    >
                        <Package size={17} />

                        {saving
                            ? "Creating..."
                            : "Create Product"}
                    </button>
                </div>
            </form>

            {/* =====================================================
                GLOBAL STYLE FIX
            ===================================================== */}

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
                span {
                    opacity: 1 !important;
                }

                select option {
                    color: #111827 !important;
                    background-color: #ffffff !important;
                }

                input:focus,
                textarea:focus,
                select:focus {
                    border-color: #0ea5a8 !important;
                    box-shadow: 0 0 0 3px
                        rgba(14, 165, 168, 0.1);
                }

                button {
                    -webkit-tap-highlight-color: transparent;
                }

                @media (max-width: 1100px) {
                    #product-form
                        ~ * {
                        max-width: 100%;
                    }
                }

                @media (max-width: 900px) {
                    div {
                        box-sizing: border-box;
                    }
                }
            `}</style>
        </div>
    );
}