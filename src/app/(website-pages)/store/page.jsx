import StoreHero from "@/componends/website/store/StoreHero";
import StoreToolbar from "@/componends/website/store/StoreToolbar";
import ProductGrid from "@/componends/website/store/ProductGrid";
import StoreFilters from "@/componends/website/store/StoreFilters";
import StorePagination from "./StorePagination";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;


/* =========================================================
   GET PRODUCTS
========================================================= */

async function getProducts(
    page = 1,
    filters = {}
) {
    try {

        const params =
            new URLSearchParams();


        /* =====================================================
           PAGINATION
        ===================================================== */

        params.set(
            "page",
            String(page)
        );

        params.set(
            "limit",
            "6"
        );


        /* =====================================================
           CATEGORY
           
           Multiple:
           category=id1
           category=id2
        ===================================================== */

        if (
            Array.isArray(
                filters.category
            )
        ) {

            filters.category
                .filter(Boolean)
                .forEach(
                    (id) => {
                        params.append(
                            "category",
                            String(id)
                        );
                    }
                );

        }


        /* =====================================================
           ROOM
           
           Multiple:
           room=id1
           room=id2
        ===================================================== */

        if (
            Array.isArray(
                filters.room
            )
        ) {

            filters.room
                .filter(Boolean)
                .forEach(
                    (id) => {
                        params.append(
                            "room",
                            String(id)
                        );
                    }
                );

        }


        /* =====================================================
           MATERIAL
        ===================================================== */

        if (
            Array.isArray(
                filters.material
            )
        ) {

            filters.material
                .filter(Boolean)
                .forEach(
                    (value) => {
                        params.append(
                            "material",
                            String(value)
                        );
                    }
                );

        }


        /* =====================================================
           COLOR
        ===================================================== */

        if (
            Array.isArray(
                filters.color
            )
        ) {

            filters.color
                .filter(Boolean)
                .forEach(
                    (value) => {
                        params.append(
                            "color",
                            String(value)
                        );
                    }
                );

        }


        /* =====================================================
           MIN PRICE
        ===================================================== */

        if (filters.minPrice) {

            params.set(
                "minPrice",
                String(
                    filters.minPrice
                )
            );

        }


        /* =====================================================
           MAX PRICE
        ===================================================== */

        if (filters.maxPrice) {

            params.set(
                "maxPrice",
                String(
                    filters.maxPrice
                )
            );

        }


        /* =====================================================
           SORT
        ===================================================== */

        if (filters.sort) {

            params.set(
                "sort",
                String(
                    filters.sort
                )
            );

        }


        /* =====================================================
           API REQUEST
        ===================================================== */

        const response =
            await fetch(
                `${API_BASE_URL}/product?${params.toString()}`,
                {
                    next: {
                        revalidate: 60,
                    },
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch products"
            );

        }


        const result =
            await response.json();


        /* =====================================================
           API RESPONSE
        ===================================================== */

        return {

            products:
                Array.isArray(
                    result?.data?.products
                )
                    ? result.data.products
                    : Array.isArray(
                        result?.data
                    )
                        ? result.data
                        : [],


            pagination:
                result?.data?.pagination ||
                {
                    currentPage:
                        page,

                    totalPages:
                        1,

                    totalProducts:
                        0,

                    limit:
                        6,
                },

        };


    } catch (error) {

        console.error(
            "Product API Error:",
            error
        );


        return {

            products: [],

            pagination: {

                currentPage:
                    page,

                totalPages:
                    1,

                totalProducts:
                    0,

                limit:
                    6,

            },

        };
    }
}


/* =========================================================
   GET CATEGORIES
========================================================= */

