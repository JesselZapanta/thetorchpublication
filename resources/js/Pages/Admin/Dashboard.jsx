import SelectInput from '@/Components/SelectInput';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({
    auth,
    articles,
    comments,
    views,
    freedomWall,
    tasks,
    reportedContent,
    timePeriod,
    badgeCount,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState(timePeriod);

    const handleSelectReport = (e) => {
        const value = e.target.value;
        setSelectedPeriod(value);

        // Trigger Inertia request with the selected period as a query parameter
        router.get(
            route("admin.dashboard"),
            { period: value },
            { preserveState: true }
        );
    };

    return (
        <AdminAuthenticatedLayout
            badgeCount={badgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Admin Dashboard
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route("user.create")}
                            className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Generate Report
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
                                <SelectInput
                                    className="w-full"
                                    value={selectedPeriod}
                                    onChange={handleSelectReport}
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Weekly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="ay">AY</option>
                                </SelectInput>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-amber-600 font-semibold text-2xl">
                                            Published Article
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">
                                                {articles}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-lime-600 font-semibold text-2xl">
                                            Comments
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">
                                                {comments}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-blue-100">
                                        <h3 className="text-sky-600 font-semibold text-2xl">
                                            Freedom Wall
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">
                                                {freedomWall}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-blue-100">
                                        <h3 className="text-emerald-500 font-semibold text-2xl">
                                            Completed Task
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">
                                                {tasks}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg my-4">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <h3 className="text-indigo-500 font-semibold text-xl">
                                Engagement Report
                            </h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-2 mt-2">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-sky-600 font-semibold text-2xl">
                                            Total Views
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">
                                                {views}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-blue-100">
                                        <h3 className="text-rose-500 font-semibold text-2xl">
                                            Reported Count
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">
                                                {reportedContent}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-blue-100">
                                        <h3 className="text-blue-600 font-semibold text-2xl">
                                            Commente
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">{freedomWall}</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-blue-100">
                                        <h3 className="text-fuchsia-500 font-semibold text-2xl">
                                            Newsletter
                                        </h3>
                                        <p className="text-xl mt-4">
                                            <span className="mr-2">{tasks}</span>
                                        </p>
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
