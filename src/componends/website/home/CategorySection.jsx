import Image from "next/image";
import Link from "next/link";

const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL;


/* =========================================================
   GET CATEGORIES
========================================================= */

async function getCategories() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/category`,
            {
                next: {
                    revalidate: 60,
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

        const categories =
            Array.isArray(result?.data)
                ? result.data
                : result?.data
                    ? [result.data]
                    : [];

        return categories.filter(
            (category) =>
                category?.status !== false
        );

    } catch (error) {
        console.error(
            "Category API Error:",
            error
        );

        return [];
    }
}


/* =========================================================
   GET PRODUCTS
========================================================= */

async function getProducts() {
    try {
        /*
         * First page
         * We use a larger limit because category
         * counts should not depend on Store page pagination.
         */
        const firstResponse = await fetch(
            `${API_BASE_URL}/product?page=1&limit=100`,
            {
                next: {
                    revalidate: 60,
                },
            }
        );

        if (!firstResponse.ok) {
            throw new Error(
                "Failed to fetch products"
            );
        }

        const firstResult =
            await firstResponse.json();

        const firstProducts =
            Array.isArray(
                firstResult?.data?.products
            )
                ? firstResult.data.products
                : Array.isArray(
                    firstResult?.data
                )
                    ? firstResult.data
                    : [];


        /*
         * Get pagination information
         */

        const pagination =
            firstResult?.data?.pagination;


        const totalPages =
            Number(
                pagination?.totalPages
            ) || 1;


        /*
         * If everything came in first request,
         * return it directly.
         */

        if (totalPages <= 1) {
            return firstProducts;
        }


        /*
         * Fetch remaining pages
         */

        const remainingPages =
            Array.from(
                {
                    length:
                        totalPages - 1,
                },
                (_, index) =>
                    index + 2
            );


        const remainingResults =
            await Promise.all(
                remainingPages.map(
                    async (page) => {

                        const response =
                            await fetch(
                                `${API_BASE_URL}/product?page=${page}&limit=100`,
                                {
                                    next: {
                                        revalidate: 60,
                                    },
                                }
                            );


                        if (!response.ok) {
                            return [];
                        }


                        const result =
                            await response.json();


                        if (
                            Array.isArray(
                                result?.data?.products
                            )
                        ) {
                            return result.data.products;
                        }


                        if (
                            Array.isArray(
                                result?.data
                            )
                        ) {
                            return result.data;
                        }


                        return [];
                    }
                )
            );


        /*
         * Combine all pages
         */

        return [
            ...firstProducts,
            ...remainingResults.flat(),
        ];

    } catch (error) {

        console.error(
            "Product API Error:",
            error
        );

        return [];
    }
}


/* =========================================================
   GET CATEGORY ID
========================================================= */

function getCategoryId(category) {
    return String(
        category?._id ||
        category?.id ||
        ""
    );
}


/* =========================================================
   GET PRODUCT CATEGORY ID
========================================================= */

function getProductCategoryId(product) {

    const category =
        product?.categoryID;


    /*
     * If categoryID is populated object
     *
     * {
     *   categoryID: {
     *      _id: "...",
     *      name: "Chair"
     *   }
     * }
     */

    if (
        typeof category === "object" &&
        category !== null
    ) {
        return String(
            category?._id ||
            category?.id ||
            ""
        );
    }


    /*
     * If categoryID is directly an ID
     *
     * {
     *   categoryID: "67..."
     * }
     */

    return String(
        category || ""
    );
}


/* =========================================================
   GET PRODUCT COUNT
========================================================= */

function getProductCount(
    category,
    products
) {
    const categoryId =
        getCategoryId(category);


    if (!categoryId) {
        return 0;
    }


    return products.filter(
        (product) =>
            getProductCategoryId(
                product
            ) === categoryId
    ).length;
}


/* =========================================================
   CATEGORY SECTION
========================================================= */

export default async function CategorySection() {

    const [
        categories,
        products,
    ] = await Promise.all([
        getCategories(),
        getProducts(),
    ]);


    /*
     * If there are no categories,
     * don't render the section.
     */

    if (!categories.length) {
        return null;
    }


    /*
     * Add product count to every category.
     */

    const categoryItems =
        categories.map(
            (category) => ({
                ...category,

                productCount:
                    getProductCount(
                        category,
                        products
                    ),
            })
        );


    return (
        <section
            aria-labelledby="category-section-title"
            className="
                bg-[#f8f6f2]
                px-4
                py-8
                sm:px-6
                sm:py-9
                lg:px-8
                lg:py-10
            "
        >

            <div
                className="
                    mx-auto
                    max-w-7xl
                "
            >

                {/* =================================================
                    SECTION HEADER
                ================================================= */}

                <div
                    className="
                        mb-6
                        flex
                        items-end
                        justify-between
                    "
                >

                    <div>

                        <p
                            className="
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-[0.22em]
                                text-[#9a6845]
                                sm:text-[11px]
                            "
                        >
                            Explore Our Collection
                        </p>


                        <h2
                            id="category-section-title"
                            className="
                                mt-1.5
                                text-xl
                                font-medium
                                tracking-tight
                                text-[#2f241e]
                                sm:text-2xl
                            "
                        >
                            Shop by Category
                        </h2>

                    </div>


                    {/* =================================================
                        VIEW ALL
                    ================================================= */}

                    <Link
                        href="/store"
                        className="
                            hidden
                            text-sm
                            font-medium
                            text-[#8d6042]
                            underline-offset-4
                            transition
                            hover:text-[#5f3f2c]
                            hover:underline
                            sm:inline-block
                        "
                    >
                        View all
                    </Link>

                </div>


                {/* =================================================
                    CATEGORY LIST
                ================================================= */}

                <ul
                    aria-label="Furniture categories"
                    className="
                        flex
                        gap-6
                        overflow-x-auto
                        pb-2
                        sm:justify-start
                        sm:gap-8
                        lg:gap-10
                    "
                >

                    {categoryItems.map(
                        (category) => {

                            /* ================================
                               CATEGORY DATA
                            ================================= */

                            const categoryId =
                                getCategoryId(
                                    category
                                );


                            const categoryName =
                                category?.name ||
                                category?.title ||
                                "Furniture";


                            const categoryImage =
                                category?.image ||
                                category?.thumbnail ||
                                "";


                            const productCount =
                                Number(
                                    category?.productCount ||
                                    0
                                );


                            /* ================================
                               CATEGORY URL
                            ================================= */

                            const categoryUrl =
                                `/store?category=${encodeURIComponent(
                                    categoryId
                                )}`;


                            return (
                                <li
                                    key={
                                        categoryId ||
                                        categoryName
                                    }
                                    className="
                                        shrink-0
                                    "
                                >

                                    <Link
                                        href={
                                            categoryUrl
                                        }
                                        className="
                                            group
                                            flex
                                            w-24
                                            flex-col
                                            items-center
                                            text-center
                                            sm:w-28
                                        "
                                    >

                                        {/* =================================================
                                            IMAGE
                                        ================================================= */}

                                        <div
                                            className="
                                                relative
                                                h-20
                                                w-20
                                                overflow-hidden
                                                rounded-full
                                                border
                                                border-[#e4d8ce]
                                                bg-[#eee7df]
                                                shadow-[0_4px_14px_rgba(55,38,26,0.05)]
                                                transition-all
                                                duration-300
                                                group-hover:scale-105
                                                group-hover:border-[#9a6845]
                                                group-hover:shadow-[0_8px_20px_rgba(55,38,26,0.12)]
                                                sm:h-24
                                                sm:w-24
                                            "
                                        >

                                            {categoryImage ? (

                                                <Image
                                                    src={
                                                        categoryImage
                                                    }
                                                    alt={`${categoryName} furniture collection`}
                                                    fill
                                                    sizes="96px"
                                                    className="
                                                        object-cover
                                                        transition-transform
                                                        duration-500
                                                        group-hover:scale-110
                                                    "
                                                />

                                            ) : (

                                                <div
                                                    aria-hidden="true"
                                                    className="
                                                        flex
                                                        h-full
                                                        w-full
                                                        items-center
                                                        justify-center
                                                        bg-[#e9dfd5]
                                                    "
                                                >

                                                    <span
                                                        className="
                                                            text-xl
                                                            font-medium
                                                            text-[#9a6845]
                                                        "
                                                    >
                                                        {categoryName
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </span>

                                                </div>

                                            )}

                                        </div>


                                        {/* =================================================
                                            CATEGORY NAME
                                        ================================================= */}

                                        <h3
                                            className="
                                                mt-2.5
                                                text-sm
                                                font-medium
                                                text-[#2f241e]
                                                transition-colors
                                                group-hover:text-[#9a6845]
                                            "
                                        >
                                            {
                                                categoryName
                                            }
                                        </h3>


                                        {/* =================================================
                                            PRODUCT COUNT
                                        ================================================= */}

                                        <p
                                            className="
                                                mt-0.5
                                                text-[11px]
                                                text-[#8a7b70]
                                            "
                                        >

                                            {
                                                productCount
                                            }

                                            {" "}

                                            {productCount === 1
                                                ? "piece"
                                                : "pieces"}

                                        </p>

                                    </Link>

                                </li>
                            );
                        }
                    )}

                </ul>


                {/* =================================================
                    MOBILE VIEW ALL
                ================================================= */}

                <div
                    className="
                        mt-5
                        sm:hidden
                    "
                >

                    <Link
                        href="/store"
                        className="
                            text-xs
                            font-medium
                            text-[#8d6042]
                            underline
                            underline-offset-4
                        "
                    >
                        View all categories →
                    </Link>

                </div>

            </div>

        </section>
    );
}