import { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import BarChart from "@/Components/Chart/BarChart";
import ReportBarChart from "@/Components/Chart/ReportBarChart";
import { router, Head, Link } from "@inertiajs/react";
import SelectInput from "@/Components/SelectInput";
import EditorAuthenticatedLayout from "@/Layouts/EditorAuthenticatedLayout";
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
    EditorBadgeCount,
    auth,

    editedArticlesDetais,
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
                route("editor.report"),
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
            route("editor.report"),
            { period: selectedPeriod, academic_year: ayValue }, // pass both
            {
                preserveState: true,
                preserveScroll: true, // Move this inside the same object
            }
        );
    };

    const articlesPerPage = 2;
    const pages = [];
    for (let i = 0; i < editedArticlesDetais.length; i += articlesPerPage) {
        pages.push(editedArticlesDetais.slice(i, i + articlesPerPage));
    }

    return (
        <EditorAuthenticatedLayout
            EditorBadgeCount={EditorBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Generate Report
                    </h2>
                    <div className="flex gap-4">
                        <SecondaryButton href={route("editor.dashboard")}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }
        >
            <Head title="Accomplishement Report" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(categoriesWithCount, null, 2)}
            </pre> */}

            {/* <pre className="text-gray-900">
                {JSON.stringify(editedArticlesDetais, null, 2)}
            </pre> */}

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="max-w-[816px]  mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-2 py-2">
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
                                {/* <a
                                    href={route("editor.pdfreport", {
                                        period: selectedPeriod,
                                        academic_year: selectedAy,
                                    })}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Generate Report
                                </a> */}
                                <button
                                    onClick={handlePrint}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Print Report
                                </button>
                            </div>
                            <div className="max-w-[816px] mx-auto">
                                <div
                                    // className="custom-print-size"
                                    ref={componentRef}
                                >
                                    {/* <pre className="text-gray-900">
                                        {JSON.stringify(reportData, null, 2)}
                                    </pre> */}

                                    <div className="mx-auto bg-white ">
                                        {/* Articles */}

                                        {pages.map((page, pageIndex) => (
                                            <div
                                                key={pageIndex}
                                                // className="h-[1156px] relative p-2"
                                                className="h-[1050px] relative p-2"
                                            >
                                                {/* Header */}
                                                <div className="flex absolute bot-0 w-full">
                                                    <img
                                                        src="/images/header.png"
                                                        alt=""
                                                        className="w-full"
                                                    />
                                                </div>

                                                {/* <div className="mt-32 px-[96px] py-2">
                                                    <p className="text-[12px] font-bold">
                                                        Name: {auth.user.name}
                                                    </p>
                                                    <p className="text-[12px] font-bold">
                                                        Student ID:{" "}
                                                        {auth.user.student_id}
                                                    </p>
                                                    {timePeriod !== "ay" && (
                                                        <p className="text-[12px] font-bold">
                                                            Accomplishment
                                                            Report from{" "}
                                                            {dateFrom} to{" "}
                                                            {dateTo}
                                                        </p>
                                                    )}
                                                    {timePeriod === "ay" && (
                                                        <p className="text-[12px] font-bold">
                                                            Accomplishment
                                                            Report from{" "}
                                                            {academicYear} (
                                                            {dateFrom} -{dateTo}
                                                            )
                                                        </p>
                                                    )}
                                                </div> */}

                                                {/* Articles for this page */}

                                                <div className="mt-32 py-2">
                                                    {page.map(
                                                        (
                                                            article,
                                                            articleIndex
                                                        ) => (
                                                            <div
                                                                key={
                                                                    articleIndex
                                                                }
                                                                className="px-[96px]"
                                                            >
                                                                <p className="text-[12px]">
                                                                    Title:{" "}
                                                                    {
                                                                        article.title
                                                                    }
                                                                </p>
                                                                <div className="flex justify-between">
                                                                    <p className="text-[12px]">
                                                                        Edited
                                                                        Date:{" "}
                                                                        {
                                                                            article.edited_at
                                                                        }
                                                                    </p>
                                                                    <p className="text-[12px]">
                                                                        Published
                                                                        Date:{" "}
                                                                        {
                                                                            article.published_date
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div className="overflow-hidden h-[250px] border-2 mb-4">
                                                                    {article.article_image_path && (
                                                                        <img
                                                                            src={`${window.location.origin}/storage/${article.article_image_path}`}
                                                                            className="object-cover w-full h-full"
                                                                            alt={
                                                                                article.article_image_path
                                                                            }
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                    <div className="absolute bottom-0">
                                                        <img
                                                            src="/images/footer.png"
                                                            alt=""
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    {/* Page break for printing */}
                                                    {pageIndex <
                                                        pages.length - 1 && (
                                                        <div className="page-break"></div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </EditorAuthenticatedLayout>
    );
}
