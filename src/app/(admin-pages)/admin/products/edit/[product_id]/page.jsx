"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Save,
    Upload,
    Image as ImageIcon,
    X,
    Trash2,
    Package,
    Loader2,
    ChevronDown,
} from "lucide-react";

export default function EditProductPage() {
    const router = useRouter();
    const params = useParams();

    const productId = params?.product_id;

    const API_BASE_URL =
        process.env.NEXT_PUBLIC_API_BASE_URL;

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

    const [categoryLoading, setCategoryLoading] =
        useState(true);

    const [roomLoading, setRoomLoading] =
        useState(true);

    // =====================================================
    // PRODUCT LOADING
    // =====================================================

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    // =====================================================
    // THUMBNAIL
    // =====================================================

    const [existingThumbnail, setExistingThumbnail] =
        useState("");

    const [newThumbnail, setNewThumbnail] =
        useState(null);

    const [thumbnailPreview, setThumbnailPreview] =
        useState("");

    // =====================================================
    // GALLERY
    // =====================================================

    const [existingImages, setExistingImages] =
        useState([]);

    const [galleryImages, setGalleryImages] =
        useState([]);

    const [galleryPreviews, setGalleryPreviews] =
        useState([]);

    const [deletingImage, setDeletingImage] =
        useState(null);

    // =====================================================
    // FETCH PRODUCT
    // =====================================================

    const fetchProduct = async () => {
        try {
            setLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/product/${productId}`
            );

            console.log(
                "PRODUCT RESPONSE:",
                response.data
            );

            if (!response.data?.success) {
                alert(
                    response.data?.message ||
                        "Failed to load product"
                );

                router.push("/admin/products");
                return;
            }

            const product =
                response.data?.data;

            if (!product) {
                alert("Product data not found.");
                router.push("/admin/products");
                return;
            }

            // =================================================
            // BASIC INFORMATION
            // =================================================

            setFormData({
                name: product.name || "",

                slug: product.slug || "",

                shortDescription:
                    product.shortDescription || "",

                description:
                    product.description || "",

                categoryID:
                    product.categoryID?._id ||
                    product.categoryID ||
                    "",

                roomID:
                    product.roomID?._id ||
                    product.roomID ||
                    "",

                price:
                    product.price ??
                    "",

                discount:
                    product.discount ??
                    "0",

                stock:
                    product.stock ?? true,

                material:
                    product.material ||
                    "Wood",

                color:
                    product.color || "",

                length:
                    product.dimensions?.length ??
                    "",

                width:
                    product.dimensions?.width ??
                    "",

                height:
                    product.dimensions?.height ??
                    "",

                dimensionUnit:
                    product.dimensions?.unit ||
                    "cm",

                weight:
                    product.weight?.value ??
                    "",

                weightUnit:
                    product.weight?.unit ||
                    "kg",

                featured:
                    product.featured ?? false,

                newArrival:
                    product.newArrival ?? false,

                status:
                    product.status ?? true,
            });

            // =================================================
            // THUMBNAIL
            // =================================================

            setExistingThumbnail(
                product.thumbnail || ""
            );

            // =================================================
            // EXISTING GALLERY
            // =================================================

            setExistingImages(
                Array.isArray(product.images)
                    ? product.images
                    : []
            );

        } catch (error) {
            console.log(
                "PRODUCT FETCH ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to load product"
            );

            router.push("/admin/products");

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // FETCH CATEGORIES
    // =====================================================

    const fetchCategories = async () => {
        try {
            setCategoryLoading(true);

            const response = await axios.get(
                `${API_BASE_URL}/category`
            );

            if (response.data?.success) {
                setCategories(
                    response.data?.data || []
                );
            }

        } catch (error) {
            console.log(
                "CATEGORY FETCH ERROR:",
                error
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

            if (response.data?.success) {
                setRooms(
                    response.data?.data || []
                );
            }

        } catch (error) {
            console.log(
                "ROOM FETCH ERROR:",
                error
            );
        } finally {
            setRoomLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        if (!productId) return;

        fetchProduct();
        fetchCategories();
        fetchRooms();
    }, [productId]);

    // =====================================================
    // GENERATE SLUG
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
    // NAME CHANGE
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
    // NORMAL INPUT CHANGE
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
        const file =
            e.target.files?.[0];

        if (!file) return;

        if (
            file.size >
            1 * 1024 * 1024
        ) {
            alert(
                "Thumbnail image must be less than 1MB."
            );

            e.target.value = "";
            return;
        }

        if (
            thumbnailPreview &&
            thumbnailPreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                thumbnailPreview
            );
        }

        setNewThumbnail(file);

        setThumbnailPreview(
            URL.createObjectURL(file)
        );
    };

    // =====================================================
    // REMOVE NEW THUMBNAIL
    // =====================================================

    const removeNewThumbnail = () => {
        if (
            thumbnailPreview &&
            thumbnailPreview.startsWith("blob:")
        ) {
            URL.revokeObjectURL(
                thumbnailPreview
            );
        }

        setNewThumbnail(null);
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

        const currentTotal =
            existingImages.length +
            galleryImages.length;

        const remainingSlots =
            10 - currentTotal;

        if (remainingSlots <= 0) {
            alert(
                "Maximum 10 gallery images are allowed."
            );

            e.target.value = "";
            return;
        }

        const selectedFiles =
            files.slice(
                0,
                remainingSlots
            );

        const validFiles =
            selectedFiles.filter(
                (file) => {
                    if (
                        file.size >
                        1 * 1024 * 1024
                    ) {
                        alert(
                            `${file.name} is larger than 1MB and was not added.`
                        );

                        return false;
                    }

                    return true;
                }
            );

        const newPreviews =
            validFiles.map((file) =>
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
    // REMOVE NEW GALLERY IMAGE
    // =====================================================

    const removeGalleryImage = (index) => {
        const preview =
            galleryPreviews[index];

        if (preview) {
            URL.revokeObjectURL(
                preview
            );
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
    // DELETE EXISTING GALLERY IMAGE
    // =====================================================

    const deleteExistingImage = async (
        imageUrl
    ) => {
        if (!productId) {
            alert(
                "Product ID not found."
            );

            return;
        }

        const confirmDelete =
            window.confirm(
                "Are you sure you want to delete this image?"
            );

        if (!confirmDelete) return;

        try {
            setDeletingImage(imageUrl);

            const response =
                await axios.delete(
                    `${API_BASE_URL}/product/images/${productId}`,
                    {
                        data: {
                            imageUrl:
                                imageUrl,
                        },
                    }
                );

            console.log(
                "DELETE IMAGE RESPONSE:",
                response.data
            );

            if (
                response.data?.success
            ) {
                alert(
                    "Image deleted successfully."
                );

                // Remove image from UI
                setExistingImages(
                    (prev) =>
                        prev.filter(
                            (image) =>
                                image !==
                                imageUrl
                        )
                );
            } else {
                alert(
                    response.data?.message ||
                        "Failed to delete image."
                );
            }

        } catch (error) {
            console.log(
                "DELETE IMAGE ERROR:",
                error
            );

            console.log(
                "DELETE IMAGE RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to delete image."
            );

        } finally {
            setDeletingImage(null);
        }
    };

    // =====================================================
    // SUBMIT UPDATE
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        // =================================================
        // VALIDATION
        // =================================================

        if (!formData.name.trim()) {
            alert(
                "Please enter product name."
            );
            return;
        }

        if (!formData.slug.trim()) {
            alert(
                "Please enter product slug."
            );
            return;
        }

        if (!formData.categoryID) {
            alert(
                "Please select category."
            );
            return;
        }

        if (!formData.roomID) {
            alert(
                "Please select room."
            );
            return;
        }

        if (!formData.price) {
            alert(
                "Please enter product price."
            );
            return;
        }

        try {
            setSaving(true);

            const data =
                new FormData();

            // =================================================
            // BASIC INFORMATION
            // =================================================

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

            // =================================================
            // CLASSIFICATION
            // =================================================

            data.append(
                "categoryID",
                formData.categoryID
            );

            data.append(
                "roomID",
                formData.roomID
            );

            // =================================================
            // PRICE
            // =================================================

            data.append(
                "price",
                formData.price
            );

            data.append(
                "discount",
                formData.discount ||
                    "0"
            );

            // =================================================
            // STOCK
            // =================================================

            data.append(
                "stock",
                String(
                    formData.stock
                )
            );

            // =================================================
            // DETAILS
            // =================================================

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
                length:
                    formData.length
                        ? Number(
                              formData.length
                          )
                        : null,

                width:
                    formData.width
                        ? Number(
                              formData.width
                          )
                        : null,

                height:
                    formData.height
                        ? Number(
                              formData.height
                          )
                        : null,

                unit:
                    formData.dimensionUnit,
            };

            data.append(
                "dimensions",
                JSON.stringify(
                    dimensions
                )
            );

            // =================================================
            // WEIGHT
            // =================================================

            const weight = {
                value:
                    formData.weight
                        ? Number(
                              formData.weight
                          )
                        : null,

                unit:
                    formData.weightUnit,
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
                String(
                    formData.featured
                )
            );

            data.append(
                "newArrival",
                String(
                    formData.newArrival
                )
            );

            data.append(
                "status",
                String(
                    formData.status
                )
            );

            // =================================================
            // NEW THUMBNAIL
            // =================================================

            if (newThumbnail) {
                data.append(
                    "thumbnail",
                    newThumbnail
                );
            }

            // =================================================
            // NEW GALLERY IMAGES
            // =================================================

            galleryImages.forEach(
                (file) => {
                    data.append(
                        "images",
                        file
                    );
                }
            );

            // =================================================
            // UPDATE API
            // =================================================

            const response =
                await axios.patch(
                    `${API_BASE_URL}/product/${productId}`,
                    data
                );

            console.log(
                "PRODUCT UPDATE RESPONSE:",
                response.data
            );

            if (
                response.data?.success
            ) {
                alert(
                    "Product updated successfully."
                );

                router.push(
                    "/admin/products"
                );

                router.refresh();

            } else {
                alert(
                    response.data?.message ||
                        "Failed to update product."
                );
            }

        } catch (error) {
            console.log(
                "PRODUCT UPDATE ERROR:",
                error
            );

            console.log(
                "ERROR RESPONSE:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                    "Failed to update product."
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

    // =====================================================
    // LOADING SCREEN
    // =====================================================

    if (loading) {
        return (
            <div className="w-full min-h-[calc(100vh-80px)] bg-[#f7f9fc] flex items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                    <Loader2
                        size={32}
                        className="animate-spin text-[#00b8b8]"
                    />

                    <p
                        style={{
                            color: "#6b7280",
                            opacity: 1,
                        }}
                        className="text-sm"
                    >
                        Loading product...
                    </p>

                </div>

            </div>
        );
    }

    // =====================================================
    // MAIN UI
    // =====================================================

    return (
        <div className="w-full min-h-[calc(100vh-80px)] bg-[#f7f9fc] p-5 md:p-7">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">

                <div className="flex items-center gap-3">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/products"
                            )
                        }
                        className="w-10 h-10 rounded-xl bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
                    >
                        <ArrowLeft
                            size={19}
                            className="text-gray-700"
                        />
                    </button>

                    <div>

                        <h1
                            style={{
                                color: "#111827",
                                opacity: 1,
                            }}
                            className="text-2xl font-bold"
                        >
                            Edit Product
                        </h1>

                        <p
                            style={{
                                color: "#6b7280",
                                opacity: 1,
                            }}
                            className="text-sm mt-1"
                        >
                            Update your product
                            information
                        </p>

                    </div>

                </div>

                <button
                    type="submit"
                    form="edit-product-form"
                    disabled={saving}
                    className="h-11 px-5 rounded-xl bg-[#00b8b8] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#00a5a5] transition disabled:opacity-60"
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
                            <Save
                                size={18}
                            />

                            Save Changes
                        </>
                    )}

                </button>

            </div>

            {/* =================================================
                FORM
            ================================================= */}

            <form
                id="edit-product-form"
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* =================================================
                    BASIC INFORMATION
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                    <div className="px-5 md:px-6 py-5 border-b border-gray-100">

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
                            Update basic product
                            information.
                        </p>

                    </div>

                    <div className="p-5 md:p-6 space-y-5">

                        {/* PRODUCT NAME */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Product Name
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

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Product Slug
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
                                URL-friendly
                                product slug.
                            </p>

                        </div>

                        {/* SHORT DESCRIPTION */}

                        <div>

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
                    CLASSIFICATION
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                    <div className="px-5 md:px-6 py-5 border-b border-gray-100">

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
                            Select category and
                            room for this product.
                        </p>

                    </div>

                    <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-5">

                        {/* CATEGORY */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Category
                            </label>

                            <div className="relative">

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
                                    size={17}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
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
                                Room
                            </label>

                            <div className="relative">

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
                                    size={17}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                                />

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PRICE & STOCK
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                    <div className="px-5 md:px-6 py-5 border-b border-gray-100">

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
                            Manage pricing,
                            discount and stock.
                        </p>

                    </div>

                    <div className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">

                        {/* PRICE */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                min="200"
                                value={
                                    formData.price
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="12999"
                                style={
                                    inputStyle
                                }
                            />

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
                                min="0"
                                max="100"
                                value={
                                    formData.discount
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="0"
                                style={
                                    inputStyle
                                }
                            />

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

                            <label className="h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-between cursor-pointer">

                                <span
                                    style={{
                                        color: "#374151",
                                        opacity: 1,
                                    }}
                                    className="text-sm font-medium"
                                >
                                    {formData.stock
                                        ? "In Stock"
                                        : "Out of Stock"}
                                </span>

                                <input
                                    type="checkbox"
                                    name="stock"
                                    checked={
                                        formData.stock
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    className="sr-only"
                                />

                                <div
                                    className={`w-11 h-6 rounded-full p-1 transition ${
                                        formData.stock
                                            ? "bg-[#00b8b8]"
                                            : "bg-gray-300"
                                    }`}
                                >

                                    <div
                                        className={`w-4 h-4 bg-white rounded-full transition ${
                                            formData.stock
                                                ? "translate-x-5"
                                                : "translate-x-0"
                                        }`}
                                    />

                                </div>

                            </label>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PRODUCT DETAILS
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                    <div className="px-5 md:px-6 py-5 border-b border-gray-100">

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
                            Material, color,
                            dimensions and weight.
                        </p>

                    </div>

                    <div className="p-5 md:p-6 space-y-5">

                        {/* MATERIAL + COLOR */}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                            {/* MATERIAL */}

                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Material
                                </label>

                                <div className="relative">

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
                                            Engineered Wood
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
                                        size={17}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
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
                                    placeholder="Walnut Brown"
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>

                        </div>

                        {/* DIMENSIONS */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Dimensions
                            </label>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

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
                                    style={
                                        inputStyle
                                    }
                                />

                                <div className="relative">

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
                                                "35px",
                                        }}
                                    >

                                        <option value="cm">
                                            cm
                                        </option>

                                        <option value="inch">
                                            inch
                                        </option>

                                        <option value="ft">
                                            ft
                                        </option>

                                        <option value="mm">
                                            mm
                                        </option>

                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                                    />

                                </div>

                            </div>

                        </div>

                        {/* WEIGHT */}

                        <div className="grid grid-cols-2 gap-3 max-w-md">

                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Weight
                                </label>

                                <input
                                    type="number"
                                    name="weight"
                                    value={
                                        formData.weight
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="18"
                                    style={
                                        inputStyle
                                    }
                                />

                            </div>

                            <div>

                                <label
                                    style={
                                        labelStyle
                                    }
                                >
                                    Weight Unit
                                </label>

                                <div className="relative">

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
                                                "35px",
                                        }}
                                    >

                                        <option value="kg">
                                            kg
                                        </option>

                                        <option value="g">
                                            g
                                        </option>

                                        <option value="lb">
                                            lb
                                        </option>

                                    </select>

                                    <ChevronDown
                                        size={16}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                                    />

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

                {/* =================================================
                    PRODUCT IMAGES
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                    <div className="px-5 md:px-6 py-5 border-b border-gray-100">

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
                            Update thumbnail and
                            manage gallery images.
                        </p>

                    </div>

                    <div className="p-5 md:p-6 space-y-7">

                        {/* =================================================
                            THUMBNAIL
                        ================================================= */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Product Thumbnail
                            </label>

                            <div className="flex flex-col sm:flex-row gap-5">

                                {/* CURRENT / NEW IMAGE */}

                                <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">

                                    {thumbnailPreview ||
                                    existingThumbnail ? (
                                        <img
                                            src={
                                                thumbnailPreview ||
                                                existingThumbnail
                                            }
                                            alt="Product thumbnail"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">

                                            <ImageIcon
                                                size={
                                                    35
                                                }
                                                className="text-gray-300"
                                            />

                                        </div>
                                    )}

                                    {thumbnailPreview && (
                                        <button
                                            type="button"
                                            onClick={
                                                removeNewThumbnail
                                            }
                                            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                                        >
                                            <X
                                                size={
                                                    15
                                                }
                                            />
                                        </button>
                                    )}

                                </div>

                                {/* UPLOAD */}

                                <div className="flex-1">

                                    <label
                                        className="min-h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00b8b8] hover:bg-teal-50/20 transition"
                                    >

                                        <Upload
                                            size={
                                                30
                                            }
                                            className="text-gray-300 mb-3"
                                        />

                                        <p
                                            style={{
                                                color: "#4b5563",
                                                opacity: 1,
                                            }}
                                            className="text-sm font-medium"
                                        >
                                            Click to
                                            replace
                                            thumbnail
                                        </p>

                                        <p
                                            style={{
                                                color: "#9ca3af",
                                                opacity: 1,
                                            }}
                                            className="text-xs mt-1"
                                        >
                                            JPG, JPEG,
                                            PNG, WEBP
                                            • Max 1MB
                                        </p>

                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={
                                                handleThumbnailChange
                                            }
                                            className="hidden"
                                        />

                                    </label>

                                </div>

                            </div>

                        </div>

                        {/* =================================================
                            EXISTING GALLERY
                        ================================================= */}

                        <div>

                            <div className="flex items-center justify-between mb-3">

                                <div>

                                    <label
                                        style={{
                                            ...labelStyle,
                                            marginBottom:
                                                "2px",
                                        }}
                                    >
                                        Existing Gallery
                                        Images
                                    </label>

                                    <p
                                        style={
                                            helpTextStyle
                                        }
                                    >
                                        Click the
                                        delete icon
                                        to permanently
                                        remove an image.
                                    </p>

                                </div>

                                <span
                                    style={{
                                        color: "#6b7280",
                                        opacity: 1,
                                    }}
                                    className="text-xs"
                                >
                                    {
                                        existingImages.length
                                    }{" "}
                                    images
                                </span>

                            </div>

                            {existingImages.length >
                            0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

                                    {existingImages.map(
                                        (
                                            image,
                                            index
                                        ) => (
                                            <div
                                                key={`${image}-${index}`}
                                                className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                                            >

                                                <img
                                                    src={
                                                        image
                                                    }
                                                    alt={`Product image ${
                                                        index +
                                                        1
                                                    }`}
                                                    className="w-full h-full object-cover"
                                                />

                                                {/* DELETE */}

                                                <button
                                                    type="button"
                                                    disabled={
                                                        deletingImage ===
                                                        image
                                                    }
                                                    onClick={() =>
                                                        deleteExistingImage(
                                                            image
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-md hover:bg-red-600 transition disabled:opacity-60"
                                                >

                                                    {deletingImage ===
                                                    image ? (
                                                        <Loader2
                                                            size={
                                                                15
                                                            }
                                                            className="animate-spin"
                                                        />
                                                    ) : (
                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    )}

                                                </button>

                                                {/* NUMBER */}

                                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px]">
                                                    Image{" "}
                                                    {index +
                                                        1}
                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>
                            ) : (
                                <div className="border border-dashed border-gray-200 rounded-xl p-8 text-center">

                                    <ImageIcon
                                        size={
                                            35
                                        }
                                        className="mx-auto text-gray-300 mb-2"
                                    />

                                    <p
                                        style={{
                                            color: "#6b7280",
                                            opacity: 1,
                                        }}
                                        className="text-sm"
                                    >
                                        No gallery
                                        images
                                    </p>

                                </div>
                            )}

                        </div>

                        {/* =================================================
                            ADD NEW GALLERY
                        ================================================= */}

                        <div>

                            <label
                                style={
                                    labelStyle
                                }
                            >
                                Add New Gallery Images
                            </label>

                            <label className="min-h-36 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-[#00b8b8] hover:bg-teal-50/20 transition">

                                <ImageIcon
                                    size={32}
                                    className="text-gray-300 mb-3"
                                />

                                <p
                                    style={{
                                        color: "#4b5563",
                                        opacity: 1,
                                    }}
                                    className="text-sm font-medium"
                                >
                                    Select gallery
                                    images
                                </p>

                                <p
                                    style={{
                                        color: "#9ca3af",
                                        opacity: 1,
                                    }}
                                    className="text-xs mt-1"
                                >
                                    You can select
                                    multiple images
                                </p>

                                <p
                                    style={{
                                        color: "#9ca3af",
                                        opacity: 1,
                                    }}
                                    className="text-xs mt-1"
                                >
                                    Maximum 10 total
                                    gallery images
                                </p>

                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={
                                        handleGalleryChange
                                    }
                                    className="hidden"
                                />

                            </label>

                        </div>

                        {/* =================================================
                            NEW IMAGE PREVIEWS
                        ================================================= */}

                        {galleryImages.length >
                            0 && (
                            <div>

                                <div className="flex items-center justify-between mb-3">

                                    <label
                                        style={{
                                            ...labelStyle,
                                            marginBottom:
                                                "0",
                                        }}
                                    >
                                        New Images
                                    </label>

                                    <span
                                        style={{
                                            color: "#6b7280",
                                            opacity: 1,
                                        }}
                                        className="text-xs"
                                    >
                                        {
                                            galleryImages.length
                                        }{" "}
                                        selected
                                    </span>

                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">

                                    {galleryPreviews.map(
                                        (
                                            preview,
                                            index
                                        ) => (
                                            <div
                                                key={
                                                    preview
                                                }
                                                className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
                                            >

                                                <img
                                                    src={
                                                        preview
                                                    }
                                                    alt={`New gallery ${
                                                        index +
                                                        1
                                                    }`}
                                                    className="w-full h-full object-cover"
                                                />

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeGalleryImage(
                                                            index
                                                        )
                                                    }
                                                    className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition"
                                                >
                                                    <X
                                                        size={
                                                            15
                                                        }
                                                    />
                                                </button>

                                                <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-black/60 text-white text-[10px]">
                                                    New
                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            </div>
                        )}

                    </div>

                </div>

                {/* =================================================
                    PRODUCT SETTINGS
                ================================================= */}

                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">

                    <div className="px-5 md:px-6 py-5 border-b border-gray-100">

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
                            and special settings.
                        </p>

                    </div>

                    <div className="p-5 md:p-6 space-y-3">

                        {/* FEATURED */}

                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">

                            <div>

                                <p
                                    style={{
                                        color: "#111827",
                                        opacity: 1,
                                    }}
                                    className="text-sm font-semibold"
                                >
                                    Featured Product
                                </p>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        opacity: 1,
                                    }}
                                    className="text-xs mt-1"
                                >
                                    Show this product
                                    as a featured
                                    product.
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
                                className="w-5 h-5 accent-[#00b8b8]"
                            />

                        </label>

                        {/* NEW ARRIVAL */}

                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">

                            <div>

                                <p
                                    style={{
                                        color: "#111827",
                                        opacity: 1,
                                    }}
                                    className="text-sm font-semibold"
                                >
                                    New Arrival
                                </p>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        opacity: 1,
                                    }}
                                    className="text-xs mt-1"
                                >
                                    Mark this product
                                    as a new
                                    arrival.
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
                                className="w-5 h-5 accent-[#00b8b8]"
                            />

                        </label>

                        {/* STATUS */}

                        <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:bg-gray-50 cursor-pointer">

                            <div>

                                <p
                                    style={{
                                        color: "#111827",
                                        opacity: 1,
                                    }}
                                    className="text-sm font-semibold"
                                >
                                    Product Status
                                </p>

                                <p
                                    style={{
                                        color: "#6b7280",
                                        opacity: 1,
                                    }}
                                    className="text-xs mt-1"
                                >
                                    Control whether
                                    this product is
                                    active.
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
                                className="w-5 h-5 accent-[#00b8b8]"
                            />

                        </label>

                    </div>

                </div>

                {/* =================================================
                    BOTTOM BUTTONS
                ================================================= */}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pb-5">

                    <button
                        type="button"
                        onClick={() =>
                            router.push(
                                "/admin/products"
                            )
                        }
                        disabled={saving}
                        className="h-11 px-6 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold hover:bg-gray-50 transition disabled:opacity-60"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={saving}
                        className="h-11 px-6 rounded-xl bg-[#00b8b8] text-white font-semibold flex items-center justify-center gap-2 hover:bg-[#00a5a5] transition disabled:opacity-60"
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
                                <Save
                                    size={18}
                                />

                                Save Changes
                            </>
                        )}

                    </button>

                </div>

            </form>

            {/* =================================================
                GLOBAL STYLE
            ================================================= */}

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

                select option {
                    color: #111827 !important;
                    background-color: #ffffff !important;
                }
            `}</style>

        </div>
    );
}