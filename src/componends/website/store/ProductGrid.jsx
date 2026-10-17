import ProductCard from "./ProductCard";

export default function ProductGrid({
    products = [],
}) {
    if (!products.length) {
        return (
            <div className="rounded-2xl border border-[#e7ddd4] bg-white px-6 py-16 text-center">
                <h2 className="text-lg font-medium text-[#2f241e]">
                    No products found
                </h2>

                <p className="mt-2 text-sm text-[#8a7b70]">
                    Products will appear here once they are available.
                </p>
            </div>
        );
    }

    return (
        <div
            aria-label="Furniture products"
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
        >
            {products.map((product) => (
                <ProductCard
                    key={product._id}
                    product={product}
                />
            ))}
        </div>
    );
}