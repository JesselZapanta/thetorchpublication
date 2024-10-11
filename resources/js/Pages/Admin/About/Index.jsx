import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { CATEGORY_CLASS_MAP, CATEGORY_TEXT_MAP } from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

import {
    PencilSquareIcon,
    TrashIcon,
    ListBulletIcon,
} from "@heroicons/react/16/solid";


import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import DropdownAction from "@/Components/DropdownAction";

export default function Index({
    auth,
    members,
    queryParams = null,
    flash,
    AdminBadgeCount,
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [member, setMember] = useState(null); // For storing the member to edit/delete
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors, processing } =
        useForm({
            name: "",
            role: "",
            position: "",
            status: "",
            member_image_path: "",
        });

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
            router.get(route("about.index"), queryParams, {
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
                    route("about.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("about.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            queryParams.sort_direction =
                queryParams.sort_direction === "asc" ? "desc" : "asc";
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("about.index"), queryParams);
    };

    // Open modal for creating a new member
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setMember(null); // Clear the selected member for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing member
    const openEditModal = (member) => {
        setMember(member);
        setData({
            name: member.name || "",
            role: member.role || "",
            position: member.position || "",
            status: member.status || "",
            member_image_path: "",
            _method: "PUT",
        }); // Set the form data with the selected category's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (member) {
            // Update existing member
            post(route("about.update", member.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new member
            post(route("about.store"), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        }
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset(); // Reset the form when closing the modal
        clearErrors(); // Clear any validation errors
    };

    // Open modal and set member to delete
    const openDeleteModal = (member) => {
        setMember(member);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (member) {
            router.delete(route("about.destroy", member.id));
        }
        setConfirmDelete(false);
        setMember(null);
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Editorial Board
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Create New
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Editorial Board" />

            <ToastContainer position="bottom-right" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <TextInput
                                        className="w-full"
                                        defaultValue={queryParams.name}
                                        placeholder="Search Member Name"
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
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </SelectInput>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2 pb-12">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thhead with sorting */}
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
                                            <th className="px-3 py-3">Image</th>
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
                                                Name
                                            </TableHeading>
                                            <th className="px-3 py-3">
                                                Position
                                            </th>
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
                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {members.data.length > 0 ? (
                                            members.data.map((member) => (
                                                <tr
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={member.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {member.id}
                                                    </td>
                                                    <th className="px-3 py-2 text-nowrap">
                                                        <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-indigo-500">
                                                            {member.member_image_path && (
                                                                <img
                                                                    src={
                                                                        member.member_image_path
                                                                    }
                                                                    className="object-cover w-full h-full"
                                                                    alt={
                                                                        member.member_image_path
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </th>
                                                    {/* <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            className="text-md text-gray-900 dark:text-gray-300"
                                                            href={route(
                                                                "category.show",
                                                                category.id
                                                            )}
                                                        >
                                                            {category.name}
                                                        </Link>
                                                    </th> */}
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {member.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {member.position}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {member.status}
                                                        {/* <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                CATEGORY_CLASS_MAP[
                                                                    category
                                                                        .status
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                CATEGORY_TEXT_MAP[
                                                                    category
                                                                        .status
                                                                ]
                                                            }
                                                        </span> */}
                                                    </td>
                                                    {/* <td className="px-3 py-2 text-nowrap">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    category
                                                                )
                                                            }
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    category
                                                                )
                                                            }
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                        >
                                                            Delete
                                                        </button>
                                                    </td> */}
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <div className="flex items-center relative">
                                                            <DropdownAction>
                                                                <DropdownAction.Trigger>
                                                                    <div className="flex w-12 p-2 cursor-pointer justify-center items-center  text-nowrap bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700">
                                                                        <ListBulletIcon className="w-6" />
                                                                    </div>
                                                                </DropdownAction.Trigger>

                                                                <DropdownAction.Content>
                                                                    <DropdownAction.Btn
                                                                        onClick={() =>
                                                                            openEditModal(
                                                                                member
                                                                            )
                                                                        }
                                                                    >
                                                                        <PencilSquareIcon className="w-6 text-sky-600" />
                                                                        Edit
                                                                    </DropdownAction.Btn>
                                                                    <DropdownAction.Btn
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                member
                                                                            )
                                                                        }
                                                                    >
                                                                        <TrashIcon className="w-6 text-red-600" />
                                                                        Delete
                                                                    </DropdownAction.Btn>
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
                                links={members.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Create/Edit Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">
                        {member ? "Edit Member" : "Add New Member"}
                    </h2>

                    <form onSubmit={onSubmit} className="mt-4">
                        {/* Code */}
                        {/* name */}
                        <div>
                            <InputLabel htmlFor="name" value="Full Name" />

                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.name}
                                className="mt-2"
                            />
                        </div>
                        {/* position */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="position"
                                value="Member Position"
                            />

                            <TextInput
                                id="position"
                                type="text"
                                name="position"
                                value={data.position}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("position", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.position}
                                className="mt-2"
                            />
                        </div>
                        <div className="flex gap-2">
                            {/* Status */}
                            <div className="mt-4 w-full">
                                <InputLabel
                                    htmlFor="status"
                                    value="Member status"
                                />

                                <SelectInput
                                    name="status"
                                    id="status"
                                    value={data.status}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="">Select a status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </SelectInput>

                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-4 w-full">
                                <InputLabel htmlFor="role" value="User Role" />

                                <SelectInput
                                    name="role"
                                    id="role"
                                    value={data.role}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("role", e.target.value)
                                    }
                                >
                                    <option value="">Select a Role</option>
                                    <option value="student">Student</option>
                                    {/* <option value="student_contributor">
                                        Student Contributor
                                    </option> */}
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="writer">Writer</option>
                                    <option value="designer">Designer</option>
                                </SelectInput>

                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        {/* image path */}
                        <div className="flex gap-2">
                            {/* {member && (
                                <div className="rounded-full mt-8 overflow-hidden flex-shrink-0 w-10 h-10 border-2 border-indigo-500">
                                    {member.member_image_path && (
                                        <img
                                            src={member.member_image_path}
                                            className="object-cover w-full h-full"
                                            alt={member.member_image_path}
                                        />
                                    )}
                                </div>
                            )} */}
                            <div className="mt-4 w-full">
                                <InputLabel
                                    htmlFor="member_image_path"
                                    value="Profile Image"
                                />

                                <TextInput
                                    id="member_image_path"
                                    type="file"
                                    name="member_image_path"
                                    className="mt-2 block w-full cursor-pointer"
                                    onChange={(e) =>
                                        setData(
                                            "member_image_path",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.member_image_path}
                                    className="mt-2"
                                />
                            </div>
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <SecondaryButton onClick={closeCreateModal}>
                                Cancel
                            </SecondaryButton>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            >
                                {member ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Delete</h2>
                    <p className="mt-4">
                        Are you sure you want to delete this member?
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
