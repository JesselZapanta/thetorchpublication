import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import UserProfile from '@/Components/UserProfile';
import Footer from '@/Components/Footer';

export default function StudentAuthenticatedLayout({
    user,
    header,
    children,
    StudentBadgeCount,
}) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
            <nav className="dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href={route("home")}>
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 lg:-my-px lg:ms-10 lg:flex">
                                <NavLink
                                    href={route("student.dashboard")}
                                    active={route().current(
                                        "student.dashboard"
                                    )}
                                >
                                    Dashboard
                                </NavLink>

                                <NavLink
                                    href={route("student-article.index")}
                                    active={route().current(
                                        "student-article.index"
                                    )}
                                >
                                    Articles
                                    {StudentBadgeCount.rejectedArticleCount >
                                        0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {StudentBadgeCount.rejectedArticleCount >
                                                9
                                                    ? "9+"
                                                    : StudentBadgeCount.rejectedArticleCount}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                    href={route("student-freedomwall.index")}
                                    active={route().current(
                                        "student-freedomwall.index"
                                    )}
                                >
                                    Freedom Wall
                                </NavLink>
                                <NavLink
                                    href={route(
                                        "student-archive-article.index"
                                    )}
                                    active={route().current(
                                        "student-archive-article.index"
                                    )}
                                >
                                    Archive
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden lg:flex lg:items-center lg:ms-6">
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
                                            href={route(
                                                "student-contributor.create"
                                            )}
                                            className="flex items-center"
                                        >
                                            Application
                                            {StudentBadgeCount.rejectedApplication >
                                                0 && (
                                                <>
                                                    <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                        {
                                                            StudentBadgeCount.rejectedApplication
                                                        }
                                                    </span>
                                                </>
                                            )}
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
                        <ResponsiveNavLink
                            href={route("student.dashboard")}
                            active={route().current("student.dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("student-article.index")}
                            active={route().current("student-article.index")}
                        >
                            Articles
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("student-freedomwall.index")}
                            active={route().current(
                                "student-freedomwall.index"
                            )}
                        >
                            Freedom Wall
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("student-archive-article.index")}
                            active={route().current(
                                "student-archive-article.index"
                            )}
                        >
                            Archive
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
                            <ResponsiveNavLink
                                href={route("student-contributor.create")}
                            >
                                Application
                                {StudentBadgeCount.rejectedApplication > 0 && (
                                    <>
                                        <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                            {
                                                StudentBadgeCount.rejectedApplication
                                            }
                                        </span>
                                    </>
                                )}
                            </ResponsiveNavLink>
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
                <header className="bg-gray-100 dark:bg-gray-800 shadow">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
            {/* <Footer /> */}
        </div>
    );
}
