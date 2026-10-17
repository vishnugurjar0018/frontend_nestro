import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
    if (!product) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | PRODUCT DATA
    |--------------------------------------------------------------------------
    */

    const name =
        product?.name ||
        product?.productName ||
        product?.title ||
        "Untitled Product";

    const slug =
        product?.slug ||
        product?._id;

    const price =
        Number(
            product?.price ??
            product?.sellingPrice ??
            product?.salePrice ??
            0
        );

    const discount =
        Number(product?.discount ?? 0);

    const thumbnail =
        product?.thumbnail ||
        product?.image ||
        product?.imageUrl ||
        product?.images?.[0] ||
        null;

    const shortDescription =
        product?.shortDescription ||
        product?.description ||
        "";

    const featured =
        Boolean(product?.featured);

    const newArrival =
        Boolean(product?.newArrival);

    const categoryID =
        product?.categoryID;

    /*
    |--------------------------------------------------------------------------
    | PRODUCT URL
    |--------------------------------------------------------------------------
    */

    const productUrl = slug
        ? `/product/${slug}`
        : "#";

    /*
    |--------------------------------------------------------------------------
    | CATEGORY
    |--------------------------------------------------------------------------
    */

    const categoryName =
        typeof categoryID === "object"
            ? (
                categoryID?.name ||
                categoryID?.title ||
                ""
            )
            : "";

    /*
    |--------------------------------------------------------------------------
    | FINAL PRICE
    |--------------------------------------------------------------------------
    */

    const finalPrice =
        discount > 0
            ? price - (price * discount) / 100
            : price;

    /*
    |--------------------------------------------------------------------------
    | FORMAT PRICE
    |--------------------------------------------------------------------------
    */

    const formatPrice = (value) => {
        const numericValue =
            Number(value);

        if (
            !Number.isFinite(
                numericValue
            )
        ) {
            return "₹0";
        }

        return new Intl.NumberFormat(
            "en-IN",
            {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 0,
            }
        ).format(numericValue);
    };

    /*
    |--------------------------------------------------------------------------
    | CART PRODUCT
    |--------------------------------------------------------------------------
    */

    const cartProduct = {
        _id: product?._id,
        name,
        price: finalPrice,
        originalPrice: price,
        discount,
        thumbnail,
        slug: product?.slug || "",
    };

    return (
        <article
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-[#e7ddd4]
                bg-white
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
            "
        >

            {/* =====================================================
                PRODUCT IMAGE
            ===================================================== */}

            <Link
                href={productUrl}
                aria-label={`View ${name}`}
                className="block"
            >
                <div
                    className="
                        relative
                        aspect-square
                        overflow-hidden
                        bg-[#f1ebe4]
                    "
                >

                    {/* BADGES */}

                    <div
                        className="
                            absolute
                            left-3
                            top-3
                            z-10
                            flex
                            flex-wrap
                            gap-2
                        "
                    >

                        {discount > 0 && (
                            <span
                                className="
                                    rounded-md
                                    bg-[#8f5f3f]
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-white
                                "
                            >
                                -{discount}%
                            </span>
                        )}

                        {newArrival && (
                            <span
                                className="
                                    rounded-md
                                    bg-[#30241e]
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-white
                                "
                            >
                                New
                            </span>
                        )}

                        {featured && !newArrival && (
                            <span
                                className="
                                    rounded-md
                                    bg-[#30241e]
                                    px-2.5
                                    py-1
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-white
                                "
                            >
                                Featured
                            </span>
                        )}

                    </div>


                    {/* IMAGE */}

                    {thumbnail ? (
                        <Image
                            src={thumbnail}
                            alt={`${name} - Nestro Furniture`}
                            fill
                            sizes="
                                (max-width: 639px) 100vw,
                                (max-width: 1023px) 50vw,
                                33vw
                            "
                            className="
                                object-cover
                                transition
                                duration-500
                                group-hover:scale-105
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
                            "
                        >
                            <span
                                className="
                                    text-sm
                                    text-[#9a8a7e]
                                "
                            >
                                Image unavailable
                            </span>
                        </div>
                    )}

                </div>
            </Link>


            {/* =====================================================
                PRODUCT INFORMATION
            ===================================================== */}

            <div className="p-4 sm:p-5">

                {/* CATEGORY */}

                {categoryName && (
                    <p
                        className="
                            text-[10px]
                            font-medium
                            uppercase
                            tracking-[0.18em]
                            text-[#9a6845]
                        "
                    >
                        {categoryName}
                    </p>
                )}


                {/* PRODUCT NAME */}

                <h3
                    className="
                        mt-1.5
                        line-clamp-2
                        text-sm
                        font-medium
                        leading-5
                        text-[#2f241e]
                        sm:text-[15px]
                    "
                >
                    <Link
                        href={productUrl}
                        className="
                            transition-colors
                            hover:text-[#9a6845]
                        "
                    >
                        {name}
                    </Link>
                </h3>


                {/* DESCRIPTION */}

                {shortDescription && (
                    <p
                        className="
                            mt-1.5
                            line-clamp-2
                            text-xs
                            leading-5
                            text-[#8a7b70]
                        "
                    >
                        {shortDescription}
                    </p>
                )}


                {/* PRICE */}

                <div
                    className="
                        mt-3
                        flex
                        items-end
                        gap-2
                    "
                >

                    <span
                        className="
                            text-base
                            font-semibold
                            text-[#2f241e]
                        "
                    >
                        {formatPrice(finalPrice)}
                    </span>

                    {discount > 0 && (
                        <span
                            className="
                                text-xs
                                text-[#a3958b]
                                line-through
                            "
                        >
                            {formatPrice(price)}
                        </span>
                    )}

                </div>


                {/* ADD TO CART */}

                <div className="mt-4">
                    <AddToCartButton
                        product={cartProduct}
                    />
                </div>

            </div>

        </article>
    );
}