import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import SelectInput from "@/Components/SelectInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({ auth, reportedFreedomWall }) {
    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    const [selectedValue, setSelectedValue] = useState("freedomWall"); // Default selected value

    const handleSelectChange = (e) => {
        const value = e.target.value;
        setSelectedValue(value);

        if (value === "article") {
            router.get(route("admin-review-report-article.index"));
        } else if (value === "comment") {
            router.get(route("admin-review-report-comment.index"));
        } else if (value === "freedomWall") {
            router.get(route("admin-review-report-freedom-wall.index"));
        }
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Reported Freedom Wall
                    </h2>
                    <div className="flex gap-4">
                        <SelectInput
                            className="w-full"
                            value={selectedValue}
                            onChange={handleSelectChange}
                        >
                            <option value="article">Reported Article</option>
                            <option value="comment">Reported Comment</option>
                            <option value="freedomWall">
                                Reported Freedom Wall
                            </option>
                        </SelectInput>
                    </div>
                </div>
            }
        >
            <Head title="Reported Freedom Wall" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <tbody>
                                        {reportedFreedomWall.data.length > 0 ? (
                                            reportedFreedomWall.data.map(
                                                (entry) => (
                                                    <tr
                                                        //added
                                                        className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                        key={entry.id}
                                                    >
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {entry.id}
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <Link
                                                                // added
                                                                className="text-md text-gray-900 dark:text-gray-300"
                                                                // href={route(
                                                                //     "admin-entry.show",
                                                                //     entry.id
                                                                // )}
                                                            >
                                                                {truncate(
                                                                    entry.body,
                                                                    50
                                                                )}
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {entry.report_count}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            <Link
                                                                // href={route(
                                                                //     "admin-entry.edit",
                                                                //     entry.id
                                                                // )}
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                            >
                                                                Hide
                                                            </Link>
                                                            {/* <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        entry
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                            >
                                                                Delete
                                                            </button> */}
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="px-3 py-2 text-center"
                                                >
                                                    No data available
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
