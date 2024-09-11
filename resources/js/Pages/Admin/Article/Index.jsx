import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    auth,
    articles,
    categories,
    academicYears,
    success,
    queryParams = null,
}) {
    queryParams = queryParams || {};
    
    // const searchFieldChanged = (name, value) => {
    //     if (value === "") {
    //         delete queryParams[name];
    //         router.get(route("admin-article.index"), queryParams, {
    //             preserveState: true,
    //         });
    //     }
    //     if (value) {
    //         queryParams[name] = value;
    //         router.get(route("admin-article.index"), queryParams, {
    //             preserveState: true,
    //         });
    //     }
    // };

    // // Search on Enter key press
    // const onKeyPressed = (name, e) => {
    //     const value = e.target.value;

    //     if (e.key === "Enter") {
    //         e.preventDefault(); // Prevent default form submission
    //         if (value) {
    //             queryParams[name] = value; // Update query params if value is provided
    //         }
    //         router.get(route("admin-article.index"), queryParams, {
    //             preserveState: true,
    //         });
    //     }
    // };

    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(
                route("admin-article.index"),
                queryParams,
                {
                    preserveState: true,
                }
            ); // Fetch all data when search is empty
        } else {
            queryParams[name] = value; // Set query parameter
        }
    };

    // Trigger search on Enter key press
    const onKeyPressed = (name, e) => {
        const value = e.target.value;

        if (e.key === "Enter") {
            e.preventDefault(); // Prevent default form submission
            if (value.trim() === "") {
                delete queryParams[name]; // Remove query parameter if search is empty
                router.get(
                    route("admin-article.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(
                    route("admin-article.index"),
                    queryParams,
                    {
                        preserveState: true,
                    }
                );
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("admin-article.index"), queryParams, {
            preserveState: true,
        });
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
        router.get(route("admin-article.index"), queryParams);
    };

    // Open modal and set article to delete

    const [confirmDelete, setConfirmDelete] = useState(false);

    const [article, setArticle] = useState(null); // For storing the article to edit/delete
    const openDeleteModal = (article) => {
        setArticle(article);
        setConfirmDelete(true);
    };

    // Handle delete and close modal
    const handleDelete = () => {
        if (article) {
            router.delete(route("admin-article.destroy", article.id));
        }
        setConfirmDelete(false);
        setArticle(null);
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    //Flash alerts
    const { flash } = usePage().props;

    return (
        <AdminAuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Articles
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route("admin-article.create")}
                            className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Create New
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Articles" />
            <AlertSuccess flash={flash} />
            <AlertError flash={flash} />
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
                                                className="px-3 py-3 w-[5%]"
                                                colSpan="2"
                                            >
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.academic_year_id
                                                    }
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            "academic_year_id",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">AY</option>
                                                    {academicYears.data.map(
                                                        (ay) => (
                                                            <option
                                                                key={ay.id}
                                                                value={ay.code}
                                                            >
                                                                {ay.description}
                                                            </option>
                                                        )
                                                    )}
                                                </SelectInput>
                                            </th>
                                            <th
                                                className="px-3 py-3 w-[5%]"
                                                colSpan="1"
                                            >
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.myArticle
                                                    }
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            "myArticle",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        All
                                                    </option>
                                                    {/* <option value={auth.user.id}> */}
                                                    <option value="myArticle">
                                                        My Article
                                                    </option>
                                                </SelectInput>
                                            </th>

                                            <th className="px-3 py-3 w-[10%]">
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.category
                                                    }
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            "category",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Category
                                                    </option>
                                                    {categories.data.map(
                                                        (category) => (
                                                            <option
                                                                key={
                                                                    category.id
                                                                }
                                                                value={
                                                                    category.name
                                                                }
                                                            >
                                                                {category.name}
                                                            </option>
                                                        )
                                                    )}
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3 w-[50%]">
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.title
                                                    }
                                                    placeholder="Search Article Title"
                                                    onChange={(e) =>
                                                        searchFieldChanged(
                                                            "title",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed("title", e)
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3 w-[10%]">
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.status
                                                    }
                                                    onChange={(e) =>
                                                        handleSelectChange(
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Status
                                                    </option>
                                                    <option value="edited">
                                                        Edited
                                                    </option>
                                                    <option value="published">
                                                        Published
                                                    </option>
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3 w-[10%]"></th>
                                        </tr>
                                    </thead>
                                    {/* Thhead with sorting */}
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
                                            <th className="px-3 py-3">Image</th>
                                            <TableHeading
                                                name="created_by"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Author
                                            </TableHeading>
                                            <TableHeading
                                                name="category_id"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Category
                                            </TableHeading>
                                            <TableHeading
                                                name="title"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Title
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
                                            <th className="px-3 py-3">
                                                Action
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {articles.data.length > 0 ? (
                                            articles.data.map((article) => (
                                                <tr
                                                    //added
                                                    className="text-base text-gray-900 bg-gray-50 dark:bg-gray-800 dark:text-gray-400 border-b dark:border-gray-700"
                                                    key={article.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap w-[5%]">
                                                        {article.id}
                                                    </td>
                                                    <th className="px-3 py-2 text-nowrap w-[5%]">
                                                        <div className="rounded-full overflow-hidden w-10 h-10 border-2 border-indigo-500">
                                                            {article.article_image_path && (
                                                                <img
                                                                    src={
                                                                        article.article_image_path
                                                                    }
                                                                    className="object-cover w-full h-full"
                                                                    alt={
                                                                        article.article_image_path
                                                                    }
                                                                />
                                                            )}
                                                        </div>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        {article.is_anonymous ===
                                                        "yes"
                                                            ? "Anonymous"
                                                            : truncate(
                                                                  article
                                                                      .createdBy
                                                                      .name,
                                                                  10
                                                              )}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        {article.category.name}
                                                    </td>
                                                    <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline w-[50%]">
                                                        <Link
                                                            // added
                                                            className="text-md text-gray-900 dark:text-gray-300"
                                                            href={route(
                                                                "admin-article.show",
                                                                article.id
                                                            )}
                                                        >
                                                            {truncate(
                                                                article.title,
                                                                50
                                                            )}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        {article.status}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        <Link
                                                            href={route(
                                                                "admin-article.edit",
                                                                article.id
                                                            )}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={() =>
                                                                openDeleteModal(
                                                                    article
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
                                links={articles.meta.links}
                                queryParams={queryParams}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {/* Confirm Delete Modal */}
            <Modal show={confirmDelete} onClose={() => setConfirmDelete(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Delete</h2>
                    <p className="mt-4">
                        Are you sure you want to delete this Article?
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
