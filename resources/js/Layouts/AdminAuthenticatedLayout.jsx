import { useState } from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link } from '@inertiajs/react';
import UserProfile from '@/Components/UserProfile';
import Footer from '@/Components/Footer';

export default function Authenticated({ user, header, children, AdminBadgeCount }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900">
            <nav className="dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>
                            </div>

                            {/* <div>
                                totol edited:{" "}
                                {AdminBadgeCount.totalArticleReportCount}
                            </div> */}

                            <div className="hidden space-x-8 lg:-my-px lg:ms-10 lg:flex">
                                <NavLink
                                    href={route("admin.dashboard")}
                                    active={route().current("admin.dashboard")}
                                >
                                    Dashboard
                                </NavLink>
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
                                    href={route("admin-article.index")}
                                    active={route().current(
                                        "admin-article.index"
                                    )}
                                >
                                    Articles{" "}
                                    {AdminBadgeCount.editedCount > 0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.editedCount > 9
                                                    ? "9+"
                                                    : AdminBadgeCount.editedCount}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                    href={route("word.index")}
                                    active={route().current("word.index")}
                                >
                                    Words
                                </NavLink>
                                <NavLink
                                    href={route("academic-year.index")}
                                    active={route().current(
                                        "academic-year.index"
                                    )}
                                >
                                    Academic Years
                                </NavLink>
                                <NavLink
                                    href={route("newsletter.index")}
                                    active={route().current("newsletter.index")}
                                >
                                    Newsletters
                                    {AdminBadgeCount.newsletterPendingCount >
                                        0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.newsletterPendingCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.newsletterPendingCount}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                    href={route("admin-task.index")}
                                    active={route().current("admin-task.index")}
                                >
                                    Tasks
                                    {AdminBadgeCount.totalTaskCount > 0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalTaskCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalTaskCount}
                                            </span>
                                        </>
                                    )}
                                </NavLink>
                                <NavLink
                                    href={route(
                                        "admin-review-report-article.index"
                                    )}
                                    active={route().current(
                                        "admin-review-report-article.index"
                                    )}
                                >
                                    Review
                                    {AdminBadgeCount.totalReportCount > 0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalReportCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalReportCount}
                                            </span>
                                        </>
                                    )}
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
                            href={route("admin.dashboard")}
                            active={route().current("admin.dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
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
                            href={route("admin-article.index")}
                            active={route().current("admin-article.index")}
                        >
                            Article
                            {AdminBadgeCount.editedCount > 0 && (
                                <>
                                    <span className="flex justify-center items-center min-w-5 h-5 rounded-full p-1 bg-red-500 text-gray-100">
                                        {AdminBadgeCount.editedCount > 9
                                            ? "9+"
                                            : AdminBadgeCount.editedCount}
                                    </span>
                                </>
                            )}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("word.index")}
                            active={route().current("word.index")}
                        >
                            Word
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("academic-year.index")}
                            active={route().current("academic-year.index")}
                        >
                            Academic Years
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("newsletter.index")}
                            active={route().current("newsletter.index")}
                        >
                            Newsletters
                            {AdminBadgeCount.newsletterPendingCount > 0 && (
                                <>
                                    <span className="flex justify-center items-center min-w-5 h-5 rounded-full p-1 bg-red-500 text-gray-100">
                                        {AdminBadgeCount.newsletterPendingCount >
                                        9
                                            ? "9+"
                                            : AdminBadgeCount.newsletterPendingCount}
                                    </span>
                                </>
                            )}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("admin-task.index")}
                            active={route().current("admin-task.index")}
                        >
                            Task
                            {AdminBadgeCount.totalTaskCount > 0 && (
                                <>
                                    <span className="flex justify-center items-center min-w-5 h-5 rounded-full p-1 bg-red-500 text-gray-100">
                                        {AdminBadgeCount.totalTaskCount > 9
                                            ? "9+"
                                            : AdminBadgeCount.totalTaskCount}
                                    </span>
                                </>
                            )}
                        </ResponsiveNavLink>
                        <ResponsiveNavLink
                            href={route("admin-review-report-article.index")}
                            active={route().current(
                                "admin-review-report-article.index"
                            )}
                        >
                            Review
                            {AdminBadgeCount.totalReportCount > 0 && (
                                <>
                                    <span className="flex justify-center items-center min-w-5 h-5 rounded-full p-1 bg-red-500 text-gray-100">
                                        {AdminBadgeCount.totalReportCount > 9
                                            ? "9+"
                                            : AdminBadgeCount.totalReportCount}
                                    </span>
                                </>
                            )}
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
