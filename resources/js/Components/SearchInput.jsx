import { forwardRef, useEffect, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/16/solid";
import { router } from "@inertiajs/react";

export default forwardRef(function SearchInput(
    {
        type = "text",
        className = "",
        isFocused = false,
        queryParams = {},
        route,
        onKeyPressed,
        ...props
    },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, [isFocused]);

    const handleSearch = () => {
        if (route && queryParams) {
            router.get(route, queryParams, {
                preserveState: true,
            });
        }
    };

    return (
        <div className="relative">
            <input
                {...props}
                type={type}
                className={
                    "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm " +
                    className
                }
                ref={input}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        handleSearch();
                    }
                }}
            />
            <button
                type="button"
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
                <MagnifyingGlassIcon className="w-6 text-indigo-600" />
            </button>
        </div>
    );
});
