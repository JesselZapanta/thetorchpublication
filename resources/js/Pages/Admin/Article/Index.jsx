import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";

export default function Index({
    auth,
    articles,
    success,
    delete_success,
    queryParams = null,
}) {
    const [confirmDelete, setConfirmDelete] = useState(false);

    queryParams = queryParams || {};
    const searchFieldChanged = (name, value) => {
        if (value) {
            queryParams[name] = value;
        } else {
            delete queryParams[name];
        }

        router.get(route("article.index"), queryParams);
    };

    const onKeyPressed = (name, e) => {
        if (e.key !== "Enter") return;

        searchFieldChanged(name, e.target.value);
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
        router.get(route("article.index"), queryParams);
    };

    // Delete
    const handleDelete = (article) => {
        router.delete(route("article.destroy", article.id));
        closeModal();
    };

    const confirmDeletion = () => {
        setConfirmDelete(true);
    };

    const closeModal = () => {
        setConfirmDelete(false);
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Articles
                    </h2>
                    <div className="flex gap-4">
                        <Link
                            href={route("article.create")}
                            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                        >
                            Create New
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="Articles" />
            {/* {<pre>{JSON.stringify(users, null, 2)}</pre>} */}
            {/* Alert */}
            {success && <AlertSuccess message={success} />}
            {delete_success && <AlertSuccess message={delete_success} />}
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    {/* Thead with search */}
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
                                        <tr text-text-nowrap="true">
                                            <th
                                                className="px-3 py-3"
                                                colSpan="3"
                                            >
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.created_by
                                                    }
                                                    placeholder="Search Author Name"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "created_by",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed(
                                                            "created_by",
                                                            e
                                                        )
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3">
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.category
                                                    }
                                                    placeholder="Search Category"
                                                    onBlur={(e) =>
                                                        searchFieldChanged(
                                                            "category",
                                                            e.target.value
                                                        )
                                                    }
                                                    onKeyPress={(e) =>
                                                        onKeyPressed(
                                                            "category",
                                                            e
                                                        )
                                                    }
                                                />
                                            </th>
                                            <th className="px-3 py-3">
                                                <TextInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.title
                                                    }
                                                    placeholder="Search Article Name"
                                                    onBlur={(e) =>
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
                                            <th className="px-3 py-3">
                                                <SelectInput
                                                    className="w-full"
                                                    defaultValue={
                                                        queryParams.status
                                                    }
                                                    onChange={(e) =>
                                                        searchFieldChanged(
                                                            "status",
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option value="">
                                                        Select Status
                                                    </option>
                                                    <option value="pending">
                                                        Pending
                                                    </option>
                                                    <option value="published">
                                                        Published
                                                    </option>
                                                </SelectInput>
                                            </th>
                                            <th className="px-3 py-3"></th>
                                        </tr>
                                    </thead>
                                    {/* Thhead with sorting */}
                                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 border-b-2 border-gray-500">
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
                                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                                    key={article.id}
                                                >
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {article.id}
                                                    </td>
                                                    <th className="px-3 py-2 text-nowrap">
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
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {article.createdBy.name}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {article.category.name}
                                                    </td>
                                                    <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            href={route(
                                                                "article.show",
                                                                article.id
                                                            )}
                                                        >
                                                            {article.title
                                                                .length > 20
                                                                ? `${article.title.substring(
                                                                      0,
                                                                      50
                                                                  )}...`
                                                                : article.title}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {article.status}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        <Link
                                                            href={route(
                                                                "article.edit",
                                                                article.id
                                                            )}
                                                            className="font-medium text-blue-600 dark:text-blue-500 hover:underline mx-1"
                                                        >
                                                            Edit
                                                        </Link>
                                                        <button
                                                            onClick={
                                                                confirmDeletion
                                                            }
                                                            className="font-medium text-red-600 dark:text-red-500 hover:underline mx-1"
                                                        >
                                                            Delete
                                                        </button>
                                                        <Modal
                                                            show={confirmDelete}
                                                        >
                                                            <div
                                                                onClose={
                                                                    closeModal
                                                                }
                                                                className="p-6"
                                                            >
                                                                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                                                    Are you sure
                                                                    you want to
                                                                    delete this
                                                                    Article?
                                                                </h2>
                                                                <div className="mt-6 flex justify-end">
                                                                    <SecondaryButton
                                                                        onClick={
                                                                            closeModal
                                                                        }
                                                                    >
                                                                        Cancel
                                                                    </SecondaryButton>

                                                                    <DangerButton
                                                                        className="ms-3"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                article
                                                                            )
                                                                        }
                                                                    >
                                                                        Delete
                                                                        Article
                                                                    </DangerButton>
                                                                </div>
                                                            </div>
                                                        </Modal>
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
        </AuthenticatedLayout>
    );
}
