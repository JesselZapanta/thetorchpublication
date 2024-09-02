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
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";
import SelectInput from "@/Components/SelectInput";

export default function Index({
    auth,
    newsletters,
    activeAy,
    success,
    queryParams = null,
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDistribute, setConfirmDistribute] = useState(false);
    const [newsletter, setNewsletter] = useState(null); // Storing newsletter to edit/delete/distribute
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDistributing, setIsDistributing] = useState(false);
    const [progress, setProgress] = useState(0);

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        academic_year_id: "",
        description: "",
        newsletter_thumbnail_image_path: "",
        newsletter_file_path: "",
        status: "",

        message: "",
        password: "",
    });

    // for tables sorting and searching
    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("newsletter.index"), queryParams);
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
        router.get(route("newsletter.index"), queryParams);
    };

    // Open modal for creating a new newsletter
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setNewsletter(null); // Clear the selected newsletter for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing newsletter
    const openEditModal = (newsletter) => {
        setNewsletter(newsletter);
        setData({
            academic_year_id: newsletter.academic_year_id,
            description: newsletter.description, // Set description
            newsletter_thumbnail_image_path: "",
            newsletter_file_path: "",
            status: newsletter.status, // Set status
            _method: "PUT",
        }); // Set the form data with the selected newsletter's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (newsletter) {
            // Update existing newsletter
            post(route("newsletter.update", newsletter.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new newsletter
            post(route("newsletter.store"), {
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

    //distribution
    // Open modal for distributing a newsletter
    const openDistributeModal = (newsletter) => {
        setNewsletter(newsletter);
        setData({ message: "", password: "" }); // Reset message and password fields
        setConfirmDistribute(true);
    };

    // Handle newsletter distribution
    const handleDistribute = async (e) => {
        e.preventDefault();
        setIsDistributing(true);
        setProgress(0);

        try {
            const response = await post(
                route("newsletter.distribute", newsletter.id),
                {
                    message: data.message,
                    password: data.password,
                },
                {
                    onProgress: (event) => {
                        setProgress(
                            Math.round((event.loaded / event.total) * 100)
                        );
                    },
                }
            );

            if (response.success) {
                setConfirmDistribute(false);
                reset(); // Reset the form after successful distribution
            }
        } catch (error) {
            console.error("Distribution failed:", error);
        } finally {
            setIsDistributing(false);
        }
    };

    // Close distribution modal
    const closeDistributeModal = () => {
        setConfirmDistribute(false);
        reset(); // Reset the form when closing the modal
        clearErrors(); // Clear any validation errors
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Lists of Newsletters
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
            <Head title="Newsletters" />

            {/* <pre className="text-white">
                {JSON.stringify(newsletters, null, 2)}
            </pre> */}
            {/* Alerts */}
            {success && <AlertSuccess message={success} />}
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
                                                    placeholder="Search Newsletter"
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
                                                Created At
                                            </TableHeading>

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
                                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
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
                                                        <td className="px-3 py-2 text-nowrap">
                                                            <a
                                                                href={
                                                                    newsletter.newsletter_file_path
                                                                }
                                                            >
                                                                VIEW
                                                            </a>
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                newsletter.description
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {newsletter.status}
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            {
                                                                newsletter.created_at
                                                            }
                                                        </td>
                                                        <td className="px-3 py-2 text-nowrap">
                                                            <button
                                                                onClick={() =>
                                                                    openDistributeModal(
                                                                        newsletter
                                                                    )
                                                                }
                                                                className="font-medium text-emerald-600 dark:text-emerald-500 hover:underline mx-1"
                                                            >
                                                                Distribute
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    openEditModal(
                                                                        newsletter
                                                                    )
                                                                }
                                                                className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                            >
                                                                Edit
                                                            </button>
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

            {/* Create/Edit Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-lg font-bold">
                        {newsletter ? "Edit Wewsletter" : "Add New Wewsletter"}
                    </h2>

                    <form onSubmit={onSubmit} className="mt-4">
                        {/* AY */}
                        <div className="w-full">
                            <InputLabel
                                htmlFor="academic_year_id"
                                value="Select Academic Year"
                            />

                            <SelectInput
                                name="academic_year_id"
                                id="academic_year_id"
                                value={data.academic_year_id}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("academic_year_id", e.target.value)
                                }
                            >
                                <option value="">Select a Academic Year</option>
                                {activeAy.data.map((ay) => (
                                    <option key={ay.id} value={ay.id}>
                                        {ay.description}
                                    </option>
                                ))}
                            </SelectInput>

                            <InputError
                                message={errors.academic_year_id}
                                className="mt-2"
                            />
                        </div>
                        {/* description */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="description"
                                value="Newsletter Description"
                            />

                            <TextInput
                                id="description"
                                type="text"
                                name="description"
                                value={data.description}
                                className="mt-2 block w-full"
                                isFocused={true}
                                onChange={(e) =>
                                    setData("description", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.description}
                                className="mt-2"
                            />
                        </div>
                        {/* newsletter_thumbnail_image_path */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="newsletter_thumbnail_image_path"
                                value="Newsletter Thumbnail"
                            />

                            <TextInput
                                id="newsletter_thumbnail_image_path"
                                type="file"
                                name="newsletter_thumbnail_image_path"
                                className="mt-2 block w-full cursor-pointer"
                                onChange={(e) =>
                                    setData(
                                        "newsletter_thumbnail_image_path",
                                        e.target.files[0]
                                    )
                                }
                            />

                            <InputError
                                message={errors.newsletter_thumbnail_image_path}
                                className="mt-2"
                            />
                        </div>

                        {/* Pdf File, */}
                        <div className="mt-4">
                            <InputLabel
                                htmlFor="newsletter_file_path"
                                value="Newsletter Pdf File"
                            />

                            <TextInput
                                id="newsletter_file_path"
                                type="file"
                                name="newsletter_file_path"
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData(
                                        "newsletter_file_path",
                                        e.target.files[0]
                                    )
                                }
                            />

                            <InputError
                                message={errors.newsletter_file_path}
                                className="mt-2"
                            />
                        </div>

                        {/* Status */}
                        <div className="mt-4 w-full">
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
                                <option value="pending">Pending</option>
                                <option value="revision">Revision</option>
                                <option value="approved">Approved</option>
                                <option value="distributed">Distributed</option>
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
                                {newsletter ? "Update" : "Submit"}
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
                        Are you sure you want to delete the newsletter "
                        {newsletter?.description}"?
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
            {/* Confirm Distribute Modal */}
            <Modal show={confirmDistribute}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-lg font-bold">Distribute Newsletter</h2>
                    <form onSubmit={handleDistribute}>
                        <div className="mt-4">
                            <InputLabel htmlFor="message" value="Message" />
                            <TextInput
                                id="message"
                                type="text"
                                name="message"
                                value={data.message}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("message", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.message}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4">
                            <InputLabel
                                htmlFor="password"
                                value="Your Password"
                            />
                            <TextInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                            <InputError
                                message={errors.password}
                                className="mt-2"
                            />
                        </div>

                        {isDistributing && (
                            <div className="mt-4">
                                <p>Progress: {progress}%</p>
                            </div>
                        )}

                        <div className="mt-4 flex justify-end gap-2">
                            <SecondaryButton
                                onClick={closeDistributeModal}
                                disabled={isDistributing}
                            >
                                Cancel
                            </SecondaryButton>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                disabled={isDistributing}
                            >
                                {isDistributing
                                    ? "Distributing..."
                                    : "Distribute"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
