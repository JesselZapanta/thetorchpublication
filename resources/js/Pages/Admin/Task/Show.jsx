import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import {
    TASK_PRIORITY_CLASS_MAP,
    TASK_PRIORITY_TEXT_MAP,

} from "@/constants";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ auth, task }) {
    const { data, setData, post, errors } = useForm({
        title: task.title || "",
        excerpt: task.excerpt || "",
        body: task.body || "",
        caption: task.caption || "",
        status: task.status || "",
        content_revision_message: task.content_revision_message || "",
        _method: "PUT",
    });

    const onSubmit = () => {
        post(route("admin.updateSubmittedTask", task.id), {
            preserveScroll: true,
        });
    };

    const [confirmSubmit, setConfirmSubmit] = useState(false);

    const openSubmitModal = () => {
        setConfirmSubmit(true);
    };

    const handleConfirmUpdate = () => {
        setConfirmSubmit(false);
        onSubmit();
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Task : {task.name}
                    </h2>
                </div>
            }
        >
            <Head title={task.name} />
            {/* <pre className="text-gray-900">{JSON.stringify(task, null, 2)}</pre> */}
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {task.content_revision_message && (
                        <div
                            className="bg-red-100 mb-4 border-t-4 border-red-500 rounded-b-lg text-red-900 px-4 py-3 shadow-md"
                            role="alert"
                        >
                            <div className="flex">
                                <div className="py-1">
                                    <svg
                                        className="fill-current h-6 w-6 text-red-500 mr-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="font-bold">
                                        Revision Message:
                                    </p>
                                    <p className="text-sm">
                                        {task.content_revision_message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="w-full p-4 sm:p8">
                            <div className="w-full">
                                <h2 className="font-bold">Task Name</h2>
                                <p className="p-2 bg-gray-100 rounded-sm">
                                    {task.name}
                                </p>
                            </div>
                            <div className="w-full mt-2">
                                <h2 className="font-bold">Task Description</h2>
                                <p className="p-2 bg-gray-100 rounded-sm">
                                    {task.description}
                                </p>
                            </div>
                            <div className="flex w-full mt-2">
                                <div className="w-full">
                                    <h2 className="font-bold">Task Category</h2>
                                    <p>{task.category.name}</p>
                                </div>
                                <div className="w-full">
                                    <h2 className="font-bold">Task Priority</h2>
                                    <p>
                                        <span
                                            className={
                                                "px-2 py-1 rounded text-white " +
                                                TASK_PRIORITY_CLASS_MAP[
                                                    task.priority
                                                ]
                                            }
                                        >
                                            {
                                                TASK_PRIORITY_TEXT_MAP[
                                                    task.priority
                                                ]
                                            }
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        {/* {article.article_image_path && (
                            <img
                                src={article.article_image_path}
                                alt={article.name}
                                className="w-full object-cover"
                            />
                        )} */}
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            {/* title */}
                            <div className="w-full">
                                <InputLabel htmlFor="title" value="Title" />

                                <TextInput
                                    id="title"
                                    type="text"
                                    name="title"
                                    value={data.title}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>
                            {/* excerpt */}
                            <div className="mt-4 w-full">
                                <InputLabel htmlFor="excerpt" value="Excerpt" />

                                <TextAreaInput
                                    id="excerpt"
                                    type="text"
                                    name="excerpt"
                                    value={data.excerpt}
                                    className="mt-2 block w-full min-h-24"
                                    onChange={(e) =>
                                        setData("excerpt", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.excerpt}
                                    className="mt-2"
                                />
                            </div>

                            {/* body */}
                            <div className="mt-4 w-full">
                                <InputLabel htmlFor="body" value="Body" />

                                <TextAreaInput
                                    id="body"
                                    type="text"
                                    name="body"
                                    value={data.body}
                                    className="mt-2 block w-full min-h-24"
                                    onChange={(e) =>
                                        setData("body", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.body}
                                    className="mt-2"
                                />
                            </div>

                            {/* image caption */}
                            <div className="mt-4 w-full">
                                <InputLabel
                                    htmlFor="caption"
                                    value="Image Caption"
                                />

                                <TextInput
                                    id="caption"
                                    type="text"
                                    name="caption"
                                    value={data.caption}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("caption", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.caption}
                                    className="mt-2"
                                />
                            </div>

                            {/* Status */}
                            <div className="mt-4 w-full">
                                <InputLabel
                                    htmlFor="status"
                                    value="Article status"
                                />

                                <SelectInput
                                    name="status"
                                    id="status"
                                    value={data.status}
                                    className="mt-2 block w-full"
                                    onChange={(e) =>
                                        setData("status", e.target.value)
                                    }
                                >
                                    <option value="">
                                        Select Status
                                    </option>
                                    <option value="approved">
                                        Approved Content
                                    </option>
                                    <option value="content_revision">
                                        Content Revision
                                    </option>
                                </SelectInput>

                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>

                            {data.status === "content_revision" && (
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="content_revision_message"
                                        value="Revision Message"
                                    />

                                    <TextAreaInput
                                        id="content_revision_message"
                                        type="text"
                                        name="content_revision_message"
                                        value={data.content_revision_message}
                                        className="mt-2 block w-full min-h-24"
                                        onChange={(e) =>
                                            setData(
                                                "content_revision_message",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.content_revision_message}
                                        className="mt-2"
                                    />
                                </div>
                            )}

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
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Update Modal */}
            <Modal show={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Save</h2>
                    <p className="mt-4">
                        Are you sure you want to save the changes to this task?
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
                            onClick={handleConfirmUpdate}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
