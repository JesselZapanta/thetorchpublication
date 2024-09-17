import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create({
    auth,
    users,
    categories,
    designers,
}) {
    const { data, setData, post, errors } = useForm({
        name: "",
        description: "",
        assigned_by: "",
        layout_by: "",
        category_id: "",
        status: "",
        priority: "",
        due_date: "",
    });

    const onSubmit = () => {
        post(route("admin-task.store", data), {
            preserveScroll: true,
        });
    };

    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const openSubmitModal = () => {
        setConfirmSubmit(true);
    };

    const handleConfirmSubmit = () => {
        setConfirmSubmit(false);
        onSubmit();
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Assign New Task
                    </h2>
                </div>
            }
        >
            <Head title="Create New Article" />
            {/* <pre className="text-white">{JSON.stringify(auth, null, 2)}</pre> */}

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
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

                            <div className="flex gap-2">
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
                                            setData(
                                                "assigned_by",
                                                e.target.value
                                            )
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
                                            <option value="">
                                                No user found
                                            </option>
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
                                                {designers.data.map(
                                                    (designer) => (
                                                        <option
                                                            key={designer.id}
                                                            value={designer.id}
                                                        >
                                                            {designer.name}
                                                        </option>
                                                    )
                                                )}
                                            </>
                                        ) : (
                                            <option value="">
                                                No designer found
                                            </option>
                                        )}
                                    </SelectInput>

                                    <InputError
                                        message={errors.layout_by}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2">
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
                                            setData(
                                                "category_id",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
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
                            </div>

                            <div className="flex gap-2">
                                {/* Status */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="status"
                                        value="Task status"
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
                                        <option value="">
                                            Select a status
                                        </option>
                                        <option value="pending">Pending</option>
                                        <option value="revision">
                                            Need Revisio
                                        </option>
                                        <option value="approved">
                                            Approved
                                        </option>
                                        <option value="published">
                                            Published
                                        </option>
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
                                        <option value="">
                                            Select Priority
                                        </option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.priority}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("admin-task.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                    onClick={openSubmitModal}
                                >
                                    Assign
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Submit Modal */}
            <Modal show={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Assign</h2>
                    <p className="mt-4">
                        Are you sure you want to Assign this Task?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton
                            onClick={() => setConfirmSubmit(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            onClick={handleConfirmSubmit}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
