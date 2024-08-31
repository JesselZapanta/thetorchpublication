import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import Checkbox from "@/Components/Checkbox";
import SelectInput from "@/Components/SelectInput";
import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import DangerButton from "@/Components/DangerButton";

export default function Index({ auth, academicYears, queryParams = null }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [academicYear, setAcademicYear] = useState(null); // For storing the academicYear to edit/delete
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        code: "",
        description: "",
        status: "",
    });
    // for tables sorting and searching
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("academic-year.index"), queryParams);
    };

    const onKeyPressed = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
    };

    const sortChanged = (name) => {
        if (name === queryParams.sort_field) {
            queryParams.sort_direction =
                queryParams.sort_direction === "asc" ? "desc" : "asc";
        } else {
            queryParams.sort_field = name;
            queryParams.sort_direction = "asc";
        }
        router.get(route("academic-year.index"), queryParams);
    };

    // Open modal for creating a new word
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setAcademicYear(null); // Clear the selected word for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing word
    const openEditModal = (academicYear) => {
        setAcademicYear(academicYear);
        setData({
            code: academicYear.code,
            description: academicYear.description,
            status: academicYear.status,
        }); // Set the form data with the selected word's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (academicYear) {
            // Update existing academicYear
            put(route("academic-year.update", academicYear.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new academicYear
            post(route("academic-year.store"), {
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

    // Open modal and set academicYear to delete
    const openDeleteModal = (academicYear) => {
        setAcademicYear(academicYear);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (academicYear) {
            router.delete(route("academic-year.destroy", academicYear.id));
        }
        setConfirmDelete(false);
        setAcademicYear(null);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Academic Years
                    </h2>
                    <div className="flex gap-4">
                        <button
                            onClick={openCreateModal}
                            className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Create New
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Academic Years" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <th
                                                className="px-3 py-3"
                                                colSpan="2"
                                            >
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.description
                                                    }
                                                    placeholder="Search Academic Year"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "description",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed(
                                                            "description",
                                                            e
                                                        )
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
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
                                                name="code"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Code
                                            </TableHeading>
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
                                                Created At
                                            </TableHeading>
                                            <TableHeading
                                                name="updated_at"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Updated At
                                            </TableHeading>

                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {academicYears.data.length > 0 ? (
                                            academicYears.data.map(
                                                (academicYear) => (
                                                    <tr
                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                        key={academicYear.id}
                                                    >
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {academicYear.id}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {academicYear.code}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                academicYear.description
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                academicYear.status
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                academicYear.created_at
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                academicYear.updated_at
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        academicYear
                                                                    )
                                                                }
                                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openDeleteModal(
                                                                        academicYear
                                                                    )
                                                                }
                                                                className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                            >
                                                                Delete
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
                                links={academicYears.meta.links}
                                // queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-lg font-bold">
                        {academicYear
                            ? "Edit Academic Year Word"
                            : "Add New Academic Year"}
                    </h2>

                    <form onSubmit={onSubmit} className="mt-4">
                        {/* Code */}
                        <div>
                            <InputLabel
                                htmlFor="code"
                                value="Academic Year Code"
                            />

                            <TextInput
                                id="code"
                                type="text"
                                name="code"
                                value={data.code}
                                className="mt-2 block w-full"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("code", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.code}
                                className="mt-2"
                            />
                        </div>
                        {/* Description */}
                        <div className="mt-2 w-full">
                            <InputLabel
                                htmlFor="description"
                                value="Academic Year Description"
                            />

                            <TextInput
                                id="description"
                                type="text"
                                name="description"
                                value={data.description}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>

                        {/* Status */}
                        <div className="mt-2 w-full">
                            <InputLabel
                                htmlFor="status"
                                value="Category status"
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

                        <div className="mt-4 flex justify-end gap-2">
                            <SecondaryButton onClick={closeCreateModal}>
                                Cancel
                            </SecondaryButton>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            >
                                {academicYear ? "Update" : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-lg font-bold">Confirm Delete</h2>
                    <p className="mt-4">
                        Are you sure you want to delete the Acedemic Year "
                        {academicYear?.description}"?
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
        </AuthenticatedLayout>
    );
}
