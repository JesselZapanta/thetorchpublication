import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { getTaskDueClass, TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP, TASK_STATUS_CLASS_MAP, TASK_STATUS_TEXT_MAP } from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Index({ auth, tasks, queryParams = null, flash, AdminBadgeCount }) {
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

    // useEffect(() => {
    //     router.get(route("admin-task.index"), queryParams, {
    //         preserveState: true,
    //     });
    // }, []);
    
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [task, setTask] = useState(null); // For storing the task to edit/delete

    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("admin-task.index"), queryParams, {
                preserveState: true,
            }); // Fetch all data when search is empty
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
                    route("admin-task.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("admin-task.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("admin-task.index"), queryParams, {
            preserveState: true,
        });
    };

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
        router.get(route("admin-task.index"), queryParams);
    };

    // Open modal and set task to delete
    const openDeleteModal = (task) => {
        setTask(task);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (task) {
            // alert(task.id);
            router.delete(route("admin-task.destroy", task.id));
        }
        setConfirmDelete(false);
        setTask(null);
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Tasks
                    </h2>

                    <div className="flex items-center relative">
                        {/* show in large screen */}
                        <div  className="hidden lg:block">
                            <div className="flex gap-2">
                                <Link
                                    href={route("admin-task.calendar")}
                                    className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                >
                                    Calendar
                                </Link>
                                <Link
                                    href={route("admin-task.create")}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Assign New
                                </Link>
                            </div>
                        </div>
                        <div  className="block lg:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="flex p-2 cursor-pointer justify-center items-center  text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke-width="1.5"
                                            stroke="currentColor"
                                             className="size-6"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75"
                                            />
                                        </svg>
                                        Options
                                        {AdminBadgeCount.totalTaskCount > 0 && (
                                            <>
                                                <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                    {AdminBadgeCount.totalTaskCount >
                                                    9
                                                        ? "9+"
                                                        : AdminBadgeCount.totalTaskCount}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Link
                                        href={route("admin-task.create")}
                                        className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                    >
                                        Assign New
                                    </Link>
                                    <Link
                                        href={route("admin-task.calendar")}
                                        className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                    >
                                        Calendar
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Tasks" />

            <ToastContainer position="bottom-right" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="w-full grid lg:grid-cols-2 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-full">
                                        <TextInput
                                            className="w-full"
                                            defaultValue={queryParams.name}
                                            placeholder="Task Name"
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "name",
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                onKeyPressed("name", e)
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <div className="w-full">
                                        <SelectInput
                                            className="w-full"
                                            defaultValue={queryParams.status}
                                            onChange={(e) =>
                                                handleSelectChange(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Status</option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="progress">
                                                In Progress
                                            </option>
                                            <option value="approval">
                                                For Approval
                                            </option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="content_revision">
                                                Content Revision
                                            </option>
                                            <option value="review">
                                                For Review
                                            </option>
                                            <option value="image_revision">
                                                Image Revision
                                            </option>
                                            <option value="completed">
                                                Completed
                                            </option>
                                        </SelectInput>
                                    </div>
                                    <div className="w-full">
                                        <SelectInput
                                            className="w-full"
                                            defaultValue={queryParams.priority}
                                            onChange={(e) =>
                                                handleSelectChange(
                                                    "priority",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Priority</option>
                                            <option value="low">Low</option>
                                            <option value="medium">
                                                Medium
                                            </option>
                                            <option value="high">High</option>
                                        </SelectInput>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thead with sorting*/}
                                    {/* added */}
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
                                            {/* <TableHeading
                                                name="assigned_by"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Assign By
                                            </TableHeading> */}
                                            <TableHeading
                                                name="assigned_to"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Assignee
                                            </TableHeading>
                                            <TableHeading
                                                name="layout_by"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Designer
                                            </TableHeading>
                                            <TableHeading
                                                name="due_date"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Due Date
                                            </TableHeading>
                                            <TableHeading
                                                name="status"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Status
                                            </TableHeading>
                                            <TableHeading
                                                name="priority"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Status
                                            </TableHeading>
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
                                                    <td className="p-3 text-nowrap">
                                                        {task.id}
                                                    </td>
                                                    <th className="p-3 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            className="text-md text-gray-900 dark:text-gray-300"
                                                            href={route(
                                                                "admin-task.timeline",
                                                                task.id
                                                            )}
                                                        >
                                                            {truncate(
                                                                task.name,
                                                                15
                                                            )}
                                                        </Link>
                                                    </th>
                                                    {/* <td className="p-3 text-nowrap">
                                                        {task.assignedBy.name}
                                                    </td> */}
                                                    <td className="p-3 text-nowrap">
                                                        {task.assignedTo.name}
                                                    </td>
                                                    <td className="p-3 text-nowrap">
                                                        {task.layoutBy.name}
                                                    </td>
                                                    <td className="p-3 text-nowrap">
                                                        {/* {task.dueDate} */}
                                                        <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                getTaskDueClass(
                                                                    task.dueDate
                                                                ) // Use the function here
                                                            }
                                                        >
                                                            {task.dueDate}
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-nowrap">
                                                        <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                TASK_STATUS_CLASS_MAP[
                                                                    task.status
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                TASK_STATUS_TEXT_MAP[
                                                                    task.status
                                                                ]
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-nowrap">
                                                        <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                TASK_PRIORITY_CLASS_MAP[
                                                                    task
                                                                        .priority
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                TASK_PRIORITY_TEXT_MAP[
                                                                    task
                                                                        .priority
                                                                ]
                                                            }
                                                        </span>
                                                    </td>
                                                    <td className="p-3 text-nowrap">
                                                        <Link
                                                            href={route(
                                                                "admin-task.remind",
                                                                task.id
                                                            )}
                                                            className="font-medium text-amber-600 dark:text-amber-500 hover:underline mx-1"
                                                        >
                                                            Remind
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin-task.show",
                                                                task.id
                                                            )}
                                                            className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline mx-1"
                                                        >
                                                            View
                                                        </Link>
                                                        <Link
                                                            href={route(
                                                                "admin-task.edit",
                                                                task.id
                                                            )}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    task
                                                                )
                                                            }
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="8"
                                                    className="p-3 text-center"
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

            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Delete</h2>
                    <p className="mt-4">
                        Are you sure you want to delete "{task?.name}" Task?
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} className="ml-2">
                            Delete
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
