import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import BarChart from "@/Components/Chart/BarChart";
import ReportBarChart from "@/Components/Chart/ReportBarChart";
import { router, Head, Link } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import SecondaryButton from "@/Components/SecondaryButton";

export default function Report({
    reportData,

    timePeriod,
    dateFrom,
    dateTo,
    academicYear,

    categoriesWithCount,
    categoriesWithViewsCount,

    academicYears,
    AdminBadgeCount,
    auth,
}) {
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

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
                route("admin.report"),
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
            route("admin.report"),
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
                        Generate Report
                    </h2>
                    <div className="flex gap-4">
                        <SecondaryButton href={route("admin.dashboard")}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }
        >
            <Head title="Report" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(categoriesWithCount, null, 2)}
            </pre>

            <pre className="text-gray-900">
                {JSON.stringify(categoriesWithViewsCount, null, 2)}
            </pre> */}

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="max-w-[816px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-2 py-2">
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
                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Print Report
                                </button>
                            </div>
                            <div className="max-w-[816px] mx-auto">
                                <div
                                    className="custom-print-size"
                                    ref={componentRef}
                                >
                                    {/* <pre className="text-gray-900">
                                        {JSON.stringify(reportData, null, 2)}
                                    </pre> */}
                                    {/* header */}
                                    <div className="bg-white p-2 sm:p-[96px] w-full">
                                        <div className="flex gap-4 justify-center mb-10">
                                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                                <img
                                                    src="/images/tcgc.png"
                                                    alt=""
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex flex-col = items-center">
                                                <h1>
                                                    Tangub City Global College
                                                </h1>
                                                <h1>The Torch Publication</h1>
                                            </div>
                                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                                <img
                                                    src="/images/logo.jpg"
                                                    alt=""
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>
                                        <div className="py-2">
                                            {timePeriod !== "ay" && (
                                                <p className="text-md font-bold">
                                                    Report from {dateFrom} to{" "}
                                                    {dateTo}
                                                </p>
                                            )}
                                            {timePeriod === "ay" && (
                                                <p className="text-md font-bold">
                                                    Report from {academicYear} (
                                                    {dateFrom} -{dateTo})
                                                </p>
                                            )}
                                        </div>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                            {/* thead*/}
                                            <thead className="text-sm text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                                <tr text-text-nowrap="true">
                                                    <th className="px-2 py-2">
                                                        Metric
                                                    </th>
                                                    <th className="px-2 py-2">
                                                        Value
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.entries(reportData).map(
                                                    ([metric, value]) => (
                                                        <tr
                                                            className="text-base text-gray-900 border-b"
                                                            key={metric}
                                                        >
                                                            <td className="py-1 text-nowrap">
                                                                {metric.replace(
                                                                    /([A-Z])/g,
                                                                    " $1"
                                                                )}
                                                            </td>
                                                            <td className="py-1 text-nowrap">
                                                                {value}
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="page-break"></div>

                                    {/* ================next page ==================*/}

                                    <div className="mx-auto mt-4 p-2 sm:p-[96px] bg-white">
                                        <div className="flex gap-4 justify-center mb-10">
                                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                                <img
                                                    src="/images/tcgc.png"
                                                    alt=""
                                                    className="w-full"
                                                />
                                            </div>
                                            <div className="flex flex-col = items-center">
                                                <h1>
                                                    Tangub City Global College
                                                </h1>
                                                <h1>The Torch Publication</h1>
                                            </div>
                                            <div className="w-16 h-16 rounded-full overflow-hidden">
                                                <img
                                                    src="/images/logo.jpg"
                                                    alt=""
                                                    className="w-full"
                                                />
                                            </div>
                                        </div>

                                        <div className="py-2">
                                            {timePeriod !== "ay" && (
                                                <p className="text-md font-bold">
                                                    Report from {dateFrom} to{" "}
                                                    {dateTo}
                                                </p>
                                            )}
                                            {timePeriod === "ay" && (
                                                <p className="text-md font-bold">
                                                    Report from {academicYear} (
                                                    {dateFrom} -{dateTo})
                                                </p>
                                            )}
                                            <p className="text-md font-bold">
                                                Total Articles Per Category
                                            </p>
                                        </div>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                            {/* thead */}
                                            <thead className="text-sm text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                                <tr>
                                                    <th className="px-2 py-2">
                                                        Category Name
                                                    </th>
                                                    <th className="px-2 py-2">
                                                        Article Count
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categoriesWithCount.map(
                                                    (category) => (
                                                        <tr
                                                            className="text-base text-gray-900 border-b"
                                                            key={
                                                                category.category_name
                                                            }
                                                        >
                                                            <td className="py-1 text-nowrap">
                                                                {
                                                                    category.category_name
                                                                }
                                                            </td>
                                                            <td className="py-1 text-nowrap">
                                                                {
                                                                    category.article_count
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>

                                        <div className="py-2 mt-4">
                                            {timePeriod !== "ay" && (
                                                <p className="text-md font-bold">
                                                    Report from {dateFrom} to{" "}
                                                    {dateTo}
                                                </p>
                                            )}
                                            {timePeriod === "ay" && (
                                                <p className="text-md font-bold">
                                                    Report from {academicYear} (
                                                    {dateFrom} -{dateTo})
                                                </p>
                                            )}
                                            <p className="text-md font-bold">
                                                Total View of Articles Per
                                                Category
                                            </p>
                                        </div>
                                        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                            {/* thead */}
                                            <thead className="text-sm text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                                <tr>
                                                    <th className="px-2 py-2">
                                                        Category Name
                                                    </th>
                                                    <th className="px-2 py-2">
                                                        Article View Count
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {categoriesWithViewsCount.map(
                                                    (category) => (
                                                        <tr
                                                            className="text-base text-gray-900 border-b"
                                                            key={
                                                                category.category_name
                                                            }
                                                        >
                                                            <td className="py-1 text-nowrap">
                                                                {
                                                                    category.category_name
                                                                }
                                                            </td>
                                                            <td className="py-1 text-nowrap">
                                                                {
                                                                    category.article_view_count
                                                                }
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                        {/* chart nga samok mo gamay */}
                                        {/* 
                                        <div className="w-[100%] aspect-auto">
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

                                        <div className="w-[100%] aspect-auto">
                                            <h3 className="text-sky-600 font-semibold text-md">
                                                Total View of Articles Per
                                                Category
                                            </h3>
                                            <p className="text-md mt-4">
                                                <ReportBarChart
                                                    categoriesWithViewsCount={
                                                        categoriesWithViewsCount
                                                    }
                                                />
                                            </p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
