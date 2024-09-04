import SecondaryButton from "@/Components/SecondaryButton";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, user }) {
    return (
        <AdminAuthenticatedLayout
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
                <div className="max-w-lg mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div>
                            <img
                                src={user.profile_image_path}
                                alt={user.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div>
                                <div>
                                    <label className="font-bold text-base">
                                        Student ID
                                    </label>
                                    <p className="mt-1">{user.student_id}</p>
                                </div>
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Full Name
                                    </label>
                                    <p className="mt-1">{user.name}</p>
                                </div>
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Email
                                    </label>
                                    <p className="mt-1">{user.email}</p>
                                </div>
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Role
                                    </label>
                                    <p className="mt-1">{user.role}</p>
                                </div>
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Position
                                    </label>
                                    <p className="mt-1">{user.position}</p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
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
        </AdminAuthenticatedLayout>
    );
}
