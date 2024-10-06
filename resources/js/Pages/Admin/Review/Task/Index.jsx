
import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import DropdownAction from "@/Components/DropdownAction";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

import {
    TrashIcon,
    ListBulletIcon,
    ArchiveBoxIcon,
    ArrowPathIcon,
    ArrowUturnLeftIcon,
    AdjustmentsHorizontalIcon,
} from "@heroicons/react/16/solid";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { VISIBILITY_CLASS_MAP, VISIBILITY_TEXT_MAP } from "@/constants";

export default function Index({
    auth,
    tasks,
    queryParams = null,
    flash,
    AdminBadgeCount,
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
    const [visibility, setVisibility] = useState(queryParams.visibility || "");
    // Handle search and select field changes
    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(
                route("admin-archive-task.index"),
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
                    route("admin-archive-task.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(
                    route("admin-archive-task.index"),
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
        setVisibility(value);
        queryParams[name] = value;
        router.get(route("admin-archive-task.index"), queryParams, {
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
        router.get(route("admin-archive-task.index"), queryParams);
    };

    //select what reported content
    //func not used
    // const handleSelectReport = (e) => {
    //     const value = e.target.value;

    //     if (value === "task") {
    //         router.get(route("admin-archive-task.index"));
    //     } else if (value === "comment") {
    //         router.get(route("admin-archive-comment.index"));
    //     } else if (value === "freedomWall") {
    //         router.get(route("admin-archive-freedom-wall.index"));
    //     }
    // };

    //delete report and hide task and restore
    const [confirmAction, setConfirmAction] = useState({
        type: "", // 'delete', 'hide', or 'report'
        task: null,
        show: false,
    });

    const openActionModal = (task, actionType) => {
        setConfirmAction({
            type: actionType, // 'delete', 'hide', or 'report'
            task: task,
            show: true,
        });
    };

    const handleAction = () => {
        if (confirmAction.task) {
            switch (confirmAction.type) {
                case "hide":
                    router.post(
                        route(
                            "admin-archive-task.hide",
                            confirmAction.task.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "restore":
                    router.post(
                        route(
                            "admin-archive-task.restore",
                            confirmAction.task.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "reject":
                    router.post(
                        route(
                            "admin-archive-task.reject",
                            confirmAction.task.id
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "delete":
                    router.delete(
                        route(
                            "admin-archive-task.destroy",
                            confirmAction.task.id
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
        setConfirmAction({ type: "", task: null, show: false });
    };

    const openHideModal = (task) => {
        openActionModal(task, "hide");
    };

    const openRestoreModal = (task) => {
        openActionModal(task, "restore");
    };

    const openRejectModal = (task) => {
        openActionModal(task, "reject");
    };

    const openDeleteModal = (task) => {
        openActionModal(task, "delete");
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-nowrap text-gray-800 dark:text-gray-200 leading-tight">
                        {visibility === "visible"
                            ? "List of Reported Tasks"
                            : visibility === "hidden"
                            ? "List of Archive Tasks"
                            : // : "List of Reported/Archive Tasks"}
                              "List of Archive Tasks"}
                    </h2>
                    {/* not used */}
                    {/* <div className="flex gap-4">
                        <SelectInput
                            className="w-full"
                            // value="selectedValue"
                            defaultValue="task"
                            onChange={handleSelectReport}
                        >
                            <option value="task">Reported Article</option>
                            <option value="comment">Reported Comment</option>
                            <option value="freedomWall">
                                Reported Freedom Wall
                            </option>
                        </SelectInput>
                    </div> */}
                    <div className="flex items-center relative">
                        <Dropdown>
                            <Dropdown.Trigger>
                                <div className="flex p-2 cursor-pointer justify-center items-center  text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700">
                                    <AdjustmentsHorizontalIcon className="w-6 text-gray-50" />
                                    <span className="hidden sm:block">
                                        Content Type
                                    </span>

                                    {AdminBadgeCount.totalReportCount > 0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalReportCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalReportCount}
                                            </span>
                                        </>
                                    )}
                                </div>
                            </Dropdown.Trigger>

                            <Dropdown.Content>
                                <Link
                                    href={route(
                                        "admin-review-report-newsletter.index"
                                    )}
                                    className="px-4 py-2 flex items-center text-nowrap bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Articles
                                    {AdminBadgeCount.totalArticleReportCount >
                                        0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalArticleReportCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalArticleReportCount}
                                            </span>
                                        </>
                                    )}
                                </Link>
                                <Link
                                    href={route(
                                        "admin-review-report-comment.index"
                                    )}
                                    className="px-4 py-2 flex items-center text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700"
                                >
                                    Comments
                                    {AdminBadgeCount.totalCommentReportCount >
                                        0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalCommentReportCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalCommentReportCount}
                                            </span>
                                        </>
                                    )}
                                </Link>
                                <Link
                                    href={route(
                                        "admin-review-report-freedom-wall.index"
                                    )}
                                    className="px-4 py-2 flex items-center text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                >
                                    Freedom Wall
                                    {AdminBadgeCount.totalFreedomWallReportCount >
                                        0 && (
                                        <>
                                            <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                {AdminBadgeCount.totalFreedomWallReportCount >
                                                9
                                                    ? "9+"
                                                    : AdminBadgeCount.totalFreedomWallReportCount}
                                            </span>
                                        </>
                                    )}
                                </Link>
                                <Link
                                    href={route(
                                        "admin-review-report-newsletter.index"
                                    )}
                                    className="px-4 py-2 flex items-center text-nowrap bg-amber-600 text-gray-50 transition-all duration-300 rounded hover:bg-amber-700"
                                >
                                    Newsletters
                                </Link>
                                <Link
                                    href={route("admin-archive-task.index")}
                                    className="px-4 py-2 flex items-center text-nowrap bg-lime-600 text-gray-50 transition-all duration-300 rounded hover:bg-lime-700"
                                >
                                    Tasks
                                </Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            }
        >
            <Head
                title={
                    visibility === "visible"
                        ? "List of Reported Articles"
                        : visibility === "hidden"
                        ? "List of Archive Articles"
                        : "List of Reported/Archive Articles"
                }
            />

            <ToastContainer position="bottom-right" />
            {/* 
            <pre className="text-gray-900">
                {JSON.stringify(tasks, null, 2)}
            </pre> */}

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <TextInput
                                        className="w-full"
                                        defaultValue={queryParams.name}
                                        placeholder="Search Task"
                                        onKeyPress={(e) =>
                                            onKeyPressed("name", e)
                                        } // Trigger search on Enter key
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "name",
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
                                        {/* <option value="visible">Visible</option> */}
                                        <option value="hidden">Archive</option>
                                    </SelectInput>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2 pb-12">
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
                                                name="name"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Task Name
                                            </TableHeading>
                                            <th className="px-3 py-3">
                                                Visibility
                                            </th>
                                            {/* <TableHeading
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
                                            </TableHeading> */}
                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tasks.data.length > 0 ? (
                                            tasks.data.map((task) => (
                                                <tr
                                                    //added
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={task.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.id}
                                                    </td>
                                                    <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            // added
                                                            className="text-md text-gray-900 dark:text-gray-300"
                                                            href={route(
                                                                "admin-archive-show.show",
                                                                task.id
                                                            )}
                                                        >
                                                            {truncate(
                                                                task.name,
                                                                50
                                                            )}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {/* {task.visibility} */}
                                                        <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                VISIBILITY_CLASS_MAP[
                                                                    task
                                                                        .visibility
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                VISIBILITY_TEXT_MAP[
                                                                    task
                                                                        .visibility
                                                                ]
                                                            }
                                                        </span>
                                                    </td>

                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        <div className="flex items-center relative">
                                                            <DropdownAction>
                                                                <DropdownAction.Trigger>
                                                                    <div className="flex w-12 p-2 cursor-pointer justify-center items-center  text-nowrap bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700">
                                                                        <ListBulletIcon className="w-6" />
                                                                    </div>
                                                                </DropdownAction.Trigger>

                                                                <DropdownAction.Content>
                                                                    {task.visibility !==
                                                                        "hidden" && (
                                                                        <DropdownAction.Btn
                                                                            onClick={() =>
                                                                                openHideModal(
                                                                                    task
                                                                                )
                                                                            }
                                                                        >
                                                                            <ArchiveBoxIcon className="w-6 text-rose-600" />
                                                                            Archive
                                                                        </DropdownAction.Btn>
                                                                    )}

                                                                    {task.visibility !==
                                                                        "visible" && (
                                                                        <DropdownAction.Btn
                                                                            onClick={() =>
                                                                                openRestoreModal(
                                                                                    task
                                                                                )
                                                                            }
                                                                        >
                                                                            <ArrowPathIcon className="w-6 text-sky-600" />
                                                                            Restore
                                                                        </DropdownAction.Btn>
                                                                    )}

                                                                    {task.visibility !==
                                                                        "hidden" && (
                                                                        <DropdownAction.Btn
                                                                            onClick={() =>
                                                                                openRejectModal(
                                                                                    task
                                                                                )
                                                                            }
                                                                        >
                                                                            <ArrowUturnLeftIcon className="w-6 text-sky-600" />
                                                                            Reject
                                                                        </DropdownAction.Btn>
                                                                    )}

                                                                    {auth.user
                                                                        .role ===
                                                                        "admin" &&
                                                                        task.visibility ===
                                                                            "hidden" && (
                                                                            <DropdownAction.Btn
                                                                                onClick={() =>
                                                                                    openDeleteModal(
                                                                                        task
                                                                                    )
                                                                                }
                                                                            >
                                                                                <TrashIcon className="w-6 text-red-600" />
                                                                                Delete
                                                                            </DropdownAction.Btn>
                                                                        )}
                                                                </DropdownAction.Content>
                                                            </DropdownAction>
                                                        </div>
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
                            <Pagination
                                links={tasks.meta.links}
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
                            ? "Confirm Archive"
                            : confirmAction.type === "restore"
                            ? "Confirm Restore"
                            : confirmAction.type === "reject"
                            ? "Confirm Reject"
                            : "Confirm Delete"}
                    </h2>
                    <p className="mt-4">
                        {confirmAction.type === "hide"
                            ? "Are you sure you want to archive this task?"
                            : confirmAction.type === "restore"
                            ? "Are you sure you want to restore this archive tasks?"
                            : confirmAction.type === "restore"
                            ? "Are you sure you want to reject this reported task?"
                            : "Are you sure you want to permanently delete this archive task?"}
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
                                ? "Archive"
                                : confirmAction.type === "restore"
                                ? "Restore"
                                : confirmAction.type === "reject"
                                ? "Reject"
                                : "Delete"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}