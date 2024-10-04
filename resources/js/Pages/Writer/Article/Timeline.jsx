import SecondaryButton from "@/Components/SecondaryButton";
import WriterAuthenticatedLayout from "@/Layouts/WriterAuthenticatedLayout";
import { Head } from "@inertiajs/react";


export default function Timeline({ auth, article, WriterBadgeCount }) {
    return (
        <WriterAuthenticatedLayout
            WriterBadgeCount={WriterBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Timeline : {article.title}
                    </h2>
                    <div className="flex gap-4">
                        <SecondaryButton href={route("writer-article.index")}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }
        >
            <Head title={article.name} />
            {/* <pre className="text-gray-900">
                {JSON.stringify(article, null, 2)}
            </pre> */}
            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div className="p-4">
                            <ol className="relative ms-6 border-s border-indigo-500 dark:border-gray-700">
                                {article.submitted_at && article.createdBy && (
                                    <li className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                            <img
                                                className="rounded-full shadow-lg"
                                                src={
                                                    article.createdBy
                                                        .profile_image_path
                                                }
                                                alt={article.createdBy.name}
                                            />
                                        </span>
                                        <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                {article.submitted_at}
                                            </time>
                                            <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {article.createdBy.name}
                                                </span>{" "}
                                                submitted the article.
                                            </p>
                                        </div>
                                    </li>
                                )}

                                {article.rejected_at && article.editedBy && (
                                    <li className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                            <img
                                                className="rounded-full shadow-lg"
                                                src={
                                                    article.editedBy
                                                        .profile_image_path
                                                }
                                                alt={article.editedBy.name}
                                            />
                                        </span>
                                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                            <div className="items-center justify-between mb-3 sm:flex">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {article.rejected_at}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {article.editedBy.name}
                                                    </span>{" "}
                                                    set the article status to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        rejected.
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                                                {article.rejection_message}
                                            </div>
                                        </div>
                                    </li>
                                )}

                                {article.edited_at && article.editedBy && (
                                    <li className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                            <img
                                                className="rounded-full shadow-lg"
                                                src={
                                                    article.editedBy
                                                        .profile_image_path
                                                }
                                                alt={article.editedBy.name}
                                            />
                                        </span>
                                        <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                {article.edited_at}
                                            </time>
                                            <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {article.editedBy.name}
                                                </span>{" "}
                                                set the article status to{" "}
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    edited.
                                                </span>
                                            </p>
                                        </div>
                                    </li>
                                )}

                                {article.revision_at && article.revisionBy && (
                                    <li className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                            <img
                                                className="rounded-full shadow-lg"
                                                src={
                                                    article.revisionBy
                                                        .profile_image_path
                                                }
                                                alt={article.revisionBy.name}
                                            />
                                        </span>
                                        <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                            <div className="items-center justify-between mb-3 sm:flex">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {article.revision_at}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {
                                                            article.revisionBy
                                                                .name
                                                        }
                                                    </span>{" "}
                                                    set the article status to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        need revision.
                                                    </span>
                                                </p>
                                            </div>
                                            <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                                                {article.revision_message}
                                            </div>
                                        </div>
                                    </li>
                                )}

                                {article.published_date &&
                                    article.publishedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        article.publishedBy
                                                            .profile_image_path
                                                    }
                                                    alt={
                                                        article.publishedBy.name
                                                    }
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {article.published_date}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {
                                                            article.publishedBy
                                                                .name
                                                        }
                                                    </span>{" "}
                                                    set the article status to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        published.
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    )}
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </WriterAuthenticatedLayout>
    );
}
