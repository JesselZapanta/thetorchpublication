import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import UserProfile from '@/Components/UserProfile';

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                {user ? (
                                    <>
                                        {user.role === "admin" && (
                                            <NavLink
                                                href={route("admin.dashboard")}
                                                active={route().current(
                                                    "admin.dashboard"
                                                )}
                                            >
                                                Dashboard
                                            </NavLink>
                                        )}
                                        {user.role === "student" && (
                                            <NavLink
                                                href={route(
                                                    "student.dashboard"
                                                )}
                                                active={route().current(
                                                    "student.dashboard"
                                                )}
                                            >
                                                Dashboard
                                            </NavLink>
                                        )}

                                        {/* {user.role === "writer" && (
                                            <NavLink
                                                href={route("writer.dashboard")}
                                                active={route().current(
                                                    "writer.dashboard"
                                                )}
                                            >
                                                Writer Dashboard
                                            </NavLink>
                                        )}
                                        {user.role === "editor" && (
                                            <NavLink
                                                href={route("editor.dashboard")}
                                                active={route().current(
                                                    "editor.dashboard"
                                                )}
                                            >
                                                Editor Dashboard
                                            </NavLink>
                                        )}
                                        {user.role === "designer" && (
                                            <NavLink
                                                href={route(
                                                    "designer.dashboard"
                                                )}
                                                active={route().current(
                                                    "designer.dashboard"
                                                )}
                                            >
                                                Designer Dashboard
                                            </NavLink>
                                        )} */}
                                    </>
                                ) : null}

                                <NavLink
                                    href={route("user.index")}
                                    active={route().current("user.index")}
                                >
                                    Users
                                </NavLink>
                                <NavLink
                                    href={route("category.index")}
                                    active={route().current("category.index")}
                                >
                                    Categories
                                </NavLink>
                                <NavLink
                                    href={route("article.index")}
                                    active={route().current("article.index")}
                                >
                                    Articles
                                </NavLink>
                                <NavLink
                                    href={route("word.index")}
                                    active={route().current("word.index")}
                                >
                                    Words
                                </NavLink>
                                <NavLink
                                    href={route("task.index")}
                                    active={route().current("task.index")}
                                >
                                    Tasks
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            <div className="ms-3 relative">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <UserProfile
                                            profile_image_path={
                                                user.profile_image_path
                                            }
                                        />
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Profile
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                        >
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
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
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
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
                                        {user.role === "editor" && (
                                            <ResponsiveNavLink
                                                href={route("editor.dashboard")}
                                                active={route().current(
                                                    "editor.dashboard"
                                                )}
                                            >
                                                Editor Dashboard
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
                            href={route("user.index")}
                            active={route().current("user.index")}
                        >
                            User
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("category.index")}
                            active={route().current("category.index")}
                        >
                            Category
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("article.index")}
                            active={route().current("article.index")}
                        >
                            Article
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("word.index")}
                            active={route().current("word.index")}
                        >
                            Word
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("task.index")}
                            active={route().current("task.index")}
                        >
                            Task
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-600">
                        <div className="px-4">
                            <div className="font-medium text-base text-gray-800 dark:text-gray-200">
                                {user.name}
                            </div>
                            <div className="font-medium text-sm text-gray-500">
                                {user.email}
                            </div>
                        </div>

                        <div className="mt-3 space-y-1">
                            <ResponsiveNavLink href={route("profile.edit")}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                href={route("logout")}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
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

            <main>{children}</main>
        </div>
    );
}
