import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    auth,
    tasks,
    users,
    categories,
    designers,
    success,
    queryParams = null,
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [task, setTask] = useState(null); // For storing the task to edit/delete
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset } = useForm({
        name: "",
        description: "",
        assigned_by: "",
        layout_by: "",
        category_id: "",
        status: "",
        priority: "",
        due_date: "",
    });

    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("task.index"), queryParams);
    };

    const onKeyPressed = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
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
        router.get(route("task.index"), queryParams);
    };

    // Open modal for creating a new task
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setTask(null); // Clear the selected task for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing task
    const openEditModal = (task) => {
        setTask(task);
        setData({
            name: task.name || "", // Set name
            description: task.description || "", // Set description
            assigned_by: task.assigned_by || "", // Set assigned_by
            layout_by: task.layout_by || "", // Set layout_by
            category_id: task.category_id || "", // Set category_id
            status: task.status || "", // Set status
            priority: task.priority || "", // Set priority
            due_date: task.due_date || "", // Set due_date
        }); // Set the form data with the selected task's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (task) {
            // Update existing task
            put(route("task.update", task.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new task
            post(route("task.store"), {
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
            router.delete(route("task.destroy", task.id));
        }
        setConfirmDelete(false);
        setTask(null);
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Tasks
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
            <Head title="Tasks" />

            {/* alert */}
            {success && <AlertSuccess message={success} />}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thead with search */}
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <th
                                                className="px-3 py-3"
                                                colSpan="2"
                                            >
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.assigned_by
                                                    }
                                                    placeholder="Assignee"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "assigned_by",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed(
                                                            "assigned_by",
                                                            e
                                                        )
                                                    }
                                                />
                                            </th>
                                            <th
                                                className="px-3 py-3"
                                                colSpan="1"
                                            >
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.layout_by
                                                    }
                                                    placeholder="Designer"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "layout_by",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed(
                                                            "layout_by",
                                                            e
                                                        )
                                                    }
                                                />
                                            </th>
                                            <th
                                                className="px-3 py-3"
                                                colSpan="1"
                                            >
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.name
                                                    }
                                                    placeholder="Task Name"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "name",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed("name", e)
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3"></th>
                                            <th className="px-3 py-3">
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.status
                                                    }
                                                    onChange={(e) =>
                                                        searchFieldChanged(
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Status
                                                    </option>
                                                    <option value="pending">
                                                        Pending
                                                    </option>
                                                    <option value="revision">
                                                        Need Revision
                                                    </option>
                                                    <option value="approved">
                                                        Approved
                                                    </option>
                                                    <option value="published">
                                                        Published
                                                    </option>
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3">
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.priority
                                                    }
                                                    onChange={(e) =>
                                                        searchFieldChanged(
                                                            "priority",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Priority
                                                    </option>
                                                    <option value="low">
                                                        Low
                                                    </option>
                                                    <option value="medium">
                                                        Medium
                                                    </option>
                                                    <option value="high">
                                                        High
                                                    </option>
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
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
                                                name="assigned_by"
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
                                                Due Data
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
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.id}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.assignedBy.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.layoutBy.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.due_date}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.status}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {task.priority}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <button
                                                            onClick={() =>
                                                                openEditModal(
                                                                    task
                                                                )
                                                            }
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </button>
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

            {/* Create/Edit Modal */}
            <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">
                        {task ? "Edit Task" : "Add New Task"}
                    </h2>

                    <form onSubmit={onSubmit} className="mt-4">
                        {/* Name */}
                        <div className="w-full">
                            <InputLabel htmlFor="name" value="Task Name" />

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
                        {/* Description */}
                        <div className="mt-4 w-full">
                            <InputLabel
                                htmlFor="description"
                                value="Task Description"
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

                        {/* assigned_by */}
                        <div className="mt-4 w-full">
                            <InputLabel
                                htmlFor="assigned_by"
                                value="Select Assignee"
                            />

                            <SelectInput
                                name="assigned_by"
                                id="assigned_by"
                                value={data.assigned_by}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("assigned_by", e.target.value)
                                }
                            >
                                {users.data.length > 0 ? (
                                    <>
                                        <option value="">
                                            Select an Assignee
                                        </option>
                                        {users.data.map((user) => (
                                            <option
                                                key={user.id}
                                                value={user.id}
                                            >
                                                {user.name}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">No user found</option>
                                )}
                            </SelectInput>

                            <InputError
                                message={errors.assigned_by}
                                className="mt-2"
                            />
                        </div>

                        {/* layout_by */}
                        <div className="mt-4 w-full">
                            <InputLabel
                                htmlFor="layout_by"
                                value="Select Desinger"
                            />

                            <SelectInput
                                name="layout_by"
                                id="layout_by"
                                value={data.layout_by}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("layout_by", e.target.value)
                                }
                            >
                                {designers.data.length > 0 ? (
                                    <>
                                        <option value="">
                                            Select Desinger
                                        </option>
                                        {designers.data.map((designer) => (
                                            <option
                                                key={designer.id}
                                                value={designer.id}
                                            >
                                                {designer.name}
                                            </option>
                                        ))}
                                    </>
                                ) : (
                                    <option value="">No designer found</option>
                                )}
                            </SelectInput>

                            <InputError
                                message={errors.layout_by}
                                className="mt-2"
                            />
                        </div>

                        {/* Category */}
                        <div className="mt-4 w-full">
                            <InputLabel
                                htmlFor="category_id"
                                value="Select Category"
                            />

                            <SelectInput
                                name="category_id"
                                id="category_id"
                                value={data.category_id}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("category_id", e.target.value)
                                }
                            >
                                <option value="">Select a category</option>
                                {categories.data.map((category) => (
                                    <option
                                        key={category.id}
                                        value={category.id}
                                    >
                                        {category.name}
                                    </option>
                                ))}
                            </SelectInput>

                            <InputError
                                message={errors.category_id}
                                className="mt-2"
                            />
                        </div>

                        {/* Status */}
                        <div className="mt-4 w-full">
                            <InputLabel htmlFor="status" value="Task status" />

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
                                <option value="revision">Need Revisio</option>
                                <option value="approved">Approved</option>
                                <option value="published">Published</option>
                            </SelectInput>

                            <InputError
                                message={errors.status}
                                className="mt-2"
                            />
                        </div>

                        {/* priority */}
                        <div className="mt-4 w-full">
                            <InputLabel
                                htmlFor="priority"
                                value="Task priority"
                            />

                            <SelectInput
                                name="priority"
                                id="priority"
                                value={data.priority}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("priority", e.target.value)
                                }
                            >
                                <option value="">Select Priority</option>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </SelectInput>

                            <InputError
                                message={errors.priority}
                                className="mt-2"
                            />
                        </div>

                        {/* due_date */}
                        <div className="mt-4 w-full">
                            <InputLabel
                                htmlFor="due_date"
                                value="Task Due Date"
                            />

                            <TextInput
                                id="due_date"
                                type="date"
                                name="due_date"
                                value={data.due_date}
                                className="mt-2 block w-full"
                                onChange={(e) =>
                                    setData("due_date", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.due_date}
                                className="mt-2"
                            />
                        </div>

                        <div className="mt-4 flex justify-end">
                            <SecondaryButton onClick={closeCreateModal}>
                                Cancel
                            </SecondaryButton>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            >
                                {task ? "Update" : "Assign Task"}
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
