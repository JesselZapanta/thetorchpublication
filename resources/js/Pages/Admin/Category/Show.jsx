import SecondaryButton from "@/Components/SecondaryButton";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, category, AdminBadgeCount }) {
    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {`Category "${category.name}"`}
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
            <Head title={`Category ${category.name}`} />
            <div className="py-12">
                <div className="max-w-lg mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div>
                            <img
                                src={category.category_image_path}
                                alt={category.name}
                                className="w-full h-96 object-cover"
                            />
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div>
                                {/* ID */}
                                <div>
                                    <label className="font-bold text-base">
                                        Category ID
                                    </label>
                                    <p className="mt-1">{category.id}</p>
                                </div>
                                {/* Name */}
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Category Name
                                    </label>
                                    <p className="mt-1">{category.name}</p>
                                </div>
                                {/* Status */}
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Status
                                    </label>
                                    <p className="mt-1">{category.status}</p>
                                </div>
                                {/* Description */}
                                <div className="mt-4">
                                    <label className="font-bold text-base">
                                        Description
                                    </label>
                                    <p className="mt-1">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <Link
                                    href={route("category.edit", category.id)}
                                    className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Edit Category
                                </Link>
                                <SecondaryButton href={route("category.index")}>
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
