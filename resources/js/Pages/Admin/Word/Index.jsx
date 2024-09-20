import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, useForm, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";


export default function Index({
    auth,
    words,
    queryParams = null,
    flash
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

    const [confirmDelete, setConfirmDelete] = useState(false);
    const [word, setWord] = useState(null); // For storing the word to edit/delete
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors, processing } =
        useForm({
            name: "",
        });

    // for tables sorting and searching
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("word.index"), queryParams, {
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
                    route("word.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("word.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
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
        router.get(route("word.index"), queryParams);
    };

    // Open modal for creating a new word
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setWord(null); // Clear the selected word for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing word
    const openEditModal = (word) => {
        setWord(word);
        setData({
            name: word.name,
        }); // Set the form data with the selected word's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (word) {
            // Update existing word
            put(route("word.update", word.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new word
            post(route("word.store"), {
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

    // Open modal and set word to delete
    const openDeleteModal = (word) => {
        setWord(word);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (word) {
            router.delete(route("word.destroy", word.id));
        }
        setConfirmDelete(false);
        setWord(null);
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between ">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Inappropriate Words
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
            <Head title="Inappropriate Words" />
            <ToastContainer position="bottom-right" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="w-full lg:w-[50%] gap-2">
                                <TextInput
                                    className="w-full"
                                    defaultValue={queryParams.name}
                                    placeholder="Search Inappropriate Word"
                                    onChange={(e) =>
                                        searchFieldChanged(
                                            "name",
                                            e.target.value
                                        )
                                    }
                                    onKeyPress={(e) => onKeyPressed("name", e)}
                                />
                            </div>
                            <div className="overflow-auto mt-2">
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
                                                name="name"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Word
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
                                        {words.data.length > 0 ? (
                                            words.data.map((word) => (
                                                <tr
                                                    //added
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={word.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {word.id}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap blur-sm hover:blur-none transition-all">
                                                        {word.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {word.created_at}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {word.updated_at}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    word
                                                                )
                                                            }
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    word
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
                                links={words.meta.links}
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
                        {word
                            ? "Edit Inappropriate Word"
                            : "Add New Inappropriate Word"}
                    </h2>

                    <form onSubmit={onSubmit} className="mt-4">
                        <div>
                            <InputLabel
                                htmlFor="name"
                                value="Inappropriate Word"
                            />

                            <TextInput
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                className="mt-2 block w-full"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.name}
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
                                {word ? "Update" : "Submit"}
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
                        Are you sure you want to delete the word "{word?.name}"?
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
