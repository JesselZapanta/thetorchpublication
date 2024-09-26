import BarChart from '@/Components/Chart/BarChart';
import PieChart from '@/Components/Chart/PieChart';
import SelectInput from '@/Components/SelectInput';
import AdminAuthenticatedLayout from '@/Layouts/AdminAuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Dashboard({
    auth,
    reportData,
    academicYears,
    AdminBadgeCount,

    categoriesWithCount,
    categoriesWithViewsCount,
    dateFrom,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState("daily");
    const [selectedAy, setSelectedAy] = useState(null);

    const handleSelectPeriod = (e) => {
        const value = e.target.value;
        setSelectedPeriod(value);

        // Reset academic year if the selected period is not "ay"
        if (value !== "ay") {
            setSelectedAy(null);
            // Trigger Inertia request without academic year
            router.get(
                route("admin.dashboard"),
                { period: value },
                {
                    preserveState: true,
                    preserveScroll: true, // Move this inside the same object
                }
            );
        }
    };

    const handleSelectAcademicYear = (e) => {
        const ayValue = e.target.value;
        setSelectedAy(ayValue);

        // Trigger Inertia request with both period and academic year
        router.get(
            route("admin.dashboard"),
            { period: selectedPeriod, academic_year: ayValue }, // pass both
            {
                preserveState: true,
                preserveScroll: true, // Move this inside the same object
            }
        );
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Admin Dashboard
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route("admin.report")}
                            className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Generate Report
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(reportData, null, 2)}
            </pre> */}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* <h1>{dateFrom}</h1> */}
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                                <SelectInput
                                    className="w-full"
                                    value={selectedPeriod}
                                    onChange={handleSelectPeriod} // Only handle period selection here
                                >
                                    <option value="daily">Daily</option>
                                    <option value="weekly">Last Week</option>
                                    <option value="monthly">Last Month</option>
                                    <option value="ay">Academic Year</option>
                                </SelectInput>

                                {selectedPeriod === "ay" && (
                                    <SelectInput
                                        className="w-full"
                                        value={selectedAy}
                                        onChange={handleSelectAcademicYear} // Handle academic year selection separately
                                    >
                                        <option value="">
                                            Select Academic Year
                                        </option>
                                        {academicYears.data.map((ay) => (
                                            <option key={ay.id} value={ay.id}>
                                                {ay.description}
                                            </option>
                                        ))}
                                    </SelectInput>
                                )}
                                
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2 mt-2">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-amber-600 font-semibold text-md">
                                            Published Article
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.articles}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-amber-600 font-semibold text-md">
                                            Total Views
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.views}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-amber-600 font-semibold text-md">
                                            Total Ratings
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.ratings}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-emerald-600 font-semibold text-md">
                                            Total Comments
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.comments}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-emerald-600 font-semibold text-md">
                                            Total Comments Like
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.commentsLike}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-emerald-600 font-semibold text-md">
                                            Total Comments Dislike
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.commentsDislike}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-violet-600 font-semibold text-md">
                                            Total FreedomWall
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.freedomWall}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-violet-600 font-semibold text-md">
                                            Total Freedom Wall Like
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.freedomWallLike}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-violet-600 font-semibold text-md">
                                            Total Freedom Wall Dislike
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.freedomWallDislike}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-blue-600 font-semibold text-md">
                                            Total Incomplete Task
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.tasksIncomplete}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-blue-600 font-semibold text-md">
                                            Total Completed Task
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.tasksCompeted}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-blue-600 font-semibold text-md">
                                            Total Distributed Newsletters
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.totalNewsletters}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                <div className="col-span-2 p-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <h3 className="text-sky-600 font-semibold text-md">
                                        Total Articles Per Category
                                    </h3>
                                    <p className="text-md mt-4">
                                        <BarChart
                                            categoriesWithCount={
                                                categoriesWithCount
                                            }
                                        />
                                    </p>
                                </div>

                                <div className="col-span-2 sm:col-span-1 p-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <h3 className="text-sky-600 font-semibold text-md">
                                        Total View of Articles Per Category
                                    </h3>
                                    <p className="text-md mt-4">
                                        <PieChart
                                            categoriesWithViewsCount={
                                                categoriesWithViewsCount
                                            }
                                        />
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
