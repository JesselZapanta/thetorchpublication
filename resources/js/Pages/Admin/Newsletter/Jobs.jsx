import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Jobs({ jobs, auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lists of Newsletters
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

            {/* <pre className="text-white">
                {JSON.stringify(jobs, null, 2)}
            </pre> */}
            {/* Alerts */}
            {/* {success && <AlertSuccess message={success} />} */}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                            {/* <Pagination
                                links={jobs.meta.links}
                                queryParams={queryParams}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
