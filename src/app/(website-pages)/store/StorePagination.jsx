"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function StorePagination({
    currentPage = 1,
    totalPages = 1,
}) {
    const searchParams = useSearchParams();

    if (totalPages <= 1) {
        return null;
    }

    const createPageUrl = (page) => {
        const params = new URLSearchParams(
            searchParams.toString()
        );

        params.set("page", String(page));

        return `/store?${params.toString()}`;
    };

    return (
        <nav
            aria-label="Product pagination"
            className="mt-10 flex items-center justify-center gap-2"
        >

            {/* Previous */}
            {currentPage > 1 ? (
                <Link
                    href={createPageUrl(
                        currentPage - 1
                    )}
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#e8ded5] bg-white px-3 text-sm text-[#5f5148] transition hover:border-[#9a6845] hover:text-[#9a6845]"
                >
                    ←
                </Link>
            ) : (
                <span
                    className="inline-flex h-10 min-w-10 cursor-not-allowed items-center justify-center rounded-xl border border-[#eee5de] bg-[#f7f4f1] px-3 text-sm text-[#c4b8ae]"
                >
                    ←
                </span>
            )}

            {/* Page Numbers */}
            {Array.from(
                { length: totalPages },
                (_, index) => index + 1
            ).map((page) => (
                <Link
                    key={page}
                    href={createPageUrl(page)}
                    aria-current={
                        page === currentPage
                            ? "page"
                            : undefined
                    }
                    className={`inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-medium transition ${
                        page === currentPage
                            ? "border-[#9a6845] bg-[#9a6845] text-white"
                            : "border-[#e8ded5] bg-white text-[#5f5148] hover:border-[#9a6845] hover:text-[#9a6845]"
                    }`}
                >
                    {page}
                </Link>
            ))}

            {/* Next */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageUrl(
                        currentPage + 1
                    )}
                    className="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-[#e8ded5] bg-white px-3 text-sm text-[#5f5148] transition hover:border-[#9a6845] hover:text-[#9a6845]"
                >
                    →
                </Link>
            ) : (
                <span
                    className="inline-flex h-10 min-w-10 cursor-not-allowed items-center justify-center rounded-xl border border-[#eee5de] bg-[#f7f4f1] px-3 text-sm text-[#c4b8ae]"
                >
                    →
                </span>
            )}

        </nav>
    );
}