import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import { ARTICLE_STATUS_CLASS_MAP, ARTICLE_STATUS_TEXT_MAP } from "@/constants";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";

import {
    PencilSquareIcon,
    ListBulletIcon,
    AdjustmentsHorizontalIcon,
    ArchiveBoxIcon,
    TrashIcon,
} from "@heroicons/react/16/solid";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Dropdown from "@/Components/Dropdown";
import DropdownAction from "@/Components/DropdownAction";
import SearchInput from "@/Components/SearchInput";

export default function Index({
    auth,
    articles,
    categories,
    academicYears,
    queryParams = null,
    flash,
    StudentBadgeCount,
}) {
    // Display flash messages if they exist
    useEffect(() => {
        // console.log(flash);
        if (flash.message.success) {
            toast.success(flash.message.success);
        }
        if (flash.message.error) {
            toast.error(flash.message.error);
        }
    }, [flash]);

    // useEffect(() => {
    //     router.get(route("student-article.index"), queryParams, {
    //         preserveState: true,
    //     });
    // }, []);

    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("student-article.index"), queryParams, {
                preserveState: true,
            }); // Fetch all data when search is empty
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
                    route("student-article.index"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("student-article.index"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("student-article.index"), queryParams, {
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
        router.get(route("student-article.index"), queryParams);
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
            router.delete(route("student-article.destroy", article.id));
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

    return (
        <StudentAuthenticatedLayout
            StudentBadgeCount={StudentBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-md lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Articles
                    </h2>
                    {/* <div className="flex gap-2">
                        <Link
                            href={route("student-article.calendar")}
                            className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                        >
                            Calendar
                        </Link>
                        <Link
                            href={route("student-article.create")}
                            className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                        >
                            Create New
                        </Link>
                    </div> */}
                    <div className="flex items-center relative">
                        {/* show in large screen */}
                        <div className="hidden lg:block">
                            <div className="flex gap-2">
                                <Link
                                    href={route("student-article.calendar")}
                                    className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                >
                                    Calendar
                                </Link>
                                <Link
                                    href={route("student-article.create")}
                                    className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Create New
                                </Link>
                            </div>
                        </div>
                        <div className="block lg:hidden">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div className="flex p-2 cursor-pointer justify-center items-center  text-nowrap bg-sky-600 text-gray-50 transition-all duration-300 rounded hover:bg-sky-700">
                                        <AdjustmentsHorizontalIcon className="w-6 text-gray-50" />
                                        Options
                                        {StudentBadgeCount.rejectedArticleCount >
                                            0 && (
                                            <>
                                                <span className="flex justify-center items-center min-w-5 h-5 -mt-5 rounded-full p-1 bg-red-500 text-gray-100">
                                                    {StudentBadgeCount.rejectedArticleCount >
                                                    9
                                                        ? "9+"
                                                        : StudentBadgeCount.rejectedArticleCount}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Link
                                        href={route("student-article.calendar")}
                                        className="px-4 py-2 text-nowrap bg-teal-600 text-gray-50 transition-all duration-300 rounded hover:bg-teal-700"
                                    >
                                        Calendar
                                    </Link>
                                    <Link
                                        href={route("student-article.create")}
                                        className="px-4 py-2 bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700"
                                    >
                                        Create New
                                    </Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>
            }
        >
            <Head title="Articles" />

            <ToastContainer position="bottom-right" />

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            {/* sort and search */}
                            <div className="w-full grid lg:grid-cols-2 gap-2">
                                <div className="flex gap-2">
                                    <div className="w-full">
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
                                            {academicYears.data.map((ay) => (
                                                <option
                                                    key={ay.id}
                                                    value={ay.code}
                                                >
                                                    {ay.description}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div className="w-full">
                                        <SelectInput
                                            className="w-full"
                                            defaultValue={queryParams.category}
                                            onChange={(e) =>
                                                handleSelectChange(
                                                    "category",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Category</option>
                                            {categories.data.map((category) => (
                                                <option
                                                    key={category.id}
                                                    value={category.name}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </SelectInput>
                                    </div>
                                    <div className="w-full">
                                        <SelectInput
                                            className="w-full"
                                            defaultValue={queryParams.status}
                                            onChange={(e) =>
                                                handleSelectChange(
                                                    "status",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Status</option>
                                            <option value="draft">Draft</option>
                                            <option value="pending">
                                                Pending
                                            </option>
                                            <option value="edited">
                                                Edited
                                            </option>
                                            <option value="rejected">
                                                Rejected
                                            </option>
                                            <option value="revision">
                                                Revision
                                            </option>
                                            <option value="published">
                                                Published
                                            </option>
                                        </SelectInput>
                                    </div>
                                </div>
                                <div>
                                    <SearchInput
                                        className="w-full"
                                        defaultValue={queryParams.title}
                                        route={route("student-article.index")}
                                        queryParams={queryParams}
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
                                </div>
                            </div>
                            <div className="overflow-auto mt-2 pb-12">
                                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
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
                                                name="is_anonymous"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Anonymous
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
                                                        {article.category.name}
                                                    </td>
                                                    <th className="px-3 py-2 text-gray-100 text-nowrap hover:underline">
                                                        <Link
                                                            // added
                                                            className="text-md text-gray-900 dark:text-gray-300"
                                                            href={route(
                                                                "student-article.show",
                                                                article.slug
                                                            )}
                                                        >
                                                            {truncate(
                                                                article.title,
                                                                50
                                                            )}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap uppercase">
                                                        {article.is_anonymous}
                                                    </td>
                                                    <td className="px-3 py-2 text-nowrap">
                                                        {/* {article.status} */}
                                                        <span
                                                            className={
                                                                "px-2 py-1 rounded text-white " +
                                                                ARTICLE_STATUS_CLASS_MAP[
                                                                    article
                                                                        .status
                                                                ]
                                                            }
                                                        >
                                                            {
                                                                ARTICLE_STATUS_TEXT_MAP[
                                                                    article
                                                                        .status
                                                                ]
                                                            }
                                                        </span>
                                                    </td>
                                                    {/* <td className="px-3 py-2 text-nowrap">
                                                        <Link
                                                            href={route(
                                                                "student-article.edit",
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
                                                    </td> */}
                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        <div className="flex items-center relative">
                                                            <DropdownAction>
                                                                <DropdownAction.Trigger>
                                                                    <div className="flex w-12 p-2 cursor-pointer justify-center items-center  text-nowrap bg-indigo-600 text-gray-50 transition-all duration-300 rounded hover:bg-indigo-700">
                                                                        <ListBulletIcon className="w-6" />
                                                                    </div>
                                                                </DropdownAction.Trigger>

                                                                <DropdownAction.Content>
                                                                    <DropdownAction.Link
                                                                        href={route(
                                                                            "student-article.edit",
                                                                            article.slug
                                                                        )}
                                                                    >
                                                                        <PencilSquareIcon className="w-6 text-sky-600" />
                                                                        Edit
                                                                    </DropdownAction.Link>
                                                                    <DropdownAction.Btn
                                                                        onClick={() =>
                                                                            openDeleteModal(
                                                                                article
                                                                            )
                                                                        }
                                                                    >
                                                                        <ArchiveBoxIcon className="w-6 text-red-600" />
                                                                        Archive
                                                                    </DropdownAction.Btn>
                                                                </DropdownAction.Content>
                                                            </DropdownAction>
                                                        </div>
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
                    <h2 className="text-base font-bold">Confirm archive</h2>
                    <p className="mt-4">
                        Are you sure you want to archive this article?
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() => setConfirmDelete(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleDelete} className="ml-2">
                            Archive
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </StudentAuthenticatedLayout>
    );
}
