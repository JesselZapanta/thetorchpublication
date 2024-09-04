import Pagination from "@/Components/Pagination";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Jobs({ jobs, auth, queryParams }) {

    function extractEmail(payload) {
        // Regular expression to match email addresses
        const emailPattern = /[\w\.-]+@[\w\.-]+\.\w+/g;
        const match = payload.match(emailPattern);
        return match ? match[0] : "No email found";
    }

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Newsletters Queue
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route("newsletter.index")}
                            className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Newsletter
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Newsletters" />
            {/* <pre className="text-white">{JSON.stringify(jobs, null, 2)}</pre> */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-3 py-3">Id</th>
                                            {/* <th className="px-3 py-3">queue</th> */}
                                            <th className="px-3 py-3">Email</th>
                                            <th className="px-3 py-3">
                                                Available At
                                            </th>
                                            <th className="px-3 py-3">
                                                Created At
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.data.length > 0 ? (
                                            jobs.data.map((job) => (
                                                <tr
                                                    //added
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={job.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {job.id}
                                                    </td>
                                                    {/* <td className="px-3 py-2 text-nowrap">
                                                        {job.queue}
                                                    </td> */}
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {extractEmail(
                                                            job.payload
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {job.available_at}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {job.created_at}
                                                    </td>
                                                </tr>
                                            ))
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
                            <Pagination
                                links={jobs.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
