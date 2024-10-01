import ApplicationLogo from "@/Components/ApplicationLogo";
import Footer from "@/Components/Footer";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link } from "@inertiajs/react";
import { useState } from "react";

export default function UnauthenticatedLayout({
    user,
    children,
    categories,
    header,
}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 z-20 w-full fixed">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current  dark:text-gray-200" />
                                </Link>
                            </div>
                            <div className="hidden space-x-8 lg:-my-px lg:ms-10 lg:flex">
                                <NavLink
                                    href={route("home")}
                                    active={route().current("home")}
                                >
                                    Home
                                </NavLink>
                                {categories.data.map((category) => (
                                    <NavLink
                                        className="capitalize"
                                        href={route(
                                            "articles.byCategory",
                                            category.id
                                        )}
                                        key={category.id}
                                        active={route().current(
                                            "articles.byCategory",
                                            category.id
                                        )}
                                    >
                                        {category.name.toLowerCase()}
                                    </NavLink>
                                ))}
                                <NavLink
                                    href={route("freedom-wall.index")}
                                    active={route().current(
                                        "freedom-wall.index"
                                    )}
                                    className="text-nowrap"
                                >
                                    Freedom Wall
                                </NavLink>
                            </div>
                        </div>
                        <div className="hidden lg:flex lg:ms-6">
                            <nav className="-mx-3 flex flex-1 justify-end">
                                {user ? (
                                    user.role === "admin" ? (
                                        <NavLink
                                            href={route("admin.dashboard")}
                                        >
                                            Dashboard
                                        </NavLink>
                                    ) : user.role === "student" ? (
                                        <NavLink
                                            href={route("student.dashboard")}
                                        >
                                            Dashboard
                                        </NavLink>
                                    ) : user.role === "student_contributor" ? (
                                        <NavLink
                                            href={route("student.dashboard")}
                                        >
                                            Dashboard
                                        </NavLink>
                                    ) : user.role === "editor" ? (
                                        <NavLink
                                            href={route("editor.dashboard")}
                                        >
                                            Dashboard
                                        </NavLink>
                                    ) : user.role === "writer" ? (
                                        <NavLink
                                            href={route("writer.dashboard")}
                                        >
                                            Dashboard
                                        </NavLink>
                                    ) : user.role === "designer" ? (
                                        <NavLink
                                            href={route("designer.dashboard")}
                                        >
                                            Dashboard
                                        </NavLink>
                                    ) : null
                                ) : (
                                    <>
                                        <NavLink href={route("login")}>
                                            Log in
                                        </NavLink>
                                    </>
                                )}
                            </nav>
                        </div>

                        <div className="-me-2 flex items-center lg:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-900 focus:text-gray-500 dark:focus:text-gray-400 transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " lg:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        {!user && (
                            <>
                                <ResponsiveNavLink href={route("login")}>
                                    Log in
                                </ResponsiveNavLink>
                                <ResponsiveNavLink href={route("register")}>
                                    Register
                                </ResponsiveNavLink>
                            </>
                        )}
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        {user ? (
                            <>
                                {user.role === "admin" && (
                                    <ResponsiveNavLink
                                        href={route("admin.dashboard")}
                                        active={route().current(
                                            "admin.dashboard"
                                        )}
                                    >
                                        Dashboard
                                    </ResponsiveNavLink>
                                )}
                                {user.role === "student" && (
                                    <ResponsiveNavLink
                                        href={route("student.dashboard")}
                                        active={route().current(
                                            "student.dashboard"
                                        )}
                                    >
                                        Dashboard
                                    </ResponsiveNavLink>
                                )}

                                {user.role === "editor" && (
                                    <ResponsiveNavLink
                                        href={route("editor.dashboard")}
                                        active={route().current(
                                            "editor.dashboard"
                                        )}
                                    >
                                        Dashboard
                                    </ResponsiveNavLink>
                                )}

                                {/* {user.role === "writer" && (
                                            <ResponsiveNavLink
                                                href={route("writer.dashboard")}
                                                active={route().current(
                                                    "writer.dashboard"
                                                )}
                                            >
                                                Writer Dashboard
                                            </ResponsiveNavLink>
                                        )}
                                        
                                        {user.role === "designer" && (
                                            <ResponsiveNavLink
                                                href={route(
                                                    "designer.dashboard"
                                                )}
                                                active={route().current(
                                                    "designer.dashboard"
                                                )}
                                            >
                                                Designer Dashboard
                                            </ResponsiveNavLink>
                                        )} */}
                            </>
                        ) : null}

                        <ResponsiveNavLink
                            href={route("home")}
                            active={route().current("home")}
                        >
                            Home
                        </ResponsiveNavLink>
                        {categories.data.map((category) => (
                            <ResponsiveNavLink
                                className="capitalize"
                                href={route("articles.byCategory", category.id)}
                                key={category.id}
                                active={route().current(
                                    "articles.byCategory",
                                    category.id
                                )}
                            >
                                {category.name.toLowerCase()}
                            </ResponsiveNavLink>
                        ))}
                        <ResponsiveNavLink
                            href={route("freedom-wall.index")}
                            active={route().current("freedom-wall.index")}
                            className="text-nowrap"
                        >
                            Freedom Wall
                        </ResponsiveNavLink>
                        <ResponsiveNavLink href={route("login")}>
                            Log In
                        </ResponsiveNavLink>
                    </div>
                </div>
            </nav>
            {header && (
                <header className="bg-white dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            {/* Main Content */}
            <main>{children}</main>
            <Footer />
        </div>
    );
}
