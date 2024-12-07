import BarChart from "@/Components/Chart/BarChart";
import PieChart from "@/Components/Chart/PieChart";
import SelectInput from "@/Components/SelectInput";
import { ROLE_TEXT } from "@/constants";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Dashboard({
    auth,
    reportData,
    academicYears,
    StudentBadgeCount,

    categoriesWithCount,
    categoriesWithViewsCount,
    dateFrom,
}) {
    const [selectedPeriod, setSelectedPeriod] = useState("daily");
    const [selectedMonth, setSelectedMonth] = useState("");
    const [selectedAy, setSelectedAy] = useState(null);

    const handleSelectPeriod = (e) => {
        const value = e.target.value;
        setSelectedPeriod(value);

        // Reset academic year if the selected period is not "ay"
        if (value !== "ay") {
            setSelectedAy(null);
            // Trigger Inertia request without academic year
            router.get(
                route("student.dashboard"),
                { period: value },
                {
                    preserveState: true,
                    preserveScroll: true, // Move this inside the same object
                }
            );
        }
    };

    const handleSelectMonth = (e) => {
        const value = e.target.value;
        setSelectedMonth(value);

        // Trigger Inertia request with both period and month
        router.get(
            route("student.dashboard"),
            {
                period: selectedPeriod,
                month: value,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleSelectAcademicYear = (e) => {
        const ayValue = e.target.value;
        setSelectedAy(ayValue);

        // Trigger Inertia request with both period and academic year
        router.get(
            route("student.dashboard"),
            { period: selectedPeriod, academic_year: ayValue }, // pass both
            {
                preserveState: true,
                preserveScroll: true, // Move this inside the same object
            }
        );
    };

    return (
        <StudentAuthenticatedLayout
            StudentBadgeCount={StudentBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-md lg:text-xl text-gray-800 dark:text-gray-200 text-nowrap leading-tight">
                        {ROLE_TEXT[auth.user.role]} Dashboard
                    </h2>
                    <div className="flex gap-4">
                        {/* <Link
                            href={route("student-contributor.create")}
                            className="flex justify-center items-center px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                        >
                            Apply Contributor
                            {StudentBadgeCount.rejectedApplication > 0 && (
                                <>
                                    <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                        {StudentBadgeCount.rejectedApplication}
                                    </span>
                                </>
                            )}
                        </Link> */}
                        <Link
                            href={route("student.report")}
                            className="px-4 py-2 bg-indigo-600 text-nowrap text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Report
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Dashboard" />
            {/* 
            <pre className="text-gray-900">
                {JSON.stringify(reportData, null, 2)}
            </pre> */}

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
                                <SelectInput
                                    className="w-full"
                                    value={selectedPeriod}
                                    onChange={handleSelectPeriod} // Only handle period selection here
                                >
                                    <option value="daily">Today</option>
                                    <option value="weekly">Last Week</option>
                                    <option value="monthly">Last Month</option>
                                    <option value="ay">Academic Year</option>
                                </SelectInput>

                                {selectedPeriod === "monthly" && (
                                    <SelectInput
                                        className="w-full"
                                        value={selectedMonth}
                                        onChange={handleSelectMonth}
                                    >
                                        <option value="">Select Month</option>
                                        {Array.from({ length: 12 }, (_, i) => (
                                            <option key={i + 1} value={i + 1}>
                                                {new Date(0, i).toLocaleString(
                                                    "default",
                                                    { month: "long" }
                                                )}
                                            </option>
                                        ))}
                                    </SelectInput>
                                )}

                                {selectedPeriod === "ay" && (
                                    <SelectInput
                                        className="w-full"
                                        value={selectedAy || ""}
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
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-amber-600 font-semibold text-md">
                                                Published Articles
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Published Articles that you have
                                                written.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.articles}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {/* <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <h3 className="text-amber-600 font-semibold text-md">
                                            Total Unpublished Articles
                                        </h3>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.unpublishedArticles}
                                            </span>
                                        </p>
                                    </div>
                                </div> */}
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-amber-600 font-semibold text-md">
                                                Total Views
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Views on your written articles.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.views}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-amber-600 font-semibold text-md">
                                                Total Ratings
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Ratings on your written
                                                articles.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.ratings}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-emerald-600 font-semibold text-md">
                                                Total Comments
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Comments on your written
                                                articles.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.comments}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-emerald-600 font-semibold text-md">
                                                Total Comments Like
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Total Comments Like.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.commentsLike}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-emerald-600 font-semibold text-md">
                                                Total Comments Dislike
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Total Comments Dislike.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.commentsDislike}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-violet-600 font-semibold text-md">
                                                Total FreedomWall
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Total FreedomWall.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.freedomWall}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-violet-600 font-semibold text-md">
                                                Total Freedom Wall Like
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Total Freedom Wall Like.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.freedomWallLike}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <div className="p-6 text-gray-900 dark:text-gray-100">
                                        <div className="relative group">
                                            <h3 className="text-violet-600 font-semibold text-md">
                                                Total Freedom Wall Dislike
                                            </h3>
                                            <span className="absolute left-1/2 w-62 -translate-x-1/2 scale-0 transition-all rounded bg-gray-700 p-2 text-sm text-white group-hover:scale-100">
                                                Total Freedom Wall Like.
                                            </span>
                                        </div>
                                        <p className="text-md mt-4">
                                            <span className="mr-2">
                                                {reportData.freedomWallDislike}
                                            </span>
                                        </p>
                                    </div>
                                </div>

                                {/* <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
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
                                </div> */}
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
                                <div className="col-span-2 p-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <h3 className="text-sky-600 font-semibold text-md">
                                        Total Published Articles Per Category
                                    </h3>
                                    <p className="text-md mt-4">
                                        <BarChart
                                            categoriesWithCount={
                                                categoriesWithCount
                                            }
                                        />
                                    </p>
                                </div>

                                <div className="col-span-2 lg:col-span-1 p-6 text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                                    <h3 className="text-sky-600 font-semibold text-md">
                                        Total View of your Articles Per Category
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
        </StudentAuthenticatedLayout>
    );
}
