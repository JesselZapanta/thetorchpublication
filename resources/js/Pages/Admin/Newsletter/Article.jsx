import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import Checkbox from "@/Components/Checkbox";
import ConfirmButton from "@/Components/ConfirmButton";
import Modal from "@/Components/Modal";
import Pagination from "@/Components/Pagination";
import SearchInput from "@/Components/SearchInput";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TableHeading from "@/Components/TableHeading";
import TextInput from "@/Components/TextInput";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";

export default function Index({
    auth,
    articles,
    categories,
    academicYears,
    queryParams = null,
    flash,
    AdminBadgeCount,
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

    queryParams = queryParams || {};

    const searchFieldChanged = (name, value) => {
        if (value === "") {
            delete queryParams[name]; // Remove the query parameter if input is empty
            router.get(route("newsletter.articles"), queryParams, {
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
                    route("newsletter.articles"),
                    {},
                    {
                        preserveState: true,
                    }
                ); // Fetch all data if search input is empty
            } else {
                queryParams[name] = value; // Set query parameter for search
                router.get(route("newsletter.articles"), queryParams, {
                    preserveState: true,
                });
            }
        }
    };

    // Handle dropdown select changes
    const handleSelectChange = (name, value) => {
        queryParams[name] = value;
        router.get(route("newsletter.articles"), queryParams, {
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
        router.get(route("newsletter.articles"), queryParams);
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

    //delete report and removeArticle article and addArticle
    const [confirmAction, setConfirmAction] = useState({
        type: "", // 'delete', 'removeArticle', or 'report'
        article: null,
        show: false,
    });

    const openActionModal = (article, actionType) => {
        setConfirmAction({
            type: actionType, // 'delete', 'removeArticle', or 'report'
            article: article,
            show: true,
        });
    };

    const handleAction = () => {
        if (confirmAction.article) {
            switch (confirmAction.type) {
                case "removeArticle":
                    router.post(
                        route(
                            "newsletter.remove-article",
                            confirmAction.article.id
                        ),
                        {
                            preserveScroll: true,
                            preserveState: true,
                        }
                    );
                    break;
                case "addArticle":
                    router.post(
                        route(
                            "newsletter.add-article",
                            confirmAction.article.id
                        ),
                        {
                            preserveScroll: true,
                            preserveState: true,
                        }
                    );
                    break;
                default:
                    break;
            }
        }
        setConfirmAction({ type: "", article: null, show: false });
    };

    const removeArticle = (article) => {
        openActionModal(article, "removeArticle");
    };

    const isNewsleter = (article) => {
        openActionModal(article, "addArticle");
    };

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semiboldsm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        List of Articles
                    </h2>
                    <div className="flex gap-4">
                        <SecondaryButton href={route("newsletter.index")}>
                            Back
                        </SecondaryButton>
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
                                            defaultValue={queryParams.category}
                                            onChange={(e) =>
                                                handleSelectChange(
                                                    "is_newsletter",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Is Newsletter
                                            </option>
                                            <option value="yes">Yes</option>
                                            <option value="no">No</option>
                                        </SelectInput>
                                    </div>
                                </div>
                                <div>
                                    <SearchInput
                                        className="w-full"
                                        defaultValue={queryParams.title}
                                        route={route("newsletter.articles")}
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
                            <div className="overflow-auto mt-2">
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
                                                name="published_date"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Published Date
                                            </TableHeading>

                                            <TableHeading
                                                name="is_newsletter"
                                                sort_field={
                                                    queryParams.sort_field
                                                }
                                                sort_direction={
                                                    queryParams.sort_direction
                                                }
                                                sortChanged={sortChanged}
                                            >
                                                Is Newsletter
                                            </TableHeading>
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
                                                                "admin-newsletter.article-show",
                                                                article.slug
                                                            )}
                                                        >
                                                            {truncate(
                                                                article.title,
                                                                50
                                                            )}
                                                        </Link>
                                                    </th>
                                                    <td className="px-3 py-2 text-nowrap w-[10%]">
                                                        {article.published_date}
                                                    </td>

                                                    <td className="px-3 py-2 text-nowrap">
                                                        {article.is_newsletter !==
                                                            "no" &&
                                                            article.is_newsletter !==
                                                                "added" && (
                                                                <button
                                                                    onClick={() =>
                                                                        removeArticle(
                                                                            article
                                                                        )
                                                                    }
                                                                    className="font-medium text-yellow-600 dark:text-yellow-500 hover:underline mx-1"
                                                                >
                                                                    Yes
                                                                </button>
                                                            )}
                                                        {article.is_newsletter !==
                                                            "yes" &&
                                                            article.is_newsletter !==
                                                                "added" && (
                                                                <button
                                                                    onClick={() =>
                                                                        isNewsleter(
                                                                            article
                                                                        )
                                                                    }
                                                                    className="font-medium text-teal-600 dark:teal-red-500 hover:underline mx-1"
                                                                >
                                                                    NO
                                                                </button>
                                                            )}
                                                        {article.is_newsletter ===
                                                            "added" && (
                                                            <span>Added</span>
                                                        )}
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
            {/* Confirm Modal */}
            <Modal
                show={confirmAction.show}
                onClose={() =>
                    setConfirmAction({ ...confirmAction, show: false })
                }
            >
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">
                        {confirmAction.type === "removeArticle"
                            ? "Remove this article to newsletter?"
                            : "Add this article to newsletter?"}
                    </h2>
                    <p className="mt-4">
                        {confirmAction.type === "removeArticle"
                            ? "Are you sure you want to remove this article?"
                            : "Are you sure you want to add this article?"}
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() =>
                                setConfirmAction({
                                    ...confirmAction,
                                    show: false,
                                })
                            }
                        >
                            Cancel
                        </SecondaryButton>
                        <ConfirmButton onClick={handleAction} className="ml-2">
                            {confirmAction.type === "removeArticle"
                                ? "Remove"
                                : "Add"}
                        </ConfirmButton>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
