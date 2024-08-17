import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, category }) {
    return (
        <AuthenticatedLayout
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
                                    <label className="font-bold text-lg">
                                        Category ID
                                    </label>
                                    <p className="mt-1">{category.id}</p>
                                </div>
                                {/* Name */}
                                <div className="mt-4">
                                    <label className="font-bold text-lg">
                                        Category Name
                                    </label>
                                    <p className="mt-1">{category.name}</p>
                                </div>
                                {/* Status */}
                                <div className="mt-4">
                                    <label className="font-bold text-lg">
                                        Status
                                    </label>
                                    <p className="mt-1">{category.status}</p>
                                </div>
                                {/* Description */}
                                <div className="mt-4">
                                    <label className="font-bold text-lg">
                                        Description
                                    </label>
                                    <p className="mt-1">
                                        {category.description}
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 text-right grid justify-items-end">
                                <div className="flex">
                                    <Link
                                        href={route(
                                            "category.edit",
                                            category.id
                                        )}
                                        className="bg-blue-600 py-1 px-3 text-blue-100 rounded shadow transition-all hover:bg-blue-500 mr-2"
                                    >
                                        Edit Category
                                    </Link>
                                    <Link
                                        href={route("category.index")}
                                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
