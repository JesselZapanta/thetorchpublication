import Checkbox from "@/Components/Checkbox";
import DangerButton from "@/Components/DangerButton";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import CustomCKEditor from "@/Components/TextEditor/CustomCKEditor";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { InformationCircleIcon } from "@heroicons/react/16/solid";
import { Head, Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";

export default function Edit({
    auth,
    article,
    categories,
    activeAy,
    AdminBadgeCount,
}) {
    const { data, setData, post, errors } = useForm({
        category_id: article.category_id || "",
        academic_year_id: article.academic_year_id || "",
        author: article.author || "",
        title: article.title || "",
        excerpt: article.excerpt || "",
        body: article.body || "",
        status: article.status || "",
        revision_message: article.revision_message || "",
        rejection_message: article.rejection_message || "",
        caption: article.caption || "",
        article_image_path: "",
        is_featured: article.is_featured || "",
        is_anonymous: article.is_anonymous || "",
        published_date: article.publishedDate || "",
        // published_date: article.published_date
        //     ? new Date(article.published_date).toISOString().split("T")[0] // Format date correctly
        //     : "",
        // draft: article.draft || "no",
        _method: "PUT",
    });

    // Automatically set published_date if status is "published"
    useEffect(() => {
        if (
            (data.status === "published" || data.status === "scheduled") &&
            !data.published_date
        ) {
            const today = new Date().toISOString().split("T")[0];
            setData("published_date", today);
        }
    }, [data.status, setData]); // Run effect when status changes

    const onSubmit = () => {
        post(route("admin-article.update", article.id), {
            preserveScroll: true,
        });
    };

    const [confirmUpdate, setConfirmUpdate] = useState(false);
    const [confirmDraft, setConfirmDraft] = useState(false);

    const openUpdateModal = () => {
        setConfirmUpdate(true);
    };

    const openDraftModal = () => {
        setConfirmDraft(true);
        data.status = "draft";
    };


    const handleConfirmUpdate = () => {
        setConfirmUpdate(false);
        onSubmit();
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Article{" "}
                        <span className="italic ">"{article.title}"</span>
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${article.title}`} />
            {/* <pre className="text-gray-900">{JSON.stringify(article, null, 2)}</pre> */}
            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    {article.revision_message && (
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
                                        {article.revision_message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {article.article_image_path && (
                            <img
                                src={article.article_image_path}
                                alt={article.name}
                                className="w-full object-cover"
                            />
                        )}
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

                                {/* is_featured */}
                                <div className="w-full">
                                    <InputLabel
                                        htmlFor="is_featured"
                                        value="Featured Article"
                                    />

                                    <SelectInput
                                        name="is_featured"
                                        id="is_featured"
                                        value={data.is_featured}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "is_featured",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">Select Option</option>
                                        <option value="no">No</option>
                                        <option value="yes">Yes</option>
                                    </SelectInput>

                                    <InputError
                                        message={errors.is_featured}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* featured and Academic Year */}
                            <div className="flex gap-4">
                                {/* Academic Year */}
                                {article.createdBy.id === auth.user.id && (
                                    <div className="w-full mt-4">
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
                                                setData(
                                                    "academic_year_id",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select a Academic Year
                                            </option>
                                            {activeAy.data.map((ay) => (
                                                <option
                                                    key={ay.id}
                                                    value={ay.id}
                                                >
                                                    {ay.description}
                                                </option>
                                            ))}
                                        </SelectInput>

                                        <InputError
                                            message={errors.academic_year_id}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                                {/* is_anonymous */}
                                {article.createdBy.id === auth.user.id && (
                                    <div className="w-full mt-4">
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
                                            <option value="">
                                                Select Option
                                            </option>
                                            <option value="no">No</option>
                                            <option value="yes">Yes</option>
                                        </SelectInput>

                                        <InputError
                                            message={errors.is_anonymous}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>
                            {/* status and published */}
                            <div className="flex gap-4">
                                {/* Published Date */}
                                {/* {article.createdBy.id === auth.user.id && (
                                    <div className="w-full mt-4">
                                        <InputLabel
                                            htmlFor="published_date"
                                            value="Published Date"
                                        />

                                        <TextInput
                                            id="published_date"
                                            type="date"
                                            name="published_date"
                                            value={data.published_date}
                                            className="mt-2 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "published_date",
                                                    e.target.value
                                                )
                                            }
                                            disabled={
                                                data.status !== "published"
                                            } // Disable unless status is "published"
                                        />

                                        <InputError
                                            message={errors.published_date}
                                            className="mt-2"
                                        />
                                    </div>
                                )} */}

                                {/* author if no acc */}
                                {article.createdBy.id === auth.user.id && (
                                    <div className="mt-4 w-full">
                                        <InputLabel
                                            htmlFor="author"
                                            value="Article Author (If you are the author, leave empty.)"
                                        />

                                        <TextInput
                                            id="author"
                                            type="text"
                                            name="author"
                                            placeholder={auth.user.username}
                                            value={data.author}
                                            className="mt-2 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "author",
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <InputError
                                            message={errors.author}
                                            className="mt-2"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* title */}
                            <div className="mt-2 w-full">
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
                                    //
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
                            <div className="mt-2 w-full">
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
                                    onChange={(value) => setData("body", value)} // Update the body in form state
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
                            {(article.createdBy.id === auth.user.id ||
                                data.status === "scheduled") && (
                                <div className="w-full mt-4">
                                    <InputLabel
                                        htmlFor="published_date"
                                        value="Published Date"
                                    />

                                    <TextInput
                                        id="published_date"
                                        type="date"
                                        name="published_date"
                                        value={data.published_date}
                                        className="mt-2 block w-full"
                                        onChange={(e) =>
                                            setData(
                                                "published_date",
                                                e.target.value
                                            )
                                        }
                                        disabled={
                                            data.status !== "published" &&
                                            data.status !== "draft" &&
                                            data.status !== "scheduled"
                                        } // Disable unless status is "published" or "scheduled"
                                    />

                                    <InputError
                                        message={errors.published_date}
                                        className="mt-2"
                                    />
                                </div>
                            )}
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
                                            Select a status
                                        </option>
                                        {/* {auth.user.id ===
                                            article.createdBy.id && (
                                            <option value="draft">
                                                Save as Draft
                                            </option>
                                        )} */}

                                        <option value="published">
                                            Approved and Published
                                        </option>

                                        <option value="scheduled">
                                            Scheduled and Published
                                        </option>

                                        {auth.user.id !==
                                            article.createdBy.id && (
                                            <option value="edited">
                                                Edited
                                            </option>
                                        )}

                                        {auth.user.id !==
                                            article.createdBy.id && (
                                            <option value="revision">
                                                Need Revision
                                            </option>
                                        )}
                                    </SelectInput>

                                    <InputError
                                        message={errors.status}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

                            {/* revision_message */}
                            {data.status === "revision" && (
                                <div className="mt-4 w-full">
                                    <InputLabel
                                        htmlFor="revision_message"
                                        value="Revision Message"
                                    />

                                    <TextAreaInput
                                        id="revision_message"
                                        type="text"
                                        name="revision_message"
                                        value={data.revision_message}
                                        className="mt-2 block w-full min-h-24"
                                        onChange={(e) =>
                                            setData(
                                                "revision_message",
                                                e.target.value
                                            )
                                        }
                                    />

                                    <InputError
                                        message={errors.revision_message}
                                        className="mt-2"
                                    />
                                </div>
                            )}
                            {/* save as draft
                            <div className="block mt-4">
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
                                    href={route("admin-article.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                {auth.user.id === article.createdBy.id && (
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-600 text-white transition-all duration-300 rounded hover:bg-gary-700"
                                        onClick={openDraftModal}
                                    >
                                        Draft
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                    onClick={openUpdateModal}
                                >
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Update Modal */}
            <Modal show={confirmUpdate} onClose={() => setConfirmUpdate(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Update</h2>
                    <p className="mt-4">
                        Are you sure you want to Update this Article?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton
                            onClick={() => setConfirmUpdate(false)}
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
                            onClick={handleConfirmUpdate}
                            // disabled={processing}
                        >
                            {/* {processing ? "Processing" : "Save as Draft"} */}
                            Save as Draft
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
