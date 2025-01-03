import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import DropdownAction from "@/Components/DropdownAction";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { NEWSLETTER_PRIORITY_CLASS_MAP, NEWSLETTER_PRIORITY_TEXT_MAP } from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

import {
    PencilSquareIcon,
    ArchiveBoxIcon,
    ListBulletIcon,
    ArrowUpOnSquareIcon,
    AdjustmentsHorizontalIcon,
} from "@heroicons/react/16/solid";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import SearchInput from "@/Components/SearchInput";
import SelectInput from "@/Components/SelectInput";

export default function Index({ auth, newsletters, queryParams = null, flash, AdminBadgeCount }) {
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

    // for tables sorting and searching
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("newsletter.index"), queryParams, {
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
                    route("newsletter.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("newsletter.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("newsletter.index"), queryParams, {
            preserveState: true,
        });
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            queryParams.sort_direction =
                queryParams.sort_direction === "asc" ? "desc" : "asc";
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("newsletter.index"), queryParams);
    };

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [newsletter, setNewsletter] = useState(null); // Storing newsletter to edit/delete/distribute

    // Open modal and set newsletter to delete
    const openDeleteModal = (newsletter) => {
        setNewsletter(newsletter);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (newsletter) {
            router.delete(route("newsletter.destroy", newsletter.id));
        }
        setConfirmDelete(false);
        setNewsletter(null);
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
                        Lists of Newsletters
                    </h2>

                    <div className="flex items-center relative">
                        {/* show in large screen */}
                        <div className="hidden lg:block">
                            <div className="flex gap-2">
                                {/* <Link
                                    href={route("jobs.index")}
                                    className="px-4 py-2 bg-yellow-600 text-gray-50 transition-all duration-300 rounded hover:bg-yellow-700"
                                >
                                    Queue
                                </Link> */}
                                <Link
                                    href={route("newsletter.calendar")}
                                    className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                >
                                    Calendar
                                </Link>
                                <Link
                                    href={route("newsletter.articles")}
                                    className="px-4 py-2 text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700"
                                >
                                    Select Articles
                                </Link>
                                <Link
                                    href={route("newsletter.create")}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Create New
                                </Link>
                            </div>
                        </div>
                        <div className="block lg:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="flex p-2 cursor-pointer justify-center items-center  text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700">
                                        <AdjustmentsHorizontalIcon className="w-6 text-gray-50" />
                                        Options
                                        {AdminBadgeCount.newsletterPendingCount >
                                            0 && (
                                            <>
                                                <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                    {AdminBadgeCount.newsletterPendingCount >
                                                    9
                                                        ? "9+"
                                                        : AdminBadgeCount.newsletterPendingCount}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Link
                                        href={route("newsletter.create")}
                                        className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                    >
                                        Create New
                                    </Link>

                                    <Link
                                        href={route("newsletter.articles")}
                                        className="px-4 py-2 text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700"
                                    >
                                        Select Articles
                                    </Link>
                                    <Link
                                        href={route("newsletter.calendar")}
                                        className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                    >
                                        
                                    </Link>
                                    {/* <Link
                                        href={route("jobs.index")}
                                        className="px-4 py-2 bg-yellow-600 text-gray-50 transition-all duration-300 rounded hover:bg-yellow-700"
                                    >
                                        Queue
                                    </Link> */}
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Newsletters" />

            <ToastContainer position="bottom-right" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(newsletters, null, 2)}
            </pre> */}

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex justify-between gap-2 flex-col sm:flex-row">
                                <div className="w-full flex gap-2">
                                    <div className="w-full">
                                        <SearchInput
                                            className="w-full"
                                            defaultValue={
                                                queryParams.description
                                            }
                                            route={route("newsletter.index")}
                                            queryParams={queryParams}
                                            placeholder="Search Newsletter"
                                            onChange={(e) =>
                                                searchFieldChanged(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            onKeyPress={(e) =>
                                                onKeyPressed("description", e)
                                            }
                                        />
                                    </div>
                                    <div className="w-[40%]">
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
                                            <option value="revision">
                                                Revision
                                            </option>
                                            <option value="approved">
                                                Approved
                                            </option>
                                            <option value="distributed">
                                                Distributed
                                            </option>
                                        </SelectInput>
                                    </div>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2 pb-12">
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
                                            <th className="px-3 py-3">
                                                Thumbnail
                                            </th>
                                            <th className="px-3 py-3">
                                                PDF file
                                            </th>
                                            <TableHeading
                                                name="description"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Description
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
                                                name="created_at"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Submitted At
                                            </TableHeading>

                                            {/* <th className="px-3 py-3">
                                                Distritute
                                            </th> */}

                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newsletters.data.length > 0 ? (
                                            newsletters.data.map(
                                                (newsletter) => (
                                                    <tr
                                                        //added
                                                        className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                        key={newsletter.id}
                                                    >
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {newsletter.id}
                                                        </td>
                                                        <th className="px-3 py-2 text-nowrap">
                                                            <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-indigo-500">
                                                                {newsletter.newsletter_thumbnail_image_path && (
                                                                    <img
                                                                        src={
                                                                            newsletter.newsletter_thumbnail_image_path
                                                                        }
                                                                        className="object-cover w-full h-full"
                                                                        alt={
                                                                            newsletter.newsletter_thumbnail_image_path
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </th>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <a
                                                                href={
                                                                    newsletter.newsletter_file_path
                                                                }
                                                                className="text-md text-gray-900 dark:text-gray-300"
                                                                target="blank"
                                                            >
                                                                VIEW
                                                            </a>
                                                        </th>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <Link
                                                                // added
                                                                className="text-md text-gray-900 dark:text-gray-300"
                                                                href={route(
                                                                    "newsletter.timeline",
                                                                    newsletter.id
                                                                )}
                                                            >
                                                                {truncate(
                                                                    newsletter.description,
                                                                    50
                                                                )}
                                                            </Link>
                                                        </th>
                                                        {/* <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                newsletter.description
                                                            }
                                                        </td> */}
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {/* {newsletter.status} */}
                                                            <span
                                                                className={
                                                                    "px-2 py-1 rounded text-white " +
                                                                    NEWSLETTER_PRIORITY_CLASS_MAP[
                                                                        newsletter
                                                                            .status
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    NEWSLETTER_PRIORITY_TEXT_MAP[
                                                                        newsletter
                                                                            .status
                                                                    ]
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                newsletter.submitted_at
                                                            }
                                                        </td>
                                                        {/* <td className="px-3 py-2 text-nowrap">
                                                            <Link
                                                                href={route(
                                                                    "distribute.index",
                                                                    newsletter.id
                                                                )}
                                                                className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline mx-1"
                                                            >
                                                                Distribute
                                                            </Link>
                                                        </td> */}
                                                        {/* <td className="px-3 py-2 text-nowrap">
                                                            <Link
                                                                href={route(
                                                                    "newsletter.edit",
                                                                    newsletter.id
                                                                )}
                                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        newsletter
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                            >
                                                                Delete
                                                            </button>
                                                        </td> */}
                                                        <td className="px-3 py-2 text-nowrap w-[10%]">
                                                            <div className="flex items-center relative">
                                                                <DropdownAction>
                                                                    <DropdownAction.Trigger>
                                                                        <div className="flex w-12 p-2 cursor-pointer justify-center items-center  text-nowrap bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700">
                                                                            <ListBulletIcon className="w-6" />
                                                                        </div>
                                                                    </DropdownAction.Trigger>

                                                                    <DropdownAction.Content>
                                                                        <DropdownAction.Link
                                                                            href={route(
                                                                                "distribute.index",
                                                                                newsletter.id
                                                                            )}
                                                                        >
                                                                            <ArrowUpOnSquareIcon className="w-6 text-sky-600" />
                                                                            Distribute
                                                                        </DropdownAction.Link>
                                                                        <DropdownAction.Link
                                                                            href={route(
                                                                                "newsletter.edit",
                                                                                newsletter.id
                                                                            )}
                                                                        >
                                                                            <PencilSquareIcon className="w-6 text-sky-600" />
                                                                            Edit
                                                                        </DropdownAction.Link>
                                                                        <DropdownAction.Btn
                                                                            onClick={() =>
                                                                                openDeleteModal(
                                                                                    newsletter
                                                                                )
                                                                            }
                                                                        >
                                                                            <ArchiveBoxIcon className="w-6 text-red-600" />
                                                                            Archive
                                                                        </DropdownAction.Btn>
                                                                    </DropdownAction.Content>
                                                                </DropdownAction>
                                                            </div>
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
                                links={newsletters.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Archive</h2>
                    <p className="mt-4">
                        Are you sure you want to archive the newsletter "
                        {newsletter?.description}"?
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} className="ml-2">
                            Archive
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
