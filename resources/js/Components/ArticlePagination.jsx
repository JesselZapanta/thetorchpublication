import { router } from "@inertiajs/react";
import React from "react";

export default function ArticlePagination({ links, queryParams }) {
    const handlePageChange = (url) => {
        // Extract the page number from the URL
        const page = new URLSearchParams(url.split("?")[1]).get("page");

        // Add the page parameter to the existing queryParams
        const newQueryParams = { ...queryParams, page };

        // Navigate with the updated queryParams and preserve the scroll position
        router.get(url.split("?")[0], newQueryParams, {
            // preserveScroll: true,
            preserveState: true, // Add this to preserve the state between requests
        });
    };

    return (
        <nav className="text-center mt-4">
            {links.map((link) => (
                <button
                    onClick={() => handlePageChange(link.url)}
                    key={link.label}
                    disabled={!link.url}
                    className={
                        "inline-block py-3 px-5 rounded-lg text-gray-200 text-xs " +
                        (link.active ? "bg-gray-950 " : " ") +
                        (!link.url
                            ? "!text-gray-500 cursor-not-allowed "
                            : "hover:bg-gray-950")
                    }
                    dangerouslySetInnerHTML={{ __html: link.label }}
                ></button>
            ))}
        </nav>
    );
}
