import Image from "next/image";
import Link from "next/link";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function getStoreHero() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/store-page-hero`,
            {
                next: {
                    revalidate: 60,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch Store Hero");
        }

        const result = await response.json();

        const heroes = Array.isArray(result?.data)
            ? result.data
            : result?.data
                ? [result.data]
                : [];

        const activeHeroes = heroes
            .filter((hero) => hero?.status === true)
            .sort(
                (a, b) =>
                    (a?.sortOrder || 0) - (b?.sortOrder || 0)
            );

        return activeHeroes[0] || null;
    } catch (error) {
        console.error("Store Hero API Error:", error);
        return null;
    }
}

export default async function StoreHero() {
    const hero = await getStoreHero();

    /*
    |--------------------------------------------------------------------------
    | FALLBACK
    |--------------------------------------------------------------------------
    */

    if (!hero) {
        return (
            <section className="px-3 py-5 sm:px-5 sm:py-6 lg:px-7">
                <div className="mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-[#3b2921] sm:rounded-[24px]">
                    <div className="px-5 py-10 text-center sm:px-8 sm:py-12">
                        
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#c9a990] sm:text-xs">
                            Nestro Furniture
                        </p>

                        <h1 className="mt-3 text-3xl font-medium tracking-tight text-white sm:text-4xl lg:text-5xl">
                            Where Comfort Meets{" "}
                            <span className="italic text-[#d8b89d]">
                                Craft
                            </span>
                        </h1>

                        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#e7d8ce] sm:text-base">
                            Discover thoughtfully crafted furniture designed
                            for modern living.
                        </p>

                        <div className="mt-5">
                            <Link
                                href="/store"
                                className="inline-flex h-10 items-center rounded-full bg-white px-5 text-xs font-semibold text-[#3b2921] transition hover:bg-[#f3e9e2] sm:h-11 sm:px-6 sm:text-sm"
                            >
                                Explore Collection
                                <span className="ml-2">
                                    →
                                </span>
                            </Link>
                        </div>

                    </div>
                </div>
            </section>
        );
    }

    const {
        eyebrow,
        title,
        highlightedTitle,
        description,
        primaryButtonText,
        primaryButtonLink,
        secondaryButtonText,
        secondaryButtonLink,
        image,
        offerText,
        offerPercentage,
    } = hero;

    return (
        <section
            aria-labelledby="store-hero-title"
            className="px-3 py-5 sm:px-5 sm:py-6 lg:px-7"
        >
            <div className="mx-auto max-w-7xl overflow-hidden rounded-[20px] bg-[#3b2921] sm:rounded-[24px]">

                <div className="grid grid-cols-1 lg:min-h-[330px] lg:grid-cols-2">

                    {/* =================================================
                        LEFT CONTENT
                    ================================================= */}

                    <div
                        className="
                            flex
                            flex-col
                            justify-center
                            px-6
                            py-9
                            sm:px-9
                            sm:py-10
                            md:px-10
                            lg:px-11
                            lg:py-10
                            xl:px-14
                        "
                    >

                        {/* Eyebrow */}

                        {eyebrow && (
                            <p
                                className="
                                    text-[10px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#d8b89d]
                                    sm:text-[11px]
                                    lg:text-xs
                                "
                            >
                                {eyebrow}
                            </p>
                        )}


                        {/* Heading */}

                        <h1
                            id="store-hero-title"
                            className="
                                mt-3
                                max-w-xl
                                text-3xl
                                font-medium
                                leading-[1.02]
                                tracking-tight
                                text-white
                                sm:mt-4
                                sm:text-[40px]
                                md:text-[44px]
                                lg:text-[46px]
                                xl:text-[50px]
                            "
                        >
                            {title}

                            {highlightedTitle && (
                                <>
                                    {" "}
                                    <span className="italic text-[#d8b89d]">
                                        {highlightedTitle}
                                    </span>
                                </>
                            )}
                        </h1>


                        {/* Description */}

                        {description && (
                            <p
                                className="
                                    mt-4
                                    max-w-lg
                                    text-xs
                                    leading-5
                                    text-[#d8d0cb]
                                    sm:mt-5
                                    sm:text-sm
                                    sm:leading-6
                                    lg:text-[14px]
                                "
                            >
                                {description}
                            </p>
                        )}


                        {/* Offer */}

                        {offerText && (
                            <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">

                                {offerPercentage > 0 && (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            rounded-full
                                            bg-[#d8b89d]
                                            px-3.5
                                            py-1.5
                                            text-[11px]
                                            font-bold
                                            text-[#3b2921]
                                            sm:px-4
                                            sm:py-2
                                            sm:text-xs
                                        "
                                    >
                                        {offerPercentage}% OFF
                                    </span>
                                )}

                                <span className="text-xs text-white sm:text-sm">
                                    {offerText}
                                </span>

                            </div>
                        )}


                        {/* Buttons */}

                        <div className="mt-5 flex flex-wrap gap-2.5 sm:mt-6 sm:gap-3">

                            {primaryButtonText && primaryButtonLink && (
                                <Link
                                    href={primaryButtonLink}
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-white
                                        px-5
                                        text-xs
                                        font-semibold
                                        text-[#3b2921]
                                        transition
                                        hover:bg-[#f3e9e2]
                                        sm:h-11
                                        sm:px-6
                                        sm:text-sm
                                    "
                                >
                                    {primaryButtonText}

                                    <span className="ml-2 text-sm sm:text-base">
                                        →
                                    </span>
                                </Link>
                            )}

                            {secondaryButtonText && secondaryButtonLink && (
                                <Link
                                    href={secondaryButtonLink}
                                    className="
                                        inline-flex
                                        h-10
                                        items-center
                                        justify-center
                                        rounded-full
                                        border
                                        border-white/30
                                        px-5
                                        text-xs
                                        font-semibold
                                        text-white
                                        transition
                                        hover:border-white
                                        hover:bg-white/10
                                        sm:h-11
                                        sm:px-6
                                        sm:text-sm
                                    "
                                >
                                    {secondaryButtonText}
                                </Link>
                            )}

                        </div>

                    </div>


                    {/* =================================================
                        RIGHT IMAGE
                    ================================================= */}

                    <div
                        className="
                            relative
                            min-h-[240px]
                            sm:min-h-[280px]
                            md:min-h-[300px]
                            lg:min-h-[330px]
                        "
                    >

                        {image ? (
                            <Image
                                src={image}
                                alt={
                                    title
                                        ? `${title} - Nestro furniture collection`
                                        : "Nestro furniture collection"
                                }
                                fill
                                priority
                                sizes="
                                    (max-width: 639px) 100vw,
                                    (max-width: 1023px) 100vw,
                                    50vw
                                "
                                className="object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-[#4a342a]">

                                <div className="relative h-36 w-52 sm:h-40 sm:w-56">

                                    <div
                                        className="
                                            absolute
                                            left-1/2
                                            top-1/2
                                            h-20
                                            w-40
                                            -translate-x-1/2
                                            -translate-y-1/2
                                            rounded-[1.5rem]
                                            bg-[#9b765b]
                                            sm:h-24
                                            sm:w-44
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            left-1/2
                                            top-[38%]
                                            h-12
                                            w-36
                                            -translate-x-1/2
                                            rounded-2xl
                                            bg-[#b18d70]
                                            sm:h-14
                                            sm:w-40
                                        "
                                    />

                                    <div
                                        className="
                                            absolute
                                            bottom-1
                                            left-1/2
                                            h-2.5
                                            w-40
                                            -translate-x-1/2
                                            rounded-full
                                            bg-black/20
                                            blur-md
                                            sm:w-44
                                        "
                                    />

                                </div>

                            </div>
                        )}

                        {/* Image Overlay */}

                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"
                        />

                    </div>

                </div>

            </div>
        </section>
    );
}