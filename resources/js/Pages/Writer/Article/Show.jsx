import SecondaryButton from "@/Components/SecondaryButton";
import WriterAuthenticatedLayout from "@/Layouts/WriterAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, article }) {
    return (
        <WriterAuthenticatedLayout
            user={auth.user}
            header={
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        {`Title: ${article.title}`}
                    </h2>
                    {/* <div className="flex gap-4">
                        <Link
                            href={route("user.create")}
                            className="bg-emerald-500 py-1 px-3 text-white rounded shadow transition-all hover:bg-emerald-600"
                        >
                            Create New
                        </Link>
                    </div> */}
                </div>
            }
        >
            <Head title={`Article ${article.title}`} />
            {/* <pre className="text-gray-900">
                {JSON.stringify(article, null, 2)}
            </pre> */}
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative">
                            <img
                                src={article.article_image_path}
                                alt={article.name}
                                className="w-full h-96 object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full px-6 py-2 bg-slate-800 bg-opacity-50">
                                <p className="italic text-justify text-white text-xs">
                                    {article.caption}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col md:flex-row justify-between">
                                {/* ID */}
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full overflow-hidden w-14 h-14 border-2 border-indigo-500">
                                        {article.article_image_path && (
                                            <img
                                                src={
                                                    article.is_anonymous ===
                                                    "yes"
                                                        ? "/images/default/profile.jpg"
                                                        : article.article_image_path
                                                }
                                                className="object-cover w-full h-full"
                                                alt={
                                                    article.is_anonymous ===
                                                    "yes"
                                                        ? "Default image"
                                                        : article.article_image_path
                                                }
                                            />
                                        )}
                                    </div>
                                    {/* Information */}
                                    <div>
                                        <h4>
                                            Author:
                                            <span className="font-bold">
                                                {article.is_anonymous === "yes"
                                                    ? " Anonymous"
                                                    : article.createdBy.name}
                                            </span>
                                        </h4>
                                        <p className="mt-1">
                                            Published Date:
                                            <span className="font-bold">
                                                {" "}
                                                {article.published_date
                                                    ? article.published_date
                                                    : " Not Published"}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                {/* Information */}
                                <div>
                                    <h4>
                                        Category:{" "}
                                        <span className="font-bold">
                                            {article.category.name}
                                        </span>
                                    </h4>
                                    <p className="mt-1">
                                        Status:{" "}
                                        <span className="font-bold uppercase">
                                            {article.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="mt-4 text-gray-400">
                                <p>for testing</p>
                                <p>
                                    Edited by:
                                    {article.editedBy
                                        ? article.editedBy.name
                                        : "No Editor"}
                                </p>
                                <p> Layout By by:{article.layoutBy.name}</p>
                                {article.rejection_message && (
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
                                                    Rejection Message:
                                                </p>
                                                <p className="text-sm">
                                                    {article.rejection_message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            {/* Body */}
                            <div className="mt-8">
                                <p className="text-base text-justify whitespace-pre-line">
                                    {article.body}
                                </p>
                            </div>
                            {/* <div className="mt-12 text-right grid justify-items-end">
                                <div className="flex">
                                    <Link
                                        href={route("admin-article.edit", article.id)}
                                        className="bg-blue-600 py-1 px-3 text-blue-100 rounded shadow transition-all hover:bg-blue-500 mr-2"
                                    >
                                        Edit Article
                                    </Link>
                                    <Link
                                        href={route("admin-article.index")}
                                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Back
                                    </Link>
                                </div>
                            </div> */}
                            <div className="mt-6 flex justify-end gap-2">
                                <Link
                                    href={route(
                                        "writer-article.edit",
                                        article.id
                                    )}
                                    className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Edit Article
                                </Link>
                                <SecondaryButton
                                    href={route("writer-article.index")}
                                >
                                    Back
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </WriterAuthenticatedLayout>
    );
}
