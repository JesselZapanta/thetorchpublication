import React, { useEffect, useState } from "react";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
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
import { EMOTION_CLASS_MAP } from "@/constants";
import DropdownAction from "@/Components/DropdownAction";
import SearchInput from "@/Components/SearchInput";
import TextAreaInput from "@/Components/TextAreaInput";

export default function Index({
    auth,
    entries,
    queryParams = null,
    flash,
    StudentBadgeCount,
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [freedomwall, setFreedomWall] = useState(null); // For storing the freedomwall to edit/delete
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors, processing } =
        useForm({
            body: "",
            emotion: "",
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
            router.get(route("student-freedomwall.index"), queryParams, {
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
                    route("student-freedomwall.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("student-freedomwall.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("student-freedomwall.index"), queryParams, {
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
        router.get(route("student-freedomwall.index"), queryParams);
    };

    // Open modal for creating a new student-freedomwall
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setFreedomWall(null); // Clear the selected student-freedomwall for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing student-freedomwall
    const openEditModal = (freedomwall) => {
        // alert(freedomwall);
        setFreedomWall(freedomwall);
        setData({
            body: freedomwall.body,
            emotion: freedomwall.emotion,
        }); // Set the form data with the selected freedomwall's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (freedomwall) {
            // Update existing freedomwall
            put(route("student-freedomwall.update", freedomwall.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new freedomwall
            post(route("student-freedomwall.store"), {
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

    // Open modal and set freedomwall to delete
    const openDeleteModal = (freedomwall) => {
        setFreedomWall(freedomwall);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (freedomwall) {
            router.delete(route("student-freedomwall.destroy", freedomwall.id));
        }
        setConfirmDelete(false);
        setFreedomWall(null);
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    return (
        <StudentAuthenticatedLayout
            StudentBadgeCount={StudentBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lists of Entries
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
                            <div className="w-full flex gap-2">
                                <div className="w-full">
                                    <SearchInput
                                        className="w-full"
                                        defaultValue={queryParams.body}
                                        route={route(
                                            "student-freedomwall.index"
                                        )}
                                        queryParams={queryParams}
                                        placeholder="Search Freedom Wall Entries"
                                        onChange={(e) =>
                                            searchFieldChanged(
                                                "body",
                                                e.target.value
                                            )
                                        }
                                        onKeyPress={(e) =>
                                            onKeyPressed("body", e)
                                        }
                                    />
                                </div>
                                <div className="w-[40%]">
                                    <SelectInput
                                        className="w-full"
                                        defaultValue={queryParams.emotion}
                                        onChange={(e) =>
                                            handleSelectChange(
                                                "emotion",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Sort by Emotion
                                        </option>
                                        <option value="happy">Happy</option>
                                        <option value="sad">Sad</option>
                                        <option value="annoyed">Annoyed</option>
                                        <option value="proud">Proud</option>
                                        <option value="drained">Drained</option>
                                        <option value="inlove">Inlove</option>
                                        <option value="calm">Calm</option>
                                        <option value="excited">Excited</option>
                                        <option value="angry">Angry</option>
                                        <option value="down">Down</option>
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
                                                name="body"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Message Body
                                            </TableHeading>
                                            <TableHeading
                                                name="emotion"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Emotion
                                            </TableHeading>

                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entries.data.length > 0 ? (
                                            entries.data.map((freedomwall) => (
                                                <tr
                                                    //added
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={freedomwall.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {freedomwall.id}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {/* {freedomwall.body} */}
                                                        <Link
                                                            // added
                                                            className="text-md text-gray-900 dark:text-gray-300"
                                                            // href={route(
                                                            //     "student-article.show",
                                                            //     article.id
                                                            // )}
                                                        >
                                                            {truncate(
                                                                freedomwall.body,
                                                                50
                                                            )}
                                                        </Link>
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {/* {freedomwall.emotion} */}
                                                        <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                EMOTION_CLASS_MAP[
                                                                    freedomwall
                                                                        .emotion
                                                                ]
                                                            }
                                                        >
                                                            {freedomwall.emotion}
                                                        </span>
                                                    </td>

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
                                                                                freedomwall
                                                                            )
                                                                        }
                                                                    >
                                                                        <PencilSquareIcon className="w-6 text-sky-600" />
                                                                        Edit
                                                                    </DropdownAction.Btn>
                                                                    <DropdownAction.Btn
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                freedomwall
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
                                links={entries.meta.links}
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
                        {freedomwall
                            ? "Edit Freedom Wall Entry"
                            : "Add New Freedom Wall Entry"}
                    </h2>

                    <form onSubmit={onSubmit} className="mt-4">
                        {/* body */}
                        <div className="mt-2 w-full">
                            <InputLabel htmlFor="body" value="Message" />

                            <TextAreaInput
                                id="body"
                                type="text"
                                name="body"
                                value={data.body}
                                className="mt-2 block w-full min-h-44 resize-none"
                                onChange={(e) =>
                                    setData("body", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.body}
                                className="mt-2"
                            />
                        </div>

                        {/* Emotion */}
                        <div className="mt-2 w-full">
                            <InputLabel
                                htmlFor="emotion"
                                value="Message Emotion"
                            />

                            <SelectInput
                                name="emotion"
                                id="emotion"
                                value={data.emotion}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("emotion", e.target.value)
                                }
                            >
                                <option value="">How are you feeling?</option>
                                <option value="happy">Happy</option>
                                <option value="sad">Sad</option>
                                <option value="annoyed">Annoyed</option>
                                <option value="proud">Proud</option>
                                <option value="drained">Drained</option>
                                <option value="inlove">Inlove</option>
                                <option value="calm">Calm</option>
                                <option value="excited">Excited</option>
                                <option value="angry">Angry</option>
                                <option value="down">Down</option>
                            </SelectInput>

                            <InputError
                                message={errors.emotion}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex justify-end gap-2">
                            <SecondaryButton onClick={closeCreateModal}>
                                Cancel
                            </SecondaryButton>
                            {/* <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            >
                                {freedomwall ? "Update" : "Create"}
                            </button> */}
                            <button
                                type="submit"
                                disabled={processing} // Disable button when processing
                                className={`px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded ${
                                    processing
                                        ? "cursor-not-allowed opacity-50"
                                        : "hover:bg-emerald-700"
                                }`}
                            >
                                {freedomwall ? "Update" : "Create"}
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
                        Are you sure you want to delete this freedom wall entry?
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
        </StudentAuthenticatedLayout>
    );
}
