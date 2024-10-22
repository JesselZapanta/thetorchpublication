import SecondaryButton from "@/Components/SecondaryButton";
import DesignerAuthenticatedLayout from "@/Layouts/DesignerAuthenticatedLayout";
import { Head } from "@inertiajs/react";


export default function Timeline({ auth, newsletter, DesignerBadgeCount }) {
    return (
        <DesignerAuthenticatedLayout
            DesignerBadgeCount={DesignerBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Timeline : {newsletter.description}
                    </h2>
                    {/* <div className="flex gap-4">
                        <SecondaryButton
                            href={route("designer-newsletter.index")}
                        >
                            Back
                        </SecondaryButton>
                    </div> */}
                </div>
            }
        >
            <Head title={newsletter.description} />
            {/* <pre className="text-gray-900">{JSON.stringify(newsletter, null, 2)}</pre> */}
            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end  gap-4">
                        <SecondaryButton
                            href={route("designer-newsletter.index")}
                        >
                            Back
                        </SecondaryButton>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div className="p-4">
                            <ol className="relative ms-6 border-s border-indigo-500 dark:border-gray-700">
                                {/* submitted */}
                                {newsletter.submitted_at &&
                                    newsletter.layoutBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        newsletter.layoutBy
                                                            .profile_image_path
                                                    }
                                                    alt={
                                                        newsletter.layoutBy.name
                                                    }
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {newsletter.submitted_at}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {
                                                            newsletter.layoutBy
                                                                .name
                                                        }
                                                    </span>{" "}
                                                    submitted the newsletter.
                                                </p>
                                            </div>
                                        </li>
                                    )}

                                {newsletter.revision_at &&
                                    newsletter.revisionBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        newsletter.revisionBy
                                                            .profile_image_path
                                                    }
                                                    alt={
                                                        newsletter.revisionBy
                                                            .name
                                                    }
                                                />
                                            </span>
                                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                                <div className="items-center justify-between mb-3 sm:flex">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                        {newsletter.revision_at}
                                                    </time>
                                                    <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                            {
                                                                newsletter
                                                                    .revisionBy
                                                                    .name
                                                            }
                                                        </span>{" "}
                                                        set the newsletter
                                                        status to{" "}
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                            need revision.
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                                                    {
                                                        newsletter.revision_message
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                {newsletter.approved_at &&
                                    newsletter.approvedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        newsletter.approvedBy
                                                            .profile_image_path
                                                    }
                                                    alt={
                                                        newsletter.approvedBy
                                                            .name
                                                    }
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {newsletter.approved_at}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {
                                                            newsletter
                                                                .approvedBy.name
                                                        }
                                                    </span>{" "}
                                                    set the newsletter status to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        approved.
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    )}

                                {newsletter.distributed_at &&
                                    newsletter.distributedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        newsletter.distributedBy
                                                            .profile_image_path
                                                    }
                                                    alt={
                                                        newsletter.distributedBy
                                                            .name
                                                    }
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {newsletter.distributed_at}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {
                                                            newsletter
                                                                .distributedBy
                                                                .name
                                                        }
                                                    </span>{" "}
                                                    set the newsletter status to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        distributed.
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
        </DesignerAuthenticatedLayout>
    );
}
