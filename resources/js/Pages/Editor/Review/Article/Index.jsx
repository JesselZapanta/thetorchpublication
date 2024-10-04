
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import EditorAuthenticatedLayout from "@/Layouts/EditorAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Index({
    auth,
    reportedArticle,
    queryParams = null,
    flash,
    EditorBadgeCount,
}) {
    // Display flash messages if they exist
    useEffect(() => {
        // console.log(flash);
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    //searching
    queryParams = queryParams || {};
    // Handle search and select field changes
    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(
                route("editor-review-report-article.index"),
                queryParams,
                {
                    preserveState: true,
                }
            ); // Fetch all data when search is empty
        } else {
            queryParams[name] = value; // Set query parameter
        }
    };

    // Trigger search on Enter key press
    const onKeyPressed = (name, e) => {
        const value = e.target.value;

        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            if (value.trim() === "") {
                delete queryParams[name]; // Remove query parameter if search is empty
                router.get(
                    route("editor-review-report-article.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(
                    route("editor-review-report-article.index"),
                    queryParams,
                    {
                        preserveState: true,
                    }
                );
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("editor-review-report-article.index"), queryParams, {
            preserveState: true,
        });
    };

    //sorting
    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            if (queryParams.sort_direction === "asc") {
                queryParams.sort_direction = "desc";
            } else {
                queryParams.sort_direction = "asc";
            }
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("editor-review-report-article.index"), queryParams);
    };

    //select what reported content
    const handleSelectReport = (e) => {
        const value = e.target.value;

        if (value === "article") {
            router.get(route("editor-review-report-article.index"));
        } else if (value === "comment") {
            router.get(route("editor-review-report-comment.index"));
        } else if (value === "freedomWall") {
            router.get(route("editor-review-report-freedom-wall.index"));
        }
    };

    //delete report and hide article and restore
    const [confirmAction, setConfirmAction] = useState({
        type: "", // 'delete', 'hide', or 'report'
        article: null,
        show: false,
    });

    const openActionModal = (article, actionType) => {
        setConfirmAction({
            type: actionType, // 'delete', 'hide', or 'report'
            article: article,
            show: true,
        });
    };

    const handleAction = () => {
        if (confirmAction.article) {
            switch (confirmAction.type) {
                case "hide":
                    router.post(
                        route(
                            "editor-review-report-article.hide",
                            confirmAction.article.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "restore":
                    router.post(
                        route(
                            "editor-review-report-article.restore",
                            confirmAction.article.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "reject":
                    router.post(
                        route(
                            "editor-review-report-article.reject",
                            confirmAction.article.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "delete":
                    router.delete(
                        route(
                            "editor-review-report-article.destroy",
                            confirmAction.article.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                default:
                    break;
            }
        }
        setConfirmAction({ type: "", article: null, show: false });
    };

    const openHideModal = (article) => {
        openActionModal(article, "hide");
    };

    const openRestoreModal = (article) => {
        openActionModal(article, "restore");
    };

    const openRejectModal = (article) => {
        openActionModal(article, "reject");
    };

    const openDeleteModal = (article) => {
        openActionModal(article, "delete");
    };

    return (
        <EditorAuthenticatedLayout
            EditorBadgeCount={EditorBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Reported Articles
                    </h2>
                    <div className="flex gap-4">
                        <SelectInput
                            className="w-full"
                            // value="selectedValue"
                            defaultValue="article"
                            onChange={handleSelectReport}
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
            <Head title="Reported Articles" />
            <ToastContainer position="bottom-right" />
            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <TextInput
                                        className="w-full"
                                        defaultValue={queryParams.title}
                                        placeholder="Search Article Title"
                                        onKeyPress={(e) =>
                                            onKeyPressed("title", e)
                                        } // Trigger search on Enter key
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "title",
                                                e.target.value
                                            )
                                        } // Clear or update query param
                                    />
                                </div>
                                <div className="w-[40%]">
                                    <SelectInput
                                        className="w-full"
                                        defaultValue={queryParams.visibility}
                                        onChange={(e) =>
                                            handleSelectChange(
                                                "visibility",
                                                e.target.value
                                            )
                                        } // Trigger request on visibility change
                                    >
                                        <option value="">Visibility</option>
                                        <option value="visible">Visible</option>
                                        <option value="hidden">Hidden</option>
                                    </SelectInput>
                                </div>
                            </div>
                            <div className="overflow-auto mt-3">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thhead with sorting */}
                                    <thead className="text-md text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <TableHeading
                                                name="id"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                ID
                                            </TableHeading>
                                            <TableHeading
                                                name="title"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Title
                                            </TableHeading>
                                            <th className="px-3 py-3">
                                                Visibility
                                            </th>
                                            <TableHeading
                                                name="report_count"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Report Count
                                            </TableHeading>
                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {reportedArticle.data.length > 0 ? (
                                            reportedArticle.data.map(
                                                (article) => (
                                                    <tr
                                                        //added
                                                        className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                        key={article.id}
                                                    >
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {article.id}
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <Link
                                                                // added
                                                                className="text-md text-gray-900 dark:text-gray-300"
                                                                href={route(
                                                                    "editor-review-report-article.show",
                                                                    article.id
                                                                )}
                                                            >
                                                                {truncate(
                                                                    article.title,
                                                                    50
                                                                )}
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {article.visibility}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                article.report_count
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {article.visibility !==
                                                                "hidden" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openHideModal(
                                                                            article
                                                                        )
                                                                    }
                                                                    className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline mx-1"
                                                                >
                                                                    Hide
                                                                </button>
                                                            )}
                                                            {article.visibility !==
                                                                "visible" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openRestoreModal(
                                                                            article
                                                                        )
                                                                    }
                                                                    className="font-medium text-teal-600 dark:teal-red-500 hover:underline mx-1"
                                                                >
                                                                    Restore
                                                                </button>
                                                            )}

                                                            {article.visibility !==
                                                                "hidden" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openRejectModal(
                                                                            article
                                                                        )
                                                                    }
                                                                    className="font-medium text-indigo-600 dark:indigo-red-500 hover:underline mx-1"
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}
                                                            {auth.user.role ===
                                                                "admin" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openDeleteModal(
                                                                            article
                                                                        )
                                                                    }
                                                                    className="font-medium text-red-600 dark:red-red-500 hover:underline mx-1"
                                                                >
                                                                    Delete
                                                                </button>
                                                            )}
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
                            <Pagination
                                links={reportedArticle.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirm Modal */}
            <Modal
                show={confirmAction.show}
                onClose={() =>
                    setConfirmAction({ ...confirmAction, show: false })
                }
            >
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">
                        {confirmAction.type === "hide"
                            ? "Confirm Hide"
                            : confirmAction.type === "restore"
                            ? "Confirm Restore"
                            : confirmAction.type === "reject"
                            ? "Confirm Reject"
                            : "Confirm Delete"}
                    </h2>
                    <p className="mt-4">
                        {confirmAction.type === "hide"
                            ? "Are you sure you want to hide this article?"
                            : confirmAction.type === "restore"
                            ? "Are you sure you want to restore this hidden aricle?"
                            : confirmAction.type === "restore"
                            ? "Are you sure you want to reject this reported article?"
                            : "Are you sure you want to delete this reported article?"}
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() =>
                                setConfirmAction({
                                    ...confirmAction,
                                    show: false,
                                })
                            }
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleAction} className="ml-2">
                            {confirmAction.type === "hide"
                                ? "Hide"
                                : confirmAction.type === "restore"
                                ? "Restore"
                                : confirmAction.type === "reject"
                                ? "Reject"
                                : "Delete"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </EditorAuthenticatedLayout>
    );
}
