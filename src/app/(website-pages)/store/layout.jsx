export const metadata = {
    title: {
        default: "Shop Furniture | Nestro",
        template: "%s | Nestro",
    },

    description:
        "Shop thoughtfully crafted furniture for modern living. Explore sofas, chairs, tables, storage, lighting and more at Nestro.",

    keywords: [
        "furniture",
        "modern furniture",
        "home furniture",
        "sofas",
        "chairs",
        "tables",
        "home decor",
        "Nestro furniture",
    ],

    alternates: {
        canonical: "/store",
    },

    openGraph: {
        title: "Shop Furniture | Nestro",
        description:
            "Explore thoughtfully crafted furniture designed for modern living.",
        url: "/store",
        siteName: "Nestro",
        type: "website",
    },
};

export default function StoreLayout({ children }) {
    return (
        <main className="min-h-screen bg-[#f8f6f2]">
            {children}
        </main>
    );
}