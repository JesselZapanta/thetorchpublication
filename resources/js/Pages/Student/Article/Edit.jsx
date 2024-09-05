import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, article, categories }) {
    const { data, setData, post, errors } = useForm({
        category_id: article.category_id || "",
        // academic_year_id: article.academic_year_id || "", //todo
        // author: article.author || "", //todo
        title: article.title || "",
        excerpt: article.excerpt || "", //todo
        body: article.body || "",
        status: article.status || "",
        caption: article.caption || "",
        article_image_path: "",
        // is_featured: article.is_featured || "", 
        is_anonymous: article.is_anonymous || "", 
        // published_date: article.published_date || "", 
        _method: "PUT",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("student-article.update", article.id));
    };

    return (
        <StudentAuthenticatedLayout
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
                            class="bg-red-100 mb-4 border-t-4 border-red-500 rounded-b-lg text-red-900 px-4 py-3 shadow-md"
                            role="alert"
                        >
                            <div class="flex">
                                <div class="py-1">
                                    <svg
                                        class="fill-current h-6 w-6 text-red-500 mr-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                    >
                                        <path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p class="font-bold">
                                        Revision/Rejection Message:
                                    </p>
                                    <p class="text-sm">
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
                                        className={`mt-2 block w-full ${
                                            article.status !== "pending" && article.status !== "rejected"
                                                ? "cursor-not-allowed bg-gray-200"
                                                : "cursor-pointer"
                                        }`}
                                        disabled={
                                            article.status !== "pending" && article.status !== "rejected"
                                                ? true
                                                : false
                                        }
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
                                        className="mt-2 block w-full cursor-pointer"
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
                                    className={`mt-2 block w-full ${
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? "cursor-not-allowed bg-gray-200"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? true
                                            : false
                                    }
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
                                    className={`mt-2 block w-full min-h-24 ${
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? "cursor-not-allowed bg-gray-200"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? true
                                            : false
                                    }
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

                                <TextAreaInput
                                    id="body"
                                    type="text"
                                    name="body"
                                    value={data.body}
                                    className={`mt-2 block w-full min-h-64 ${
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? "cursor-not-allowed bg-gray-200"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? true
                                            : false
                                    }
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
                                    className={`mt-2 block w-full ${
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? "cursor-not-allowed bg-gray-200"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? true
                                            : false
                                    }
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
                                    className={`mt-2 block w-full ${
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? "cursor-not-allowed bg-gray-200"
                                            : "cursor-pointer"
                                    }`}
                                    disabled={
                                        article.status !== "pending" && article.status !== "rejected"
                                            ? true
                                            : false
                                    }
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
                                    href={route("student-article.index")}
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
        </StudentAuthenticatedLayout>
    );
}
