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
                route("admin.report"),
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
        router.get(route("admin.report"), {
            period: selectedPeriod,
            month: value,
        }, {
            preserveState: true,
            preserveScroll: true,
        });
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
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
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

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="max-w-[816px] mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-2 py-2">
                                <SelectInput
                                    className="w-full"
                                    value={selectedPeriod}
                                    onChange={handleSelectPeriod} // Only handle period selection here
                                >
                                    <option value="daily">Today</option>
                                    <option value="weekly">Last Week</option>
                                    <option value="monthly">Monthly</option>
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
                                <div className="py-4">
                                    {timePeriod !== "ay" && (
                                        <p className="text-[12px] font-bold uppercase">
                                            Report from {dateFrom} to {dateTo}
                                        </p>
                                    )}
                                    {timePeriod === "ay" && (
                                        <p className="text-[12px] font-bold uppercase">
                                            Report from {academicYear} (
                                            {dateFrom} - {dateTo})
                                        </p>
                                    )}
                                </div>
                                <table className="w-full text-[12px]  text-left rtl:text-right text-gray-500">
                                    {/* thead*/}
                                    <thead className="text-[12px]  text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <th className="px-2 py-2">
                                                Metric
                                            </th>
                                            <th className="px-2 py-2 w-1/2 text-center align-middle">
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.entries(reportData).map(
                                            ([metric, value]) => (
                                                <tr
                                                    className="text-[12px]  text-gray-900 border-b"
                                                    key={metric}
                                                >
                                                    <td className="py-1 text-nowrap w-1/2 ">
                                                        {metric.replace(
                                                            /([A-Z])/g,
                                                            " $1"
                                                        )}
                                                    </td>
                                                    <td className="w-1/2 py-1 text-center align-middle">
                                                        {value}
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                <p className="text-md mt-4 font-bold">
                                    Total Published Articles Per Category
                                </p>

                                <table className="w-full text-[12px] text-left rtl:text-right text-gray-500">
                                    {/* thead */}
                                    <thead className="text-[12px] text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-2 py-2 w-1/2 ">
                                                Category Name
                                            </th>
                                            <th className="px-2 py-2 w-1/2 text-center align-middle">
                                                Article Count
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoriesWithCount.map((category) => (
                                            <tr
                                                className="text-gray-900 border-b "
                                                key={category.category_name}
                                            >
                                                <td className="py-1 text-nowrap w-1/2 ">
                                                    {category.category_name}
                                                </td>
                                                <td className="w-1/2 py-1 text-center align-middle">
                                                    {category.article_count}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                <p className="text-md mt-4 font-bold">
                                    Total View of Articles Per Category
                                </p>
                                <table className="w-full text-[12px] text-left rtl:text-right text-gray-500">
                                    {/* thead */}
                                    <thead className="text-[12px] text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                        <tr>
                                            <th className="px-2 py-2">
                                                Category Name
                                            </th>
                                            <th className="px-2 py-2 w-1/2 text-center align-middle">
                                                Article View Count
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {categoriesWithViewsCount.map(
                                            (category) => (
                                                <tr
                                                    className="text-gray-900 border-b"
                                                    key={category.category_name}
                                                >
                                                    <td className="py-1 text-nowrap w-1/2 ">
                                                        {category.category_name}
                                                    </td>
                                                    <td className="w-1/2 py-1 text-center align-middle">
                                                        {
                                                            category.article_view_count
                                                        }
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>

                                <div className="hidden">
                                    <div
                                        // className="custom-print-size"
                                        ref={componentRef}
                                    >
                                        {/* <pre className="text-gray-900">
                                        {JSON.stringify(reportData, null, 2)}
                                    </pre> */}

                                        <div className="mx-auto bg-white ">
                                            {/* Articles */}
                                            <div className="h-[1050px] relative p-2 font-times">
                                                {/* Header */}
                                                <div className="flex absolute bot-0 w-full">
                                                    <img
                                                        src="/images/header.png"
                                                        alt=""
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="mt-32 px-[96px] py-2">
                                                    <div>
                                                        <div className="text-center font-bold mb-4">
                                                            <h1 className="uppercase">
                                                                TANGUB CITY
                                                                GLOBAL COLLEGE
                                                            </h1>
                                                            <p>
                                                                Maloro, Tangub
                                                                City
                                                            </p>
                                                        </div>

                                                        {timePeriod !==
                                                            "ay" && (
                                                            <p className="text-[12px] font-bold uppercase">
                                                                Report from{" "}
                                                                {dateFrom} to{" "}
                                                                {dateTo}
                                                            </p>
                                                        )}
                                                        {timePeriod ===
                                                            "ay" && (
                                                            <p className="text-[12px] font-bold uppercase">
                                                                Report from{" "}
                                                                {academicYear} (
                                                                {dateFrom} -{" "}
                                                                {dateTo})
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="px-[96px] ">
                                                    <table className="w-full text-[12px]  text-left rtl:text-right text-gray-500">
                                                        {/* thead*/}
                                                        <thead className="text-[12px]  text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                                            <tr text-text-nowrap="true">
                                                                <th className="px-2 py-2">
                                                                    Metric
                                                                </th>
                                                                <th className="px-2 py-2 w-1/2 text-center align-middle">
                                                                    Value
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {Object.entries(
                                                                reportData
                                                            ).map(
                                                                ([
                                                                    metric,
                                                                    value,
                                                                ]) => (
                                                                    <tr
                                                                        className="text-[12px]  text-gray-900 border-b"
                                                                        key={
                                                                            metric
                                                                        }
                                                                    >
                                                                        <td className="py-1 text-nowrap w-1/2 ">
                                                                            {metric.replace(
                                                                                /([A-Z])/g,
                                                                                " $1"
                                                                            )}
                                                                        </td>
                                                                        <td className="w-1/2 py-1 text-center align-middle">
                                                                            {
                                                                                value
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="absolute bottom-0">
                                                    <img
                                                        src="/images/footer.png"
                                                        alt=""
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="page-break"></div>

                                        <div className="mx-auto bg-white ">
                                            {/* Articles */}
                                            <div className="h-[1050px] relative p-2 font-times">
                                                {/* Header */}
                                                <div className="flex absolute bot-0 w-full">
                                                    <img
                                                        src="/images/header.png"
                                                        alt=""
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="mt-32 px-[96px] py-2">
                                                    <div>
                                                        <p className="text-md font-bold">
                                                            Total Published
                                                            Articles Per
                                                            Category
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="px-[96px] ">
                                                    <table className="w-full text-[12px] text-left rtl:text-right text-gray-500">
                                                        {/* thead */}
                                                        <thead className="text-[12px] text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                                            <tr>
                                                                <th className="px-2 py-2 w-1/2 ">
                                                                    Category
                                                                    Name
                                                                </th>
                                                                <th className="px-2 py-2 w-1/2 text-center align-middle">
                                                                    Article
                                                                    Count
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {categoriesWithCount.map(
                                                                (category) => (
                                                                    <tr
                                                                        className="text-gray-900 border-b "
                                                                        key={
                                                                            category.category_name
                                                                        }
                                                                    >
                                                                        <td className="py-1 text-nowrap w-1/2 ">
                                                                            {
                                                                                category.category_name
                                                                            }
                                                                        </td>
                                                                        <td className="w-1/2 py-1 text-center align-middle">
                                                                            {
                                                                                category.article_count
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                <div className="px-[96px] mt-4">
                                                    <p className="text-md font-bold">
                                                        Total View of Articles
                                                        Per Category
                                                    </p>
                                                    <table className="w-full text-[12px] text-left rtl:text-right text-gray-500">
                                                        {/* thead */}
                                                        <thead className="text-[12px] text-gray-700 uppercase border-t-2 border-b-2 border-gray-500">
                                                            <tr>
                                                                <th className="px-2 py-2">
                                                                    Category
                                                                    Name
                                                                </th>
                                                                <th className="px-2 py-2 w-1/2 text-center align-middle">
                                                                    Article View
                                                                    Count
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {categoriesWithViewsCount.map(
                                                                (category) => (
                                                                    <tr
                                                                        className="text-gray-900 border-b"
                                                                        key={
                                                                            category.category_name
                                                                        }
                                                                    >
                                                                        <td className="py-1 text-nowrap w-1/2 ">
                                                                            {
                                                                                category.category_name
                                                                            }
                                                                        </td>
                                                                        <td className="w-1/2 py-1 text-center align-middle">
                                                                            {
                                                                                category.article_view_count
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <div className="absolute bottom-0">
                                                    <img
                                                        src="/images/footer.png"
                                                        alt=""
                                                        className="w-full"
                                                    />
                                                </div>
                                            </div>
                                        </div>
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
