import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Jobs({ jobs, auth }) {
    return (
        <AuthenticatedLayout
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
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-3 py-3">Id</th>
                                            <th className="px-3 py-3">queue</th>
                                            <th className="px-3 py-3">
                                                payload
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {jobs.length > 0 ? (
                                            jobs.map((job) => (
                                                <tr
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={job.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {job.id}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {job.queue}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {job.payload}
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
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
