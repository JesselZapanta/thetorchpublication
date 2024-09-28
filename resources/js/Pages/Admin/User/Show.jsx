import SecondaryButton from "@/Components/SecondaryButton";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, user, AdminBadgeCount, contributions }) {
    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {`User "${user.name}"`}
                    </h2>
                    {/* <div className="flex gap-4">
                        <Link
                            href={route("user.create")}
                            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                        >
                            Create New
                        </Link>
                    </div> */}
                </div>
            }
        >
            <Head title={`User ${user.name}`} />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3">
                            <div>
                                <img
                                    src={user.profile_image_path}
                                    alt={user.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="p-6 text-gray-900 dark:text-gray-100">
                                <div>
                                    <h4 className="font-bold text-base">
                                        Student ID
                                    </h4>
                                    <p className="mt-1">{user.student_id}</p>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-base">
                                        Full Name
                                    </h4>
                                    <p className="mt-1">{user.name}</p>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-base">
                                        Email
                                    </h4>
                                    <p className="mt-1">{user.email}</p>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-base">
                                        Role
                                    </h4>
                                    <p className="mt-1">{user.role}</p>
                                </div>
                                <div className="mt-4">
                                    <h4 className="font-bold text-base">
                                        Position
                                    </h4>
                                    <p className="mt-1">{user.position}</p>
                                </div>
                            </div>
                            <div className="p-6 lg:col-span-1 md:col-span-2 text-gray-900 dark:text-gray-100 flex flex-col justify-between">
                                <div>
                                    <div>
                                        <h4 className="font-bold text-base">
                                            Published Articles
                                        </h4>
                                        <p className="mt-1">
                                            {contributions.articleCount}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-base">
                                            Total Comments
                                        </h4>
                                        <p className="mt-1">
                                            {contributions.commentsCount}
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-base">
                                            Total Freedom Wall Entries
                                        </h4>
                                        <p className="mt-1">
                                            {
                                                contributions.freedmWallEntriesCount
                                            }
                                        </p>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-bold text-base">
                                            Total Completed Task
                                        </h4>
                                        <p className="mt-1">
                                            {contributions.taskCount}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={route("user.edit", user.id)}
                                        className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                                    >
                                        Edit User
                                    </Link>
                                    <SecondaryButton href={route("user.index")}>
                                        Back
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
