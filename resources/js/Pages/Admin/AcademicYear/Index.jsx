import React, { useEffect, useState } from "react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import Modal from "@/Components/Modal";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import Pagination from "@/Components/Pagination";
import TableHeading from "@/Components/TableHeading";
import DangerButton from "@/Components/DangerButton";

import {
    PencilSquareIcon,
    TrashIcon,
    ListBulletIcon,
} from "@heroicons/react/16/solid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { AY_CLASS_MAP, AY_TEXT_MAP } from "@/constants";
import DropdownAction from "@/Components/DropdownAction";
import SearchInput from "@/Components/SearchInput";

export default function Index({ auth, academicYears, queryParams = null, flash, AdminBadgeCount }) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [academicYear, setAcademicYear] = useState(null); // For storing the academicYear to edit/delete
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors, processing } =
        useForm({
            code: "",
            description: "",
            status: "",
            start_at: "",
            end_at: "",
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
            router.get(route("academic-year.index"), queryParams, {
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
                    route("academic-year.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("academic-year.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("academic-year.index"), queryParams, {
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
        router.get(route("academic-year.index"), queryParams);
    };

    // Open modal for creating a new academic-year
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setAcademicYear(null); // Clear the selected academic-year for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing academic-year
    const openEditModal = (academicYear) => {
        setAcademicYear(academicYear);
        setData({
            code: academicYear.code,
            description: academicYear.description,
            status: academicYear.status,
            start_at: academicYear.start_at,
            end_at: academicYear.end_at,
        }); // Set the form data with the selected academic-year's data
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
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lists of Academic Years
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
            <Head title="Academic Years" />

            <ToastContainer position="bottom-right" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* <div className="w-full lg:w-[50%] gap-2">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.description}
                                    placeholder="Search Academic Year"
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
                            </div> */}
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <SearchInput
                                        className="w-full"
                                        defaultValue={queryParams.description}
                                        route={route("academic-year.index")}
                                        queryParams={queryParams}
                                        placeholder="Search Academic Year"
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
                                        <option value="active">Active</option>
                                        <option value="inactive">
                                            Inactive
                                        </option>
                                    </SelectInput>
                                </div>
                            </div>
                            <div className="overflow-auto mt-2 pb-12">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* thead with sort */}
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
                                                name="start_at"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Start At
                                            </TableHeading>
                                            <TableHeading
                                                name="end_at"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                End At
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
                                                        //added
                                                        className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
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
                                                            {/* {
                                                                academicYear.status
                                                            } */}
                                                            <span
                                                                className={
                                                                    "px-2 py-1 rounded text-white " +
                                                                    AY_CLASS_MAP[
                                                                        academicYear
                                                                            .status
                                                                    ]
                                                                }
                                                            >
                                                                {
                                                                    AY_TEXT_MAP[
                                                                        academicYear
                                                                            .status
                                                                    ]
                                                                }
                                                            </span>
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                academicYear.startAt
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {academicYear.endAt}
                                                        </td>
                                                        {/* <td className="px-3 py-2 text-nowrap">
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
                                                                                    academicYear
                                                                                )
                                                                            }
                                                                        >
                                                                            <PencilSquareIcon className="w-6 text-sky-600" />
                                                                            Edit
                                                                        </DropdownAction.Btn>
                                                                        <DropdownAction.Btn
                                                                            onClick={() =>
                                                                                openDeleteModal(
                                                                                    academicYear
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
                    <h2 className="text-base font-bold">
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

                        <div className="flex w-full justify-between gap-4">
                            {/* Start At */}
                            <div className="mt-2 w-full">
                                <InputLabel
                                    htmlFor="start_at"
                                    value="Start At"
                                />

                                <TextInput
                                    id="start_at"
                                    type="date"
                                    name="start_at"
                                    value={data.start_at}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("start_at", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.start_at}
                                    className="mt-2"
                                />
                            </div>
                            {/* end At */}
                            <div className="mt-2 w-full">
                                <InputLabel htmlFor="end_at" value="End At" />

                                <TextInput
                                    id="end_at"
                                    type="date"
                                    name="end_at"
                                    value={data.end_at}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("end_at", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.end_at}
                                    className="mt-2"
                                />
                            </div>
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
                                disabled={processing}
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
                    <h2 className="text-base font-bold">Confirm Delete</h2>
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
        </AdminAuthenticatedLayout>
    );
}
