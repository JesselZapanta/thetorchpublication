import SecondaryButton from "@/Components/SecondaryButton";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, article }) {
    return (
        <AdminAuthenticatedLayout
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
                                                    article.author
                                                        ? "/images/default/profile.jpg"
                                                        : article.is_anonymous ===
                                                          "yes"
                                                        ? "/images/default/profile.jpg"
                                                        : article.article_image_path
                                                }
                                                className="object-cover w-full h-full"
                                                alt={
                                                    article.is_anonymous ===
                                                    "yes"
                                                        ? "Default image"
                                                        : article.createdBy.name
                                                }
                                            />
                                        )}
                                    </div>
                                    {/* Information */}
                                    <div>
                                        <h4>
                                            Author:
                                            <span className="font-bold">
                                                {article.author
                                                    ? article.author
                                                    : article.is_anonymous ===
                                                      "yes"
                                                    ? "Anonymous"
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
                            </div>
                            {/* Body */}
                            <div className="mt-8">
                                <p className="text-base text-justify whitespace-pre-line">
                                    {article.body}
                                </p>
                            </div>
                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("newsletter.articles")}
                                >
                                    Back
                                </SecondaryButton>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
