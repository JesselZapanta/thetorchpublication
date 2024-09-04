import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Edit({ auth, category }) {
    const { data, setData, post, errors } = useForm({
        name: category.name || "",
        description: category.description || "",
        status: category.status || "",
        category_image_path: "",
        _method: "PUT",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("category.update", category.id));
    };

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Edit Category{" "}
                        <span className="italic ">"{category.name}"</span>
                    </h2>
                </div>
            }
        >
            <Head title={`Edit ${category.name}`} />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            {/* name */}
                            <div>
                                <InputLabel
                                    htmlFor="name"
                                    value="Category Name"
                                />

                                <TextInput
                                    id="name"
                                    type="text"
                                    name="name"
                                    value={data.name}
                                    className="mt-2 block w-full"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>
                            {/* description */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="description"
                                    value="Category Description"
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
                            {/* Status */}
                            <div className="mt-2 w-full">
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
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </SelectInput>

                                <InputError
                                    message={errors.status}
                                    className="mt-2"
                                />
                            </div>
                            {/* image path */}
                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="category_image_path"
                                    value="Category Image"
                                />

                                <TextInput
                                    id="category_image_path"
                                    type="file"
                                    name="category_image_path"
                                    className="mt-2 block w-full cursor-pointer"
                                    onChange={(e) =>
                                        setData(
                                            "category_image_path",
                                            e.target.files[0]
                                        )
                                    }
                                />

                                <InputError
                                    message={errors.category_image_path}
                                    className="mt-2"
                                />
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton href={route("category.index")}>
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
