import SecondaryButton from "@/Components/SecondaryButton";
import WriterAuthenticatedLayout from "@/Layouts/WriterAuthenticatedLayout";
import { Head } from "@inertiajs/react";


export default function Timeline({ auth, task, WriterBadgeCount }) {
    return (
        <WriterAuthenticatedLayout
            WriterBadgeCount={WriterBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-md lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Timeline : {task.name}
                    </h2>
                    {/* <div className="flex gap-4">
                        <SecondaryButton href={route("writer-task.index")}>
                            Back
                        </SecondaryButton>
                    </div> */}
                </div>
            }
        >
            <Head title={task.name} />
            {/* <pre className="text-gray-900">{JSON.stringify(task, null, 2)}</pre> */}
            <div className="py-4">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="flex justify-end  gap-4">
                        <SecondaryButton href={route("writer-task.index")}>
                            Back
                        </SecondaryButton>
                    </div>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg mt-4">
                        <div className="p-4">
                            <ol className="relative ms-6 border-s border-indigo-500 dark:border-gray-700">
                                {task.assigned_date && task.assignedBy && (
                                    <li className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                            <img
                                                className="rounded-full shadow-lg"
                                                src={
                                                    task.assignedBy
                                                        .profile_image_path
                                                }
                                                alt="Bonnie image"
                                            />
                                        </span>
                                        <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                {task.assigned_date}
                                            </time>
                                            <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {task.assignedBy.name}
                                                </span>{" "}
                                                assigned a task to{" "}
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {task.assignedTo.name}
                                                </span>{" "}
                                                and{" "}
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {task.layoutBy.name}
                                                </span>
                                            </p>
                                        </div>
                                    </li>
                                )}

                                {task.content_submitted_date &&
                                    task.assignedTo && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        task.assignedTo
                                                            .profile_image_path
                                                    }
                                                    alt="Bonnie image"
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {
                                                        task.content_submitted_date
                                                    }
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {task.assignedTo.name}
                                                    </span>{" "}
                                                    submitted the task content
                                                    to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {task.assignedBy.name}
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    )}

                                {task.content_revision_date &&
                                    task.assignedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        task.assignedBy
                                                            .profile_image_path
                                                    }
                                                    alt={task.assignedBy.name}
                                                />
                                            </span>
                                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                                <div className="items-center justify-between mb-3 sm:flex">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                        {
                                                            task.content_revision_date
                                                        }
                                                    </time>
                                                    <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                            {
                                                                task.assignedBy
                                                                    .name
                                                            }
                                                        </span>{" "}
                                                        set the task status to{" "}
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                            content needed
                                                            revision
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                                                    {
                                                        task.content_revision_message
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                {task.content_approved_date &&
                                    task.assignedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        task.assignedBy
                                                            .profile_image_path
                                                    }
                                                    alt={task.assignedBy.name}
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {task.content_approved_date}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {task.assignedBy.name}
                                                    </span>{" "}
                                                    sets the submitted content
                                                    to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        approved
                                                    </span>{" "}
                                                    after which the content is
                                                    forwarded to{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {task.layoutBy.name}
                                                    </span>
                                                </p>
                                            </div>
                                        </li>
                                    )}

                                {task.image_submitted_date && task.layoutBy && (
                                    <li className="mb-10 ml-6">
                                        <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                            <img
                                                className="rounded-full shadow-lg"
                                                src={
                                                    task.layoutBy
                                                        .profile_image_path
                                                }
                                                alt={task.layoutBy.name}
                                            />
                                        </span>
                                        <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                            <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                {task.image_submitted_date}
                                            </time>
                                            <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {task.layoutBy.name}
                                                </span>{" "}
                                                submit the infographics or image
                                                for the content after which the
                                                image is forwarded to{" "}
                                                <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                    {task.assignedBy.name}
                                                </span>
                                            </p>
                                        </div>
                                    </li>
                                )}

                                {task.image_revision_date &&
                                    task.assignedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        task.assignedBy
                                                            .profile_image_path
                                                    }
                                                    alt={task.assignedBy.name}
                                                />
                                            </span>
                                            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-700 dark:border-gray-600">
                                                <div className="items-center justify-between mb-3 sm:flex">
                                                    <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                        {
                                                            task.image_revision_date
                                                        }
                                                    </time>
                                                    <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                            {
                                                                task.assignedBy
                                                                    .name
                                                            }
                                                        </span>{" "}
                                                        set the task status to{" "}
                                                        <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                            image needed
                                                            revision
                                                        </span>
                                                    </p>
                                                </div>
                                                <div className="p-3 text-xs italic font-normal text-gray-500 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-600 dark:border-gray-500 dark:text-gray-300">
                                                    {
                                                        task.image_revision_message
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                    )}

                                {task.task_completed_date &&
                                    task.assignedBy && (
                                        <li className="mb-10 ml-6">
                                            <span className="absolute flex items-center justify-center w-10 h-10  rounded-full -start-5  border-2 border-indigo-500 ">
                                                <img
                                                    className="rounded-full shadow-lg"
                                                    src={
                                                        task.assignedBy
                                                            .profile_image_path
                                                    }
                                                    alt={task.assignedBy.name}
                                                />
                                            </span>
                                            <div className="items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm sm:flex dark:bg-gray-700 dark:border-gray-600">
                                                <time className="mb-1 text-xs font-normal text-gray-400 sm:order-last sm:mb-0">
                                                    {task.task_completed_date}
                                                </time>
                                                <p className="text-sm font-normal text-gray-500 dark:text-gray-300">
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        {task.assignedBy.name}
                                                    </span>{" "}
                                                    approved and published the
                                                    task, the task is now{" "}
                                                    <span className="font-semibold text-indigo-600 dark:text-indigo-500">
                                                        completed
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
