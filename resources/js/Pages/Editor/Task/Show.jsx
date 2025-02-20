import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import TextAreaInput from "@/Components/TextAreaInput";
import CustomCKEditor from "@/Components/TextEditor/CustomCKEditor";
import TextInput from "@/Components/TextInput";
import { TASK_PRIORITY_CLASS_MAP, TASK_PRIORITY_TEXT_MAP } from "@/constants";
import EditorAuthenticatedLayout from "@/Layouts/EditorAuthenticatedLayout";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Show({ auth, task, EditorBadgeCount }) {
    const { data, setData, post, errors } = useForm({
        name: task.name || "",
        description: task.description || "",
        category: task.category || "",
        title: task.title || "",
        excerpt: task.excerpt || "",
        body: task.body || "",
        content_revision_message: task.content_revision_message || "",
        caption: task.caption || "",
        draft: "",
        _method: "PUT",
    });

    const onSubmit = () => {
        post(route("editor-task.update", task.id), {
            preserveScroll: true,
        });
    };

    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [confirmDraft, setConfirmDraft] = useState(false);

    const openSubmitModal = () => {
        setConfirmSubmit(true);
        data.draft = "no";
    };

    const openDraftModal = () => {
        setConfirmDraft(true);
        data.draft = "yes";
    };

    const handleConfirmUpdate = () => {
        setConfirmSubmit(false);
        setConfirmDraft(false);
        onSubmit();
    };

    return (
        <EditorAuthenticatedLayout
            EditorBadgeCount={EditorBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Submit Task{" "}
                        <span className="italic ">"{task.name}"</span>
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${task.name}`} />
            {/* <pre className="text-gray-900">{JSON.stringify(task, null, 2)}</pre> */}
            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {task.status === "content_revision" &&
                        task.content_revision_message && (
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
                        {(task.status === "review" ||
                            task.status === "image_revision" ||
                            task.status === "completed") &&
                            task.task_image_path && (
                                <img
                                    src={task.task_image_path}
                                    alt={task.name}
                                    className="w-full object-cover"
                                />
                            )}
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
                                <div className="flex items-center gap-2">
                                    <InputLabel
                                        htmlFor="excerpt"
                                        value="Article Excerpt"
                                    />

                                    <span className="group relative cursor-pointer">
                                        <InformationCircleIcon className="w-6 text-indigo-600" />
                                        {/* Icon added here */}
                                        {/* Tooltip */}
                                        <span className="absolute opacity-0 group-hover:opacity-100 text-sm bg-gray-700 text-white rounded px-2 py-1 w-64">
                                            Provide a brief summary of the
                                            article.
                                        </span>
                                    </span>
                                </div>

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

                                {/* <TextAreaInput
                                    id="body"
                                    type="text"
                                    name="body"
                                    value={data.body}
                                    className="mt-2 block w-full min-h-24"
                                    onChange={(e) =>
                                        setData("body", e.target.value)
                                    }
                                /> */}

                                <CustomCKEditor
                                    id="body"
                                    className="mt-2"
                                    value={data.body}
                                    onChange={(value) => setData("body", value)}
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

                            {/* <div className="block mt-4">
                                <label className="flex items-center">
                                    <Checkbox
                                        name="draft"
                                        checked={data.draft === "yes"}
                                        onChange={(e) =>
                                            setData(
                                                "draft",
                                                e.target.checked ? "yes" : "no"
                                            )
                                        }
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                        Save as Draft
                                    </span>
                                </label>
                            </div> */}

                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("editor-task.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                {/* Show if status is progress, pending, or content needs revision */}
                                {(task.status === "progress" ||
                                    task.status === "pending" ||
                                    task.status === "approval" ||
                                    task.status === "content_revision") && (
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-600 text-white transition-all duration-300 rounded hover:bg-gray-700"
                                        onClick={openDraftModal}
                                    >
                                        Draft
                                    </button>
                                )}

                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                    onClick={openSubmitModal}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Update Modal */}
            <Modal show={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Submit</h2>
                    <p className="mt-4">
                        Are you sure you want to submit this Task?
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
            {/* Confirm draft Modal */}
            <Modal show={confirmDraft} onClose={() => setConfirmDraft(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm save as draft</h2>
                    <p className="mt-4">
                        Are you sure you want to save this task as draft?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton onClick={() => setConfirmDraft(false)}>
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white transition-all duration-300 rounded hover:bg-gray-700"
                            onClick={handleConfirmUpdate}
                            // disabled={processing}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </EditorAuthenticatedLayout>
    );
}
