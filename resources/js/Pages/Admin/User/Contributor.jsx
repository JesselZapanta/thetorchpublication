import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { ROLE_TEXT } from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Contributor({
    auth,
    contributorApplications,
    queryParams = null,
    flash,
    AdminBadgeCount,
}) {
    // Display flash messages if they exist
    useEffect(() => {
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    const [confirmReject, setConfirmReject] = useState(false);
    const [application, setApplication] = useState(null); // For storing the user to edit/delete

    // Sort and Search
    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("admin-contributor.index"), queryParams, {
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
                    route("admin-contributor.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("admin-contributor.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("admin-contributor.index"), queryParams, {
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
        router.get(route("admin-contributor.index"), queryParams);
    };

    // Open modal and set User to delete
    const openDeleteModal = (application) => {
        setApplication(application);
        setConfirmReject(true);
    };

    // Handle delete and close modal
    const handle = () => {
        if (application) {
            // alert(user.id);
            router.post(route("admin-contributor.reject", application.id));
        }
        setConfirmReject(false);
        setApplication(null);
    };
    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Application
                    </h2>
                    <div className="flex gap-4">
                        <div className="flex gap-4">
                            <SecondaryButton href={route("user.index")}>
                                Back
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Application" />

            <ToastContainer position="bottom-right" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* sort and search */}
                            <div className="w-full grid grid-cols-3 gap-2">
                                <div className="col-span-2">
                                    <TextInput
                                        className="w-full"
                                        defaultValue={queryParams.name}
                                        placeholder="Search Name"
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
                                <div className="w-full">
                                    <SelectInput
                                        className="w-full"
                                        defaultValue={queryParams.applied_for}
                                        onChange={(e) =>
                                            handleSelectChange(
                                                "applied_for",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Applied For</option>
                                        
                                        <option value="student_contributor">
                                            Student Contributor
                                        </option>
                                        {/* <option value="editor">Editor</option>
                                        <option value="writer">Writer</option>
                                        <option value="designer">
                                            Designer
                                        </option> */}
                                    </SelectInput>
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
                                            <th className="px-3 py-3">
                                                Profile
                                            </th>
                                            <th className="px-3 py-3 text-nowrap">
                                                Student Id
                                            </th>

                                            <th className="px-3 py-3">Name</th>
                                            <TableHeading
                                                name="institute"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Institute
                                            </TableHeading>
                                            <TableHeading
                                                name="program"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Program
                                            </TableHeading>
                                            <TableHeading
                                                name="applied_for"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                applied for
                                            </TableHeading>
                                            <th className="px-3 py-3 text-nowrap">
                                                Sample File
                                            </th>
                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {contributorApplications.data.length >
                                        0 ? (
                                            contributorApplications.data.map(
                                                (application) => (
                                                    <tr
                                                        //added
                                                        className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                        key={application.id}
                                                    >
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {application.id}
                                                        </td>
                                                        <th className="px-3 py-2 text-nowrap">
                                                            <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-indigo-500">
                                                                {application
                                                                    .user
                                                                    .profile_image_path && (
                                                                    <img
                                                                        src={
                                                                            application
                                                                                .user
                                                                                .profile_image_path
                                                                        }
                                                                        className="object-cover w-full h-full"
                                                                        alt={
                                                                            application
                                                                                .user
                                                                                .profile_image_path
                                                                        }
                                                                    />
                                                                )}
                                                            </div>
                                                        </th>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                application.user
                                                                    .student_id
                                                            }
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <Link
                                                                // added
                                                                className="text-md text-gray-900 dark:text-gray-300"
                                                                href={route(
                                                                    "user.show",
                                                                    application.id
                                                                )}
                                                            >
                                                                {
                                                                    application
                                                                        .user
                                                                        .name
                                                                }
                                                            </Link>
                                                        </th>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                application.institute
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                application.program
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                ROLE_TEXT[
                                                                    application
                                                                        .applied_for
                                                                ]
                                                            }
                                                        </td>
                                                        <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                            <a
                                                                href={
                                                                    application.sample_work_file_path
                                                                }
                                                                className="text-md text-gray-900 dark:text-gray-300 text-nowrap"
                                                                target="blank"
                                                            >
                                                                VIEW FILE
                                                            </a>
                                                        </th>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            <Link
                                                                href={route(
                                                                    "admin-contributor.view",
                                                                    application.id
                                                                )}
                                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                            >
                                                                View
                                                            </Link>
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        application
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                            >
                                                                Reject
                                                            </button>
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
                                links={contributorApplications.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirm Delete Modal */}
            <Modal show={confirmReject} onClose={() => setConfirmReject(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Reject</h2>
                    <p className="mt-4">
                        Are you sure you want to reject this application?
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() => setConfirmReject(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handle} className="ml-2">
                            Reject
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
