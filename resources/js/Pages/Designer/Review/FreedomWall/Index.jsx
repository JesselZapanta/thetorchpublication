import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import DesignerAuthenticatedLayout from "@/Layouts/DesignerAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Index({
    auth,
    reportedFreedomWall,
    queryParams = null,
    flash,
    DesignerBadgeCount,
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
                route("designer-review-report-freedom-wall.index"),
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
                    route("designer-review-report-freedom-wall.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(
                    route("designer-review-report-freedom-wall.index"),
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
        router.get(
            route("designer-review-report-freedom-wall.index"),
            queryParams,
            {
                preserveState: true,
            }
        );
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
        router.get(
            route("designer-review-report-freedom-wall.index"),
            queryParams
        );
    };

    //select reported content
    const handleSelectReport = (e) => {
        const value = e.target.value;

        if (value === "article") {
            router.get(route("designer-review-report-article.index"));
        } else if (value === "comment") {
            router.get(route("designer-review-report-comment.index"));
        } else if (value === "freedomWall") {
            router.get(route("designer-review-report-freedom-wall.index"));
        }
    };

    //delete, hide, report
    const [confirmAction, setConfirmAction] = useState({
        type: "", // 'delete', 'hide', or 'report'
        entry: null,
        show: false,
    });

    const openActionModal = (entry, actionType) => {
        setConfirmAction({
            type: actionType, // 'delete', 'hide', or 'report'
            entry: entry,
            show: true,
        });
    };

    const handleAction = () => {
        if (confirmAction.entry) {
            switch (confirmAction.type) {
                case "hide":
                    router.post(
                        route(
                            "designer-review-report-freedom-wall.hide",
                            confirmAction.entry.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "restore":
                    router.post(
                        route(
                            "designer-review-report-freedom-wall.restore",
                            confirmAction.entry.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "reject":
                    router.post(
                        route(
                            "designer-review-report-freedom-wall.reject",
                            confirmAction.entry.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "delete":
                    router.delete(
                        route(
                            "designer-review-report-freedom-wall.destroy",
                            confirmAction.entry.id
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
        setConfirmAction({ type: "", entry: null, show: false });
    };

    const openHideModal = (entry) => {
        openActionModal(entry, "hide");
    };

    const openRestoreModal = (entry) => {
        openActionModal(entry, "restore");
    };

    const openRejectModal = (entry) => {
        openActionModal(entry, "reject");
    };

    const openDeleteModal = (entry) => {
        openActionModal(entry, "delete");
    };

    return (
        <DesignerAuthenticatedLayout
            DesignerBadgeCount={DesignerBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Reported Freedom Wall
                    </h2>
                    <div className="flex gap-4">
                        <SelectInput
                            className="w-full"
                            value="freedomWall"
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
            <Head title="Reported Freedom Wall" />
            <ToastContainer position="bottom-right" />
            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <TextInput
                                        className="w-full"
                                        defaultValue={queryParams.body}
                                        placeholder="Search Freedom Wall"
                                        onKeyPress={(e) =>
                                            onKeyPressed("body", e)
                                        }
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "body",
                                                e.target.value
                                            )
                                        }
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
                                        }
                                    >
                                        <option value="">Visibility</option>
                                        <option value="visible">Visible</option>
                                        <option value="hidden">Hidden</option>
                                    </SelectInput>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2">
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
                                                name="body"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Body
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
                                        {reportedFreedomWall.data.length > 0 ? (
                                            reportedFreedomWall.data.map(
                                                (entry) => (
                                                    <tr
                                                        //added
                                                        className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                        key={entry.id}
                                                    >
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {entry.id}
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <Link
                                                                // added
                                                                className="text-md text-gray-900 dark:text-gray-300"
                                                                href={route(
                                                                    "designer-review-report-freedom-wall.show",
                                                                    entry.id
                                                                )}
                                                            >
                                                                {truncate(
                                                                    entry.body,
                                                                    50
                                                                )}
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {entry.visibility}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {entry.report_count}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {entry.visibility !==
                                                                "hidden" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openHideModal(
                                                                            entry
                                                                        )
                                                                    }
                                                                    className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline mx-1"
                                                                >
                                                                    Hide
                                                                </button>
                                                            )}
                                                            {entry.visibility !==
                                                                "visible" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openRestoreModal(
                                                                            entry
                                                                        )
                                                                    }
                                                                    className="font-medium text-teal-600 dark:teal-red-500 hover:underline mx-1"
                                                                >
                                                                    Restore
                                                                </button>
                                                            )}

                                                            {entry.visibility !==
                                                                "hidden" && (
                                                                <button
                                                                    onClick={() =>
                                                                        openRejectModal(
                                                                            entry
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
                                                                            entry
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
                                links={reportedFreedomWall.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
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
                            ? "Are you sure you want to hide this Freedom Wall Entry?"
                            : confirmAction.type === "restore"
                            ? "Are you sure you want to restore this hidden Freedom Wall Entry?"
                            : confirmAction.type === "restore"
                            ? "Are you sure you want to reject this reported Freedom Wall Entry?"
                            : "Are you sure you want to delete this reported Freedom Wall Entry?"}
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
        </DesignerAuthenticatedLayout>
    );
}
