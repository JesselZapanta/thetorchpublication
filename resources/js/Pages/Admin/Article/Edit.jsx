import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, article, categories, activeAy }) {
    const { data, setData, post, errors } = useForm({
        category_id: article.category_id || "",
        academic_year_id: article.academic_year_id || "", //todo
        author: article.author || "", //todo
        title: article.title || "",
        excerpt: article.excerpt || "", //todo
        body: article.body || "",
        status: article.status || "",
        revision_message: article.revision_message || "",
        rejection_message: article.rejection_message || "",
        caption: article.caption || "",
        article_image_path: "",
        is_featured: article.is_featured || "",
        is_anonymous: article.is_anonymous || "",
        published_date: article.published_date || "",
        _method: "PUT",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("admin-article.update", article.id));
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Article{" "}
                        <span className="italic ">"{article.title}"</span>
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${article.title}`} />
            {/* <pre className="text-white">{JSON.stringify(article, null, 2)}</pre> */}
            <div className="py-12">
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
                                        <option value="edited">Edited</option>
                                        <option value="revision">
                                            Need Revision
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

                                {/* published_date */}
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
                                    />

                                    <InputError
                                        message={errors.published_date}
                                        className="mt-2"
                                    />
                                </div>
                            </div>

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
                                            setData("author", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.author}
                                        className="mt-2"
                                    />
                                </div>
                            )}

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
                                    // isFocused={true}
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
                                <InputLabel
                                    htmlFor="excerpt"
                                    value="Article Excerpt"
                                />

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

                                <TextAreaInput
                                    id="body"
                                    type="text"
                                    name="body"
                                    value={data.body}
                                    className="mt-2 block w-full min-h-64"
                                    onChange={(e) =>
                                        setData("body", e.target.value)
                                    }
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
                            {/* image path */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="article_image_path"
                                    value="Category Image"
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
                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("admin-article.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                <button className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700">
                                    Update
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
