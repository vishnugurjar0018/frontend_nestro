"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    ChevronLeft,
    ChevronRight,
    Filter,
    Package,
    X
} from "lucide-react";
import { toast } from "sonner";


const API_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/product`;


export default function ProductsPage() {

    const router = useRouter();


    // =====================================================
    // STATES
    // =====================================================

    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [categoryFilter, setCategoryFilter] = useState("");

    const [roomFilter, setRoomFilter] = useState("");

    const [statusFilter, setStatusFilter] = useState("");

    const [currentPage, setCurrentPage] = useState(1);

    const [deleteLoading, setDeleteLoading] = useState(null);


    const itemsPerPage = 8;


    // =====================================================
    // GET PRODUCTS
    // =====================================================

    const fetchProducts = async () => {

        try {

            setLoading(true);

            const response = await axios.get(API_URL);

            if (response.data.success) {

                setProducts(response.data.data || []);

            } else {

                toast.error(
                    response.data.message || "Unable to fetch products"
                );

            }

        } catch (error) {

            console.log("PRODUCT FETCH ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to load products"
            );

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchProducts();

    }, []);


    // =====================================================
    // DELETE PRODUCT
    // =====================================================

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) return;


        try {

            setDeleteLoading(id);

            const response = await axios.delete(
                `${API_URL}/${id}`
            );


            if (response.data.success) {

                toast.success(
                    "Product deleted successfully"
                );

                setProducts((prev) =>
                    prev.filter(
                        (product) => product._id !== id
                    )
                );

            } else {

                toast.error(
                    response.data.message ||
                    "Unable to delete product"
                );

            }

        } catch (error) {

            console.log("DELETE PRODUCT ERROR:", error);

            toast.error(
                error.response?.data?.message ||
                "Failed to delete product"
            );

        } finally {

            setDeleteLoading(null);

        }

    };


    // =====================================================
    // STATUS CHANGE
    // =====================================================

    const handleStatusChange = async (
        id,
        currentStatus
    ) => {

        try {

            const response = await axios.patch(
                `${API_URL}/status/${id}`,
                {
                    status: !currentStatus
                }
            );


            if (response.data.success) {

                toast.success(
                    "Product status updated"
                );


                setProducts((prev) =>
                    prev.map((product) =>
                        product._id === id
                            ? {
                                ...product,
                                status: !currentStatus
                            }
                            : product
                    )
                );

            }

        } catch (error) {

            console.log(
                "STATUS UPDATE ERROR:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Unable to update status"
            );

        }

    };


    // =====================================================
    // FILTER PRODUCTS
    // =====================================================

    const filteredProducts = products.filter(
        (product) => {

            const productName =
                product.name?.toLowerCase() || "";

            const categoryName =
                product.categoryID?.name?.toLowerCase() || "";

            const roomName =
                product.roomID?.name?.toLowerCase() || "";


            const searchMatch =
                productName.includes(
                    search.toLowerCase()
                );


            const categoryMatch =
                !categoryFilter ||
                categoryName ===
                categoryFilter.toLowerCase();


            const roomMatch =
                !roomFilter ||
                roomName ===
                roomFilter.toLowerCase();


            const statusMatch =
                statusFilter === ""
                    ? true
                    : product.status ===
                      (statusFilter === "active");


            return (
                searchMatch &&
                categoryMatch &&
                roomMatch &&
                statusMatch
            );

        }
    );


    // =====================================================
    // UNIQUE CATEGORIES
    // =====================================================

    const categories = [
        ...new Map(
            products
                .filter(
                    (product) =>
                        product.categoryID
                )
                .map(
                    (product) => [
                        product.categoryID._id,
                        product.categoryID
                    ]
                )
        ).values()
    ];


    // =====================================================
    // UNIQUE ROOMS
    // =====================================================

    const rooms = [
        ...new Map(
            products
                .filter(
                    (product) =>
                        product.roomID
                )
                .map(
                    (product) => [
                        product.roomID._id,
                        product.roomID
                    ]
                )
        ).values()
    ];


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalPages = Math.ceil(
        filteredProducts.length /
        itemsPerPage
    );


    const startIndex =
        (currentPage - 1) *
        itemsPerPage;


    const paginatedProducts =
        filteredProducts.slice(
            startIndex,
            startIndex + itemsPerPage
        );


    // =====================================================
    // FORMAT PRICE
    // =====================================================

    const formatPrice = (price) => {

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0
            }
        ).format(price || 0);

    };


    // =====================================================
    // RESET FILTERS
    // =====================================================

    const resetFilters = () => {

        setSearch("");

        setCategoryFilter("");

        setRoomFilter("");

        setStatusFilter("");

        setCurrentPage(1);

    };


    return (

        <div className="w-full min-h-[calc(100vh-80px)] bg-[#f7f9fc] p-5 md:p-7">


            {/* =====================================================
                PAGE HEADER
            ===================================================== */}

            <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-[#e7fafa] flex items-center justify-center">

                            <Package
                                size={22}
                                className="text-[#00b8b8]"
                            />

                        </div>


                        <div>

                            <h1 className="text-2xl font-bold text-[#172033]">

                                Products

                            </h1>

                            <p className="text-sm text-gray-500 mt-1">

                                Manage your products

                            </p>

                        </div>

                    </div>

                </div>


                {/* ADD PRODUCT */}

                <button
                    onClick={() =>
                        router.push(
                            "/admin/products/add"
                        )
                    }
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00b8b8] hover:bg-[#00a5a5] text-white font-semibold shadow-sm transition"
                >

                    <Plus size={19} />

                    Add Product

                </button>

            </div>



            {/* =====================================================
                FILTER CARD
            ===================================================== */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">


                <div className="flex flex-col xl:flex-row gap-3">


                    {/* SEARCH */}

                    <div className="relative flex-1">

                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => {

                                setSearch(
                                    e.target.value
                                );

                                setCurrentPage(1);

                            }}
                            className="w-full h-11 pl-11 pr-4 rounded-xl border border-gray-200 outline-none focus:border-[#00b8b8] focus:ring-2 focus:ring-[#00b8b8]/10 text-sm"
                        />

                    </div>


                    {/* CATEGORY */}

                    <select
                        value={categoryFilter}
                        onChange={(e) => {

                            setCategoryFilter(
                                e.target.value
                            );

                            setCurrentPage(1);

                        }}
                        className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-[#00b8b8] text-sm text-gray-600 min-w-[170px]"
                    >

                        <option value="">
                            All Categories
                        </option>

                        {categories.map(
                            (category) => (

                                <option
                                    key={category._id}
                                    value={category.name}
                                >

                                    {category.name}

                                </option>

                            )
                        )}

                    </select>


                    {/* ROOM */}

                    <select
                        value={roomFilter}
                        onChange={(e) => {

                            setRoomFilter(
                                e.target.value
                            );

                            setCurrentPage(1);

                        }}
                        className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-[#00b8b8] text-sm text-gray-600 min-w-[170px]"
                    >

                        <option value="">
                            All Rooms
                        </option>

                        {rooms.map(
                            (room) => (

                                <option
                                    key={room._id}
                                    value={room.name}
                                >

                                    {room.name}

                                </option>

                            )
                        )}

                    </select>


                    {/* STATUS */}

                    <select
                        value={statusFilter}
                        onChange={(e) => {

                            setStatusFilter(
                                e.target.value
                            );

                            setCurrentPage(1);

                        }}
                        className="h-11 px-4 rounded-xl border border-gray-200 outline-none focus:border-[#00b8b8] text-sm text-gray-600 min-w-[150px]"
                    >

                        <option value="">
                            All Status
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="inactive">
                            Inactive
                        </option>

                    </select>


                    {/* RESET */}

                    {(search ||
                        categoryFilter ||
                        roomFilter ||
                        statusFilter) && (

                        <button
                            onClick={resetFilters}
                            className="h-11 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 text-sm text-gray-600 flex items-center justify-center gap-2"
                        >

                            <X size={17} />

                            Clear

                        </button>

                    )}

                </div>

            </div>



            {/* =====================================================
                PRODUCT TABLE
            ===================================================== */}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">


                {/* TABLE HEADER */}

                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">

                    <div>

                        <h2 className="font-semibold text-[#172033]">

                            All Products

                        </h2>

                        <p className="text-xs text-gray-500 mt-1">

                            {filteredProducts.length} products found

                        </p>

                    </div>


                    <div className="flex items-center gap-2 text-sm text-gray-500">

                        <Filter size={16} />

                        Manage Products

                    </div>

                </div>



                {/* LOADING */}

                {loading ? (

                    <div className="py-20 text-center">

                        <div className="w-9 h-9 border-4 border-gray-200 border-t-[#00b8b8] rounded-full animate-spin mx-auto mb-4"></div>

                        <p className="text-gray-500 text-sm">

                            Loading products...

                        </p>

                    </div>

                ) : paginatedProducts.length === 0 ? (

                    /* EMPTY */

                    <div className="py-20 text-center">

                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">

                            <Package
                                size={28}
                                className="text-gray-400"
                            />

                        </div>

                        <h3 className="font-semibold text-gray-700">

                            No products found

                        </h3>

                        <p className="text-sm text-gray-400 mt-1">

                            Try changing your filters or add a new product.

                        </p>

                    </div>

                ) : (

                    <>


                        {/* DESKTOP TABLE */}

                        <div className="hidden lg:block overflow-x-auto">

                            <table className="w-full">

                                <thead>

                                    <tr className="bg-[#fafbfc] border-b border-gray-100">

                                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Thumbnail

                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Product

                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Category

                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Room

                                        </th>

                                        <th className="text-left px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Price

                                        </th>

                                        <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Stock

                                        </th>

                                        <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Status

                                        </th>

                                        <th className="text-center px-5 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">

                                            Actions

                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {paginatedProducts.map(
                                        (product) => (

                                            <tr
                                                key={product._id}
                                                className="border-b border-gray-100 last:border-b-0 hover:bg-[#fafdfd] transition"
                                            >


                                                {/* THUMBNAIL */}

                                                <td className="px-5 py-4">

                                                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50">

                                                        {product.thumbnail ? (

                                                            <img
                                                                src={product.thumbnail}
                                                                alt={product.name}
                                                                className="w-full h-full object-cover"
                                                            />

                                                        ) : (

                                                            <div className="w-full h-full flex items-center justify-center">

                                                                <ImageIcon
                                                                    size={24}
                                                                    className="text-gray-300"
                                                                />

                                                            </div>

                                                        )}

                                                    </div>

                                                </td>



                                                {/* PRODUCT */}

                                                <td className="px-5 py-4">

                                                    <div className="max-w-[220px]">

                                                        <p className="font-semibold text-[#172033] truncate">

                                                            {product.name}

                                                        </p>

                                                        <p className="text-xs text-gray-400 mt-1 truncate">

                                                            {product.shortDescription ||
                                                                "No description"}

                                                        </p>

                                                    </div>

                                                </td>



                                                {/* CATEGORY */}

                                                <td className="px-5 py-4">

                                                    <span className="text-sm text-gray-600">

                                                        {product.categoryID?.name ||
                                                            "—"}

                                                    </span>

                                                </td>



                                                {/* ROOM */}

                                                <td className="px-5 py-4">

                                                    <span className="text-sm text-gray-600">

                                                        {product.roomID?.name ||
                                                            "—"}

                                                    </span>

                                                </td>



                                                {/* PRICE */}

                                                <td className="px-5 py-4">

                                                    <div>

                                                        <p className="font-semibold text-[#172033]">

                                                            {formatPrice(
                                                                product.price
                                                            )}

                                                        </p>


                                                        {product.discount >
                                                            0 && (

                                                            <p className="text-xs text-green-600 mt-1">

                                                                {product.discount}% off

                                                            </p>

                                                        )}

                                                    </div>

                                                </td>



                                                {/* STOCK */}

                                                <td className="px-5 py-4 text-center">

                                                    {product.stock ? (

                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">

                                                            In Stock

                                                        </span>

                                                    ) : (

                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-500">

                                                            Out of Stock

                                                        </span>

                                                    )}

                                                </td>



                                                {/* STATUS */}

                                                <td className="px-5 py-4 text-center">

                                                    <button
                                                        onClick={() =>
                                                            handleStatusChange(
                                                                product._id,
                                                                product.status
                                                            )
                                                        }
                                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                                                            product.status
                                                                ? "bg-[#00b8b8]"
                                                                : "bg-gray-300"
                                                        }`}
                                                    >

                                                        <span
                                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                                                product.status
                                                                    ? "translate-x-6"
                                                                    : "translate-x-1"
                                                            }`}
                                                        />

                                                    </button>

                                                </td>



                                                {/* ACTIONS */}

                                                <td className="px-5 py-4">

                                                    <div className="flex items-center justify-center gap-2">


                                                        {/* VIEW

                                                        <button
                                                            title="View"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/admin/products/view/${product._id}`
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition"
                                                        >

                                                            <Eye size={17} />

                                                        </button> */}



                                                        {/* EDIT */}

                                                        <button
                                                            title="Edit"
                                                            onClick={() =>
                                                                router.push(
                                                                    `/admin/products/edit/${product._id}`
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg bg-amber-50 text-amber-500 hover:bg-amber-100 flex items-center justify-center transition"
                                                        >

                                                            <Edit size={17} />

                                                        </button>
{/* DELETE */}

                                                        <button
                                                            title="Delete"
                                                            disabled={
                                                                deleteLoading ===
                                                                product._id
                                                            }
                                                            onClick={() =>
                                                                handleDelete(
                                                                    product._id
                                                                )
                                                            }
                                                            className="w-9 h-9 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 flex items-center justify-center transition disabled:opacity-50"
                                                        >

                                                            {deleteLoading ===
                                                            product._id ? (

                                                                <div className="w-4 h-4 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />

                                                            ) : (

                                                                <Trash2 size={17} />

                                                            )}

                                                        </button>


                                                    </div>

                                                </td>

                                            </tr>

                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>



                        {/* =====================================================
                            MOBILE CARDS
                        ===================================================== */}

                        <div className="lg:hidden divide-y divide-gray-100">

                            {paginatedProducts.map(
                                (product) => (

                                    <div
                                        key={product._id}
                                        className="p-4"
                                    >

                                        <div className="flex gap-4">


                                            {/* IMAGE */}

                                            <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0">

                                                {product.thumbnail ? (

                                                    <img
                                                        src={product.thumbnail}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />

                                                ) : (

                                                    <div className="w-full h-full flex items-center justify-center">

                                                        <ImageIcon
                                                            size={25}
                                                            className="text-gray-300"
                                                        />

                                                    </div>

                                                )}

                                            </div>


                                            {/* INFO */}

                                            <div className="min-w-0 flex-1">

                                                <div className="flex items-start justify-between gap-2">

                                                    <div>

                                                        <h3 className="font-semibold text-[#172033] truncate">

                                                            {product.name}

                                                        </h3>

                                                        <p className="text-sm text-gray-500 mt-1">

                                                            {product.categoryID?.name ||
                                                                "—"}

                                                            {" • "}

                                                            {product.roomID?.name ||
                                                                "—"}

                                                        </p>

                                                    </div>

                                                    <p className="font-semibold text-[#172033]">

                                                        {formatPrice(
                                                            product.price
                                                        )}

                                                    </p>

                                                </div>


                                                <div className="flex items-center gap-2 mt-3">

                                                    {product.stock ? (

                                                        <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-600">

                                                            In Stock

                                                        </span>

                                                    ) : (

                                                        <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-500">

                                                            Out of Stock

                                                        </span>

                                                    )}


                                                    <span
                                                        className={`text-xs px-2 py-1 rounded-full ${
                                                            product.status
                                                                ? "bg-teal-50 text-teal-600"
                                                                : "bg-gray-100 text-gray-500"
                                                        }`}
                                                    >

                                                        {product.status
                                                            ? "Active"
                                                            : "Inactive"}

                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* MOBILE ACTIONS */}

                                        <div className="flex items-center justify-end gap-2 mt-4">

                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/products/view/${product._id}`
                                                    )
                                                }
                                                className="px-3 py-2 rounded-lg bg-blue-50 text-blue-500 text-xs font-medium flex items-center gap-1.5"
                                            >

                                                <Eye size={15} />

                                                View

                                            </button>


                                            <button
                                                onClick={() =>
                                                    router.push(
                                                        `/admin/products/edit/${product._id}`
                                                    )
                                                }
                                                className="px-3 py-2 rounded-lg bg-amber-50 text-amber-500 text-xs font-medium flex items-center gap-1.5"
                                            >

                                                <Edit size={15} />

                                                Edit

                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        product._id
                                                    )
                                                }
                                                className="px-3 py-2 rounded-lg bg-red-50 text-red-500 text-xs font-medium flex items-center gap-1.5"
                                            >

                                                <Trash2 size={15} />

                                                Delete

                                            </button>

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </>

                )}



                {/* =====================================================
                    PAGINATION
                ===================================================== */}

                {!loading &&
                    filteredProducts.length > 0 && (

                    <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">

                        <p className="text-sm text-gray-500">

                            Showing{" "}

                            <span className="font-medium text-gray-700">

                                {startIndex + 1}

                            </span>

                            {" - "}

                            <span className="font-medium text-gray-700">

                                {Math.min(
                                    startIndex +
                                    itemsPerPage,
                                    filteredProducts.length
                                )}

                            </span>

                            {" of "}

                            <span className="font-medium text-gray-700">

                                {filteredProducts.length}

                            </span>

                        </p>


                        <div className="flex items-center gap-2">

                            <button
                                disabled={
                                    currentPage === 1
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            prev - 1
                                    )
                                }
                                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >

                                <ChevronLeft size={18} />

                            </button>


                            <div className="min-w-9 h-9 px-3 rounded-lg bg-[#00b8b8] text-white flex items-center justify-center text-sm font-medium">

                                {currentPage}

                            </div>


                            <button
                                disabled={
                                    currentPage >=
                                    totalPages
                                }
                                onClick={() =>
                                    setCurrentPage(
                                        (prev) =>
                                            prev + 1
                                    )
                                }
                                className="w-9 h-9 rounded-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
                            >

                                <ChevronRight size={18} />

                            </button>

                        </div>

                    </div>

                )}

            </div>
</div>

    );

}