async function getCategories() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/category`,
                {
                    next: {
                        revalidate: 300,
                    },
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch categories"
            );

        }


        const result =
            await response.json();


        return Array.isArray(
            result?.data
        )
            ? result.data
            : [];


    } catch (error) {

        console.error(
            "Categories API Error:",
            error
        );

        return [];
    }
}


/* =========================================================
   GET ROOMS
========================================================= */

async function getRooms() {

    try {

        const response =
            await fetch(
                `${API_BASE_URL}/room`,
                {
                    next: {
                        revalidate: 300,
                    },
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch rooms"
            );

        }


        const result =
            await response.json();


        return Array.isArray(
            result?.data
        )
            ? result.data
            : [];


    } catch (error) {

        console.error(
            "Rooms API Error:",
            error
        );

        return [];
    }
}


/* =========================================================
   GET UNIQUE VALUES
========================================================= */

function getUniqueValues(
    products,
    field
) {

    return [
        ...new Set(
            products
                .map(
                    (product) =>
                        product?.[field]
                )
                .filter(Boolean)
        ),
    ];

}


/* =========================================================
   NORMALIZE QUERY PARAM
========================================================= */

function getQueryArray(
    value
) {

    if (
        value === undefined ||
        value === null
    ) {

        return [];

    }


    if (Array.isArray(value)) {

        return value.filter(Boolean);

    }


    return [value].filter(Boolean);

}


/* =========================================================
   STORE PAGE
========================================================= */

export default async function StorePage({
    searchParams,
}) {

    /* =====================================================
       SEARCH PARAMS
    ===================================================== */

    const params =
        await searchParams;


    /* =====================================================
       CURRENT PAGE
    ===================================================== */

    const currentPage =
        Math.max(
            Number(
                params?.page
            ) || 1,
            1
        );


    /* =====================================================
       MULTI SELECT FILTERS
       
       Example:
       
       ?category=id1&category=id2
       
       becomes:
       
       ["id1", "id2"]
    ===================================================== */

    const categoryIds =
        getQueryArray(
            params?.category
        );


    const roomIds =
        getQueryArray(
            params?.room
        );


    const materials =
        getQueryArray(
            params?.material
        );


    const colors =
        getQueryArray(
            params?.color
        );


    /* =====================================================
       PRICE
    ===================================================== */

    const minPrice =
        params?.minPrice || "";


    const maxPrice =
        params?.maxPrice || "";


    /* =====================================================
       SORT
    ===================================================== */

    const sort =
        params?.sort ||
        "featured";


    /* =====================================================
       FETCH DATA
    ===================================================== */

    const [
        productResult,
        categories,
        rooms,
    ] = await Promise.all([

        getProducts(
            currentPage,
            {

                category:
                    categoryIds,

                room:
                    roomIds,

                material:
                    materials,

                color:
                    colors,

                minPrice:
                    minPrice,

                maxPrice:
                    maxPrice,

                sort:
                    sort,

            }
        ),

        getCategories(),

        getRooms(),

    ]);


    /* =====================================================
       PRODUCTS
    ===================================================== */

    const products =
        productResult?.products ||
        [];


    /* =====================================================
       PAGINATION
    ===================================================== */

    const pagination =
        productResult?.pagination ||
        {

            currentPage:
                currentPage,

            totalPages:
                1,

            totalProducts:
                products.length,

            limit:
                6,

        };


    /* =====================================================
       MATERIAL VALUES
       
       IMPORTANT:
       We are getting these from currently loaded products.
       
       If you want ALL materials from the database,
       create a separate material API later.
    ===================================================== */

    const materialValues =
        getUniqueValues(
            products,
            "material"
        );


    /* =====================================================
       COLOR VALUES
    ===================================================== */

    const colorValues =
        getUniqueValues(
            products,
            "color"
        );


    /* =====================================================
       ACTIVE FILTERS
    ===================================================== */

    const activeFilters = [];


    /* =====================================================
       ACTIVE CATEGORIES
    ===================================================== */

    categoryIds.forEach(
        (categoryId) => {

            const category =
                categories.find(
                    (item) =>
                        String(
                            item?._id ||
                            item?.id
                        ) ===
                        String(
                            categoryId
                        )
                );


            if (category) {

                activeFilters.push({

                    id:
                        "category",

                    value:
                        categoryId,

                    label:
                        category.name ||
                        category.title ||
                        "Category",

                });

            }

        }
    );


    /* =====================================================
       ACTIVE ROOMS
    ===================================================== */

    roomIds.forEach(
        (roomId) => {

            const room =
                rooms.find(
                    (item) =>
                        String(
                            item?._id ||
                            item?.id
                        ) ===
                        String(
                            roomId
                        )
                );


            if (room) {

                activeFilters.push({

                    id:
                        "room",

                    value:
                        roomId,

                    label:
                        room.name ||
                        room.title ||
                        "Room",

                });

            }

        }
    );


    /* =====================================================
       ACTIVE MATERIALS
    ===================================================== */

    materials.forEach(
        (material) => {

            activeFilters.push({

                id:
                    "material",

                value:
                    material,

                label:
                    material,

            });

        }
    );


    /* =====================================================
       ACTIVE COLORS
    ===================================================== */

    colors.forEach(
        (color) => {

            activeFilters.push({

                id:
                    "color",

                value:
                    color,

                label:
                    color,

            });

        }
    );


    /* =====================================================
       ACTIVE MIN PRICE
    ===================================================== */

    if (minPrice) {

        activeFilters.push({

            id:
                "minPrice",

            value:
                minPrice,

            label:
                `Min ₹${minPrice}`,

        });

    }


    /* =====================================================
       ACTIVE MAX PRICE
    ===================================================== */

    if (maxPrice) {

        activeFilters.push({

            id:
                "maxPrice",

            value:
                maxPrice,

            label:
                `Max ₹${maxPrice}`,

        });

    }


    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <main
            className="
                min-h-screen
                bg-[#faf8f5]
            "
        >

            {/* =================================================
                HERO
            ================================================= */}

            <StoreHero />


            {/* =================================================
                STORE CONTENT
            ================================================= */}

            <section
                aria-labelledby="store-products-heading"
                className="
                    px-4
                    pb-16
                    pt-8
                    sm:px-6
                    lg:px-8
                "
            >

                <div
                    className="
                        mx-auto
                        max-w-7xl
                    "
                >

                    {/* =================================================
                        HEADING
                    ================================================= */}

                    <div
                        className="
                            mb-5
                        "
                    >

                        <p
                            className="
                                text-[11px]
                                font-semibold
                                uppercase
                                tracking-[0.22em]
                                text-[#a56f45]
                            "
                        >
                            Explore Our Collection
                        </p>


                        <h1
                            id="store-products-heading"
                            className="
                                mt-2
                                text-2xl
                                font-medium
                                tracking-tight
                                text-[#211812]
                                sm:text-3xl
                            "
                        >
                            Shop Furniture
                        </h1>

                    </div>


                    {/* =================================================
                        TOOLBAR
                    ================================================= */}

                    <StoreToolbar
                        productCount={
                            pagination.totalProducts
                        }
                        activeFilters={
                            activeFilters
                        }
                    />


                    {/* =================================================
                        MAIN LAYOUT
                    ================================================= */}

                    <div
                        className="
                            grid
                            grid-cols-1
                            gap-6
                            lg:grid-cols-[250px_minmax(0,1fr)]
                        "
                    >

                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <StoreFilters
                            categories={
                                categories
                            }

                            rooms={
                                rooms
                            }

                            materials={
                                materialValues
                            }

                            colors={
                                colorValues
                            }
                        />


                        {/* =================================================
                            PRODUCTS
                        ================================================= */}

                        <div
                            className="
                                min-w-0
                            "
                        >

                            <ProductGrid
                                products={
                                    products
                                }
                            />


                            {/* =================================================
                                PAGINATION
                            ================================================= */}

                            <StorePagination
                                currentPage={
                                    pagination.currentPage
                                }

                                totalPages={
                                    pagination.totalPages
                                }
                            />

                        </div>

                    </div>

                </div>

            </section>

        </main>

    );
}