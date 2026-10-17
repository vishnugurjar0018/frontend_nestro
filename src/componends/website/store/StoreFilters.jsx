"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function StoreFilters({
    categories = [],
    rooms = [],
    materials = [],
    colors = [],
}) {
    const router = useRouter();
    const searchParams = useSearchParams();


    /* =====================================================
       GET MULTI SELECT VALUES
    ===================================================== */

    const getSelectedValues = (key) => {
        return searchParams.getAll(key);
    };


    const selectedCategories =
        getSelectedValues("category");

    const selectedRooms =
        getSelectedValues("room");

    const selectedMaterials =
        getSelectedValues("material");

    const selectedColors =
        getSelectedValues("color");


    const currentMinPrice =
        searchParams.get("minPrice") || "";

    const currentMaxPrice =
        searchParams.get("maxPrice") || "";


    /* =====================================================
       TOTAL ACTIVE FILTERS
    ===================================================== */

    const activeFilterCount =
        selectedCategories.length +
        selectedRooms.length +
        selectedMaterials.length +
        selectedColors.length +
        (currentMinPrice ? 1 : 0) +
        (currentMaxPrice ? 1 : 0);


    /* =====================================================
       UPDATE MULTI SELECT FILTER
    ===================================================== */

    const updateMultiFilter = (
        key,
        value
    ) => {

        const params =
            new URLSearchParams(
                searchParams.toString()
            );


        const currentValues =
            params.getAll(key);


        const stringValue =
            String(value);


        /* =================================================
           REMOVE VALUE IF ALREADY SELECTED
        ================================================= */

        if (
            currentValues.includes(
                stringValue
            )
        ) {

            const newValues =
                currentValues.filter(
                    (item) =>
                        item !== stringValue
                );


            params.delete(key);


            newValues.forEach(
                (item) => {
                    params.append(
                        key,
                        item
                    );
                }
            );

        }


        /* =================================================
           ADD VALUE
        ================================================= */

        else {

            params.append(
                key,
                stringValue
            );
        }


        /* =================================================
           RESET PAGE
        ================================================= */

        params.delete("page");


        router.push(
            `/store?${params.toString()}`,
            {
                scroll: false,
            }
        );
    };


    /* =====================================================
       UPDATE PRICE
    ===================================================== */

    const updatePrice = (
        key,
        value
    ) => {

        const params =
            new URLSearchParams(
                searchParams.toString()
            );


        if (value) {
            params.set(
                key,
                value
            );
        } else {
            params.delete(key);
        }


        /* Reset pagination */

        params.delete("page");


        router.push(
            `/store?${params.toString()}`,
            {
                scroll: false,
            }
        );
    };


    /* =====================================================
       CLEAR ALL FILTERS
    ===================================================== */

    const clearFilters = () => {

        router.push(
            "/store",
            {
                scroll: false,
            }
        );
    };


    /* =====================================================
       CHECK SELECTED
    ===================================================== */

    const isSelected = (
        values,
        value
    ) => {
        return values.includes(
            String(value)
        );
    };


    return (
        <aside
            aria-label="Product filters"
            className="
                overflow-hidden
                rounded-3xl
                border
                border-[#e8ded5]
                bg-white
                shadow-[0_10px_35px_rgba(55,38,26,0.06)]
            "
        >

            {/* =================================================
                HEADER
            ================================================= */}

            <div
                className="
                    border-b
                    border-[#eee5de]
                    bg-gradient-to-br
                    from-[#fffdfb]
                    to-[#f8f3ee]
                    p-5
                "
            >

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-3
                    "
                >

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >

                        {/* FILTER ICON */}

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-2xl
                                bg-[#f4ece4]
                                text-[#9a6845]
                            "
                        >
                            <svg
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <path
                                    d="M4 6h16"
                                />
                                <path
                                    d="M7 12h10"
                                />
                                <path
                                    d="M10 18h4"
                                />
                            </svg>
                        </div>


                        <div>

                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.22em]
                                    text-[#a56f45]
                                "
                            >
                                Refine
                            </p>

                            <h2
                                className="
                                    mt-0.5
                                    text-lg
                                    font-semibold
                                    text-[#211812]
                                "
                            >
                                Filters
                            </h2>

                        </div>

                    </div>


                    {/* ACTIVE COUNT */}

                    {activeFilterCount > 0 && (
                        <span
                            className="
                                flex
                                h-9
                                min-w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-[#a56f45]
                                px-2.5
                                text-xs
                                font-semibold
                                text-white
                                shadow-sm
                            "
                        >
                            {activeFilterCount}
                        </span>
                    )}

                </div>


                {/* CLEAR BUTTON */}

                {activeFilterCount > 0 && (
                    <button
                        type="button"
                        onClick={
                            clearFilters
                        }
                        className="
                            mt-4
                            flex
                            h-11
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-xl
                            border
                            border-[#e7ddd4]
                            bg-white
                            text-sm
                            font-medium
                            text-[#6f5c4f]
                            shadow-sm
                            transition
                            hover:border-[#b47b52]
                            hover:bg-[#fcf8f4]
                            hover:text-[#8f5f3f]
                        "
                    >

                        <svg
                            width="15"
                            height="15"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path
                                d="M3 6h18"
                            />
                            <path
                                d="M8 6V4h8v2"
                            />
                            <path
                                d="M19 6l-1 14H6L5 6"
                            />
                        </svg>

                        Clear all filters

                    </button>
                )}

            </div>


            {/* =================================================
                ROOM
            ================================================= */}

            {rooms.length > 0 && (
                <FilterSection
                    title="Room"
                    icon="home"
                >

                    <div
                        className="
                            space-y-1.5
                        "
                    >

                        {rooms.map(
                            (room) => {

                                const id =
                                    room?._id ||
                                    room?.id;

                                const name =
                                    room?.name ||
                                    room?.title ||
                                    "Room";

                                const selected =
                                    isSelected(
                                        selectedRooms,
                                        id
                                    );


                                return (
                                    <FilterOption
                                        key={id}
                                        label={name}
                                        selected={
                                            selected
                                        }
                                        onClick={() =>
                                            updateMultiFilter(
                                                "room",
                                                id
                                            )
                                        }
                                    />
                                );
                            }
                        )}

                    </div>

                </FilterSection>
            )}


            {/* =================================================
                CATEGORY
            ================================================= */}

            {categories.length > 0 && (
                <FilterSection
                    title="Category"
                    icon="grid"
                >

                    <div
                        className="
                            space-y-1.5
                        "
                    >

                        {categories.map(
                            (category) => {

                                const id =
                                    category?._id ||
                                    category?.id;

                                const name =
                                    category?.name ||
                                    category?.title ||
                                    "Category";

                                const selected =
                                    isSelected(
                                        selectedCategories,
                                        id
                                    );


                                return (
                                    <FilterOption
                                        key={id}
                                        label={name}
                                        selected={
                                            selected
                                        }
                                        onClick={() =>
                                            updateMultiFilter(
                                                "category",
                                                id
                                            )
                                        }
                                    />
                                );
                            }
                        )}

                    </div>

                </FilterSection>
            )}


            {/* =================================================
                MATERIAL
            ================================================= */}

            {materials.length > 0 && (
                <FilterSection
                    title="Material"
                    icon="material"
                >

                    <div
                        className="
                            space-y-1.5
                        "
                    >

                        {materials.map(
                            (material) => {

                                const selected =
                                    isSelected(
                                        selectedMaterials,
                                        material
                                    );


                                return (
                                    <FilterOption
                                        key={
                                            material
                                        }
                                        label={
                                            material
                                        }
                                        selected={
                                            selected
                                        }
                                        onClick={() =>
                                            updateMultiFilter(
                                                "material",
                                                material
                                            )
                                        }
                                    />
                                );
                            }
                        )}

                    </div>

                </FilterSection>
            )}


            {/* =================================================
                COLOR
            ================================================= */}

            {colors.length > 0 && (
                <FilterSection
                    title="Color"
                    icon="color"
                >

                    <div
                        className="
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        {colors.map(
                            (color) => {

                                const selected =
                                    isSelected(
                                        selectedColors,
                                        color
                                    );


                                return (
                                    <button
                                        key={
                                            color
                                        }
                                        type="button"
                                        onClick={() =>
                                            updateMultiFilter(
                                                "color",
                                                color
                                            )
                                        }
                                        className={`
                                            rounded-full
                                            border
                                            px-3.5
                                            py-2
                                            text-xs
                                            font-medium
                                            transition-all
                                            duration-200

                                            ${
                                                selected
                                                    ? `
                                                        border-[#9a6845]
                                                        bg-[#9a6845]
                                                        text-white
                                                        shadow-sm
                                                    `
                                                    : `
                                                        border-[#e8ded5]
                                                        bg-white
                                                        text-[#5f5148]
                                                        hover:border-[#b47b52]
                                                        hover:bg-[#fcf8f4]
                                                    `
                                            }
                                        `}
                                    >
                                        {color}
                                    </button>
                                );
                            }
                        )}

                    </div>

                </FilterSection>
            )}


            {/* =================================================
                PRICE RANGE
            ================================================= */}

            <FilterSection
                title="Price Range"
                icon="price"
            >

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-3
                    "
                >

                    {/* MIN */}

                    <div>

                        <label
                            htmlFor="minPrice"
                            className="
                                mb-1.5
                                block
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-[#9a8b81]
                            "
                        >
                            Minimum
                        </label>

                        <div
                            className="
                                relative
                            "
                        >

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    text-[#9a8b81]
                                "
                            >
                                ₹
                            </span>

                            <input
                                id="minPrice"
                                type="number"
                                min="0"
                                value={
                                    currentMinPrice
                                }
                                onChange={(
                                    event
                                ) =>
                                    updatePrice(
                                        "minPrice",
                                        event.target.value
                                    )
                                }
                                placeholder="0"
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e8ded5]
                                    bg-[#fcfaf8]
                                    pl-7
                                    pr-2
                                    text-sm
                                    text-[#211812]
                                    outline-none
                                    transition
                                    focus:border-[#9a6845]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[#9a6845]/10
                                "
                            />

                        </div>

                    </div>


                    {/* MAX */}

                    <div>

                        <label
                            htmlFor="maxPrice"
                            className="
                                mb-1.5
                                block
                                text-[10px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-[#9a8b81]
                            "
                        >
                            Maximum
                        </label>

                        <div
                            className="
                                relative
                            "
                        >

                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    left-3
                                    top-1/2
                                    -translate-y-1/2
                                    text-xs
                                    text-[#9a8b81]
                                "
                            >
                                ₹
                            </span>

                            <input
                                id="maxPrice"
                                type="number"
                                min="0"
                                value={
                                    currentMaxPrice
                                }
                                onChange={(
                                    event
                                ) =>
                                    updatePrice(
                                        "maxPrice",
                                        event.target.value
                                    )
                                }
                                placeholder="200000"
                                className="
                                    h-11
                                    w-full
                                    rounded-xl
                                    border
                                    border-[#e8ded5]
                                    bg-[#fcfaf8]
                                    pl-7
                                    pr-2
                                    text-sm
                                    text-[#211812]
                                    outline-none
                                    transition
                                    focus:border-[#9a6845]
                                    focus:bg-white
                                    focus:ring-4
                                    focus:ring-[#9a6845]/10
                                "
                            />

                        </div>

                    </div>

                </div>


                <p
                    className="
                        mt-3
                        text-[10px]
                        leading-4
                        text-[#9a8b81]
                    "
                >
                    Set a minimum and maximum
                    price to narrow your results.
                </p>

            </FilterSection>

        </aside>
    );
}


/* =========================================================
   FILTER SECTION
========================================================= */

function FilterSection({
    title,
    icon,
    children,
}) {
    return (
        <div
            className="
                border-t
                border-[#eee5de]
                p-5
            "
        >

            <div
                className="
                    mb-4
                    flex
                    items-center
                    gap-3
                "
            >

                <div
                    className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-[#f7f0e9]
                        text-[#9a6845]
                    "
                >
                    {icon === "home" && (
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <path
                                d="M3 11.5L12 4l9 7.5"
                            />
                            <path
                                d="M5 10v10h14V10"
                            />
                            <path
                                d="M9 20v-6h6v6"
                            />
                        </svg>
                    )}

                    {icon === "grid" && (
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <rect
                                x="4"
                                y="4"
                                width="6"
                                height="6"
                                rx="1"
                            />
                            <rect
                                x="14"
                                y="4"
                                width="6"
                                height="6"
                                rx="1"
                            />
                            <rect
                                x="4"
                                y="14"
                                width="6"
                                height="6"
                                rx="1"
                            />
                            <rect
                                x="14"
                                y="14"
                                width="6"
                                height="6"
                                rx="1"
                            />
                        </svg>
                    )}

                    {icon === "material" && (
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <path
                                d="M5 4h14v16H5z"
                            />
                            <path
                                d="M8 8h8"
                            />
                            <path
                                d="M8 12h5"
                            />
                        </svg>
                    )}

                    {icon === "color" && (
                        <svg
                            width="17"
                            height="17"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                        >
                            <circle
                                cx="12"
                                cy="12"
                                r="8"
                            />
                            <circle
                                cx="9"
                                cy="9"
                                r="1"
                            />
                            <circle
                                cx="15"
                                cy="9"
                                r="1"
                            />
                            <circle
                                cx="9"
                                cy="15"
                                r="1"
                            />
                        </svg>
                    )}

                    {icon === "price" && (
                        <span
                            className="
                                text-sm
                                font-semibold
                            "
                        >
                            ₹
                        </span>
                    )}
                </div>


                <h3
                    className="
                        text-sm
                        font-semibold
                        text-[#211812]
                    "
                >
                    {title}
                </h3>

            </div>


            {children}

        </div>
    );
}


/* =========================================================
   FILTER OPTION
========================================================= */

function FilterOption({
    label,
    selected,
    onClick,
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                group
                flex
                w-full
                items-center
                justify-between
                rounded-xl
                px-3.5
                py-3
                text-left
                transition-all
                duration-200

                ${
                    selected
                        ? `
                            border
                            border-[#dcbda5]
                            bg-[#fbf5ef]
                            text-[#8f5f3f]
                        `
                        : `
                            border
                            border-transparent
                            text-[#5f5148]
                            hover:border-[#eee1d6]
                            hover:bg-[#fcfaf8]
                        `
                }
            `}
        >

            <span
                className="
                    text-sm
                    font-medium
                "
            >
                {label}
            </span>


            {/* CHECKBOX */}

            <span
                className={`
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-md
                    border
                    transition-all

                    ${
                        selected
                            ? `
                                border-[#9a6845]
                                bg-[#9a6845]
                                text-white
                            `
                            : `
                                border-[#d9cec4]
                                bg-white
                                text-transparent
                                group-hover:border-[#b58a69]
                            `
                    }
                `}
            >

                {selected && (
                    <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                    >
                        <path
                            d="M5 12l4 4L19 6"
                        />
                    </svg>
                )}

            </span>

        </button>
    );
}