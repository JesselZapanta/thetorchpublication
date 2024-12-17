import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import CustomCKEditor from "@/Components/TextEditor/CustomCKEditor";
import TextInput from "@/Components/TextInput";
import EditorAuthenticatedLayout from "@/Layouts/EditorAuthenticatedLayout";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function Create({ auth, categories, EditorBadgeCount }) {
    const { data, setData, post, errors, processing } = useForm({
        category_id: "",
        title: "",
        excerpt: "",
        body: "",
        caption: "",
        article_image_path: "",
        is_anonymous: "",
        status: "",
    });

    const onSubmit = () => {
        post(route("editor-article.store", data));
    };
    const [confirmSubmit, setConfirmSubmit] = useState(false);
    const [confirmDraft, setConfirmDraft] = useState(false);

    const openSubmitModal = () => {
        setConfirmSubmit(true);
        data.status = "edited";
    };

    const openDraftModal = () => {
        setConfirmDraft(true);
        data.status = "draft";
    };

    const handleConfirmSubmit = () => {
        setConfirmSubmit(false);
        onSubmit();
    };

    return (
        <EditorAuthenticatedLayout
            EditorBadgeCount={EditorBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between h-6">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create New Article
                    </h2>
                </div>
            }
        >
            <Head title="Create New Article" />
            {/* <pre className="text-white">{JSON.stringify(auth, null, 2)}</pre> */}

            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            <div className="flex gap-4">
                                {/* category */}
                                <div className="w-full">
                                    <InputLabel
                                        htmlFor="category_id"
                                        value="Select Category"
                                    />

                                    <SelectInput
                                        name="category_id"
                                        id="category_id"
                                        value={data.category_id}
                                        className="mt-2 block w-full"
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

                                {/* is_anonymous */}
                                <div className="w-full">
                                    <InputLabel
                                        htmlFor="is_anonymous"
                                        value="Anonymous Author"
                                    />

                                    <SelectInput
                                        name="is_anonymous"
                                        id="is_anonymous"
                                        value={data.is_anonymous}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "is_anonymous",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Select Option</option>
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.is_anonymous}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* title */}
                            <div className="mt-4 w-full">
                                <InputLabel
                                    htmlFor="title"
                                    value="Article Title"
                                />

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
                                <InputLabel
                                    htmlFor="body"
                                    value="Article Body"
                                />

                                {/* <TextAreaInput
                                    id="body"
                                    type="text"
                                    name="body"
                                    value={data.body}
                                    className="mt-2 block w-full min-h-64"
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

                            {/* caption */}
                            <div className="mt-4">
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
                            <div className="flex gap-4">
                                {/* image path */}
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="article_image_path"
                                        value="Article Image"
                                    />

                                    <TextInput
                                        id="article_image_path"
                                        type="file"
                                        name="article_image_path"
                                        className="mt-2 block w-full cursor-pointer"
                                        onChange={(e) =>
                                            setData(
                                                "article_image_path",
                                                e.target.files[0]
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.article_image_path}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Status */}
                                {/* <div className="mt-4 w-full">
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
                                        <option value="">Select Status</option>
                                        <option value="draft">
                                            Save as Draft
                                        </option>
                                        <option value="edited">Edited</option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div> */}
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("editor-article.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-gray-600 text-white transition-all duration-300 rounded hover:bg-gary-700"
                                    onClick={openDraftModal}
                                >
                                    Draft
                                </button>
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
            {/* Confirm Submit Modal */}
            <Modal show={confirmSubmit} onClose={() => setConfirmSubmit(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Submit</h2>
                    <p className="mt-4">
                        Are you sure you want to Submit this Article?
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
                            disabled={processing}
                        >
                            {processing ? "Processing" : "Submit"}
                        </button>
                    </div>
                </div>
            </Modal>
            {/* Confirm draft Modal */}
            <Modal show={confirmDraft} onClose={() => setConfirmDraft(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm</h2>
                    <p className="mt-4">
                        Are you sure you want to save this article as draft?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton onClick={() => setConfirmDraft(false)}>
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-600 text-white transition-all duration-300 rounded hover:bg-gray-700"
                            onClick={handleConfirmSubmit}
                            disabled={processing}
                        >
                            {processing ? "Processing" : "Save as Draft"}
                        </button>
                    </div>
                </div>
            </Modal>
        </EditorAuthenticatedLayout>
    );
}
