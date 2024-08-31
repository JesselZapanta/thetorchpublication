import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Create({ auth, categories }) {
    const { data, setData, post, errors } = useForm({
        title: "",
        category_id: "",
        body: "",
        status: "",
        caption: "",
        article_image_path: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("article.store", data));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Create New Article
                    </h2>
                </div>
            }
        >
            <Head title="Create New Article" />

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            {/* category */}
                            <div className="mt-2 w-full">
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
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.title}
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
                            {/* Status */}
                            <div className="mt-2 w-full">
                                <InputLabel
                                    htmlFor="status"
                                    value="Article status"
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
                                </SelectInput>

                                <InputError
                                    message={errors.status}
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
                                <SecondaryButton href={route("article.index")}>
                                    Cancel
                                </SecondaryButton>
                                <button className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700">
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
