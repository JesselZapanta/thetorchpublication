import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";

export default function Index({ auth, article }) {
    return (
        <AuthenticatedLayout
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
                                    {/* {article.caption} */}
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Quasi sed reprehenderit
                                    iste autem eos facere ipsa maxime tempore
                                    illo velit.
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
                                                    article.createdBy
                                                        .profile_image_path
                                                }
                                                className="object-cover w-full h-full"
                                                alt={article.article_image_path}
                                            />
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">
                                            Author: {article.createdBy.name}
                                        </h4>
                                        <p className="mt-1">
                                            Publish: {article.created_at}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">
                                        Category: {article.category.name}
                                    </h4>
                                    <p className="mt-1">
                                        Status: {article.status}
                                    </p>
                                </div>
                            </div>
                            {/* Body */}
                            <div className="mt-8">
                                <p className="text-base text-justify whitespace-pre-line">
                                    {article.body}
                                </p>
                            </div>
                            <div className="mt-12 text-right grid justify-items-end">
                                <div className="flex">
                                    <Link
                                        href={route("article.edit", article.id)}
                                        className="bg-blue-600 py-1 px-3 text-blue-100 rounded shadow transition-all hover:bg-blue-500 mr-2"
                                    >
                                        Edit Article
                                    </Link>
                                    <Link
                                        href={route("article.index")}
                                        className="bg-gray-100 py-1 px-3 text-gray-800 rounded shadow transition-all hover:bg-gray-200 mr-2"
                                    >
                                        Back
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
