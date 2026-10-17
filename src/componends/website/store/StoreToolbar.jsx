"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StoreToolbar({
    productCount = 0,
    activeFilters = [],
}) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentSort =
        searchParams.get("sort") || "featured";


    /* =====================================================
       UPDATE SORT
    ===================================================== */

    const handleSortChange = (event) => {

        const value =
            event.target.value;

        const params =
            new URLSearchParams(
                searchParams.toString()
            );

        params.set(
            "sort",
            value
        );

        // Sorting change hone par
        // page 1 par chale jao
        params.set(
            "page",
            "1"
        );

        router.push(
            `/store?${params.toString()}`,
            {
                scroll: false,
            }
        );
    };


    /* =====================================================
       REMOVE ACTIVE FILTER
    ===================================================== */

    const removeFilter = (filter) => {

        const params =
            new URLSearchParams(
                searchParams.toString()
            );

        const values =
            params.getAll(filter.id);

        params.delete(
            filter.id
        );

        values
            .filter(
                (value) =>
                    value !==
                    String(filter.value)
            )
            .forEach(
                (value) => {
                    params.append(
                        filter.id,
                        value
                    );
                }
            );

        params.set(
            "page",
            "1"
        );

        router.push(
            `/store?${params.toString()}`,
            {
                scroll: false,
            }
        );
    };


    return (
        <div
            className="
                mb-6
                overflow-hidden
                rounded-2xl
                border
                border-[#e8ded5]
                bg-white
                shadow-[0_6px_25px_rgba(55,38,26,0.04)]
            "
        >

            {/* =================================================
                TOP BAR
            ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    p-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                    sm:py-4
                "
            >

                {/* PRODUCT COUNT */}

                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >

                    <span
                        className="
                            text-sm
                            font-semibold
                            text-[#211812]
                        "
                    >
                        {productCount}
                    </span>

                    <span
                        className="
                            text-sm
                            text-[#7f7066]
                        "
                    >
                        {productCount === 1
                            ? "product found"
                            : "products found"}
                    </span>

                </div>


                {/* SORT */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >

                    <label
                        htmlFor="store-sort"
                        className="
                            hidden
                            text-xs
                            font-medium
                            text-[#8a7b70]
                            sm:block
                        "
                    >
                        Sort by
                    </label>


                    <div
                        className="
                            relative
                            w-full
                            sm:w-56
                        "
                    >

                        <select
                            id="store-sort"
                            value={
                                currentSort
                            }
                            onChange={
                                handleSortChange
                            }
                            className="
                                h-12
                                w-full
                                appearance-none
                                rounded-xl
                                border
                                border-[#e8ded5]
                                bg-white
                                px-4
                                pr-10
                                text-sm
                                font-medium
                                text-[#3b2d25]
                                outline-none
                                transition
                                hover:border-[#b47b52]
                                focus:border-[#9a6845]
                                focus:ring-4
                                focus:ring-[#9a6845]/10
                            "
                        >

                            <option value="featured">
                                Featured
                            </option>

                            <option value="newest">
                                Newest
                            </option>

                            <option value="price-low">
                                Price: Low to High
                            </option>

                            <option value="price-high">
                                Price: High to Low
                            </option>

                            <option value="name-asc">
                                Name: A to Z
                            </option>

                            <option value="name-desc">
                                Name: Z to A
                            </option>

                        </select>


                        {/* ARROW */}

                        <span
                            className="
                                pointer-events-none
                                absolute
                                right-4
                                top-1/2
                                -translate-y-1/2
                                text-[#9a6845]
                            "
                        >
                            ↓
                        </span>

                    </div>

                </div>

            </div>


            {/* =================================================
                ACTIVE FILTERS
            ================================================= */}

            {activeFilters.length > 0 && (
                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                        border-t
                        border-[#eee5de]
                        bg-[#fcfaf8]
                        px-4
                        py-3
                        sm:px-5
                    "
                >

                    <span
                        className="
                            mr-1
                            text-[11px]
                            font-semibold
                            uppercase
                            tracking-[0.12em]
                            text-[#9a6845]
                        "
                    >
                        Active:
                    </span>


                    {activeFilters.map(
                        (filter, index) => (
                            <button
                                key={`${filter.id}-${filter.value}-${index}`}
                                type="button"
                                onClick={() =>
                                    removeFilter(
                                        filter
                                    )
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-2
                                    rounded-full
                                    border
                                    border-[#e1d2c5]
                                    bg-white
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-medium
                                    text-[#604d3e]
                                    transition
                                    hover:border-[#9a6845]
                                    hover:bg-[#f8eee6]
                                "
                            >

                                {filter.label}

                                <span
                                    className="
                                        text-[#9a6845]
                                    "
                                >
                                    ×
                                </span>

                            </button>
                        )
                    )}

                </div>
            )}

        </div>
    );
}