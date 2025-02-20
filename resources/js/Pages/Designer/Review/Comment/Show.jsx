import SecondaryButton from "@/Components/SecondaryButton";
import DesignerAuthenticatedLayout from "@/Layouts/DesignerAuthenticatedLayout";
import { Head, Link, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";


export default function Index({ auth, article, comment, DesignerBadgeCount }) {
    const commentRef = useRef(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (commentRef.current) {
                commentRef.current.scrollIntoView({ behavior: "smooth" });
            }
        }, 100); // Adjust the timeout as needed
        return () => clearTimeout(timer);
    }, []);
    return (
        <DesignerAuthenticatedLayout
            DesignerBadgeCount={DesignerBadgeCount}
            user={auth.user}
            header={
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        {`Title: ${comment.article.title}`}
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
            <Head title={`Article ${comment.article.title}`} />
            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative">
                            <img
                                src={comment.article.article_image_path}
                                alt={comment.article.name}
                                className="w-full object-cover"
                            />
                            <div className="absolute bottom-0 left-0 w-full px-6 py-2 bg-slate-800 bg-opacity-50">
                                <p className="italic text-justify text-white text-xs">
                                    {comment.article.caption}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col md:flex-row justify-between">
                                {/* ID */}
                                <div className="flex items-center gap-2">
                                    <div className="rounded-full overflow-hidden w-14 h-14 border-2 border-indigo-500">
                                        {comment.article.article_image_path && (
                                            <img
                                                src={
                                                    comment.article.author
                                                        ? "/images/default/profile.jpg"
                                                        : comment.article
                                                              .is_anonymous ===
                                                          "yes"
                                                        ? "/images/default/profile.jpg"
                                                        : comment.article
                                                              .article_image_path
                                                }
                                                className="object-cover w-full h-full"
                                                alt={
                                                    comment.article
                                                        .is_anonymous === "yes"
                                                        ? "Default image"
                                                        : comment.article
                                                              .createdBy.name
                                                }
                                            />
                                        )}
                                    </div>
                                    {/* Information */}
                                    <div>
                                        <h4>
                                            Author:
                                            <span className="font-bold">
                                                {comment.article.author
                                                    ? comment.article.author
                                                    : comment.article
                                                          .is_anonymous ===
                                                      "yes"
                                                    ? "Anonymous"
                                                    : comment.article.createdBy
                                                          .name}
                                            </span>
                                        </h4>
                                        <p className="mt-1">
                                            Published Date:
                                            <span className="font-bold">
                                                {" "}
                                                {comment.article.published_date
                                                    ? comment.article
                                                          .published_date
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
                                            {comment.article.category.name}
                                        </span>
                                    </h4>
                                    <p className="mt-1">
                                        Status:{" "}
                                        <span className="font-bold uppercase">
                                            {comment.article.status}
                                        </span>
                                    </p>
                                </div>
                            </div>
                            {/* <div className="mt-4 text-gray-400">
                                <p>for testing</p>
                                <p>
                                    Edited by:
                                    {comment.article.editedBy
                                        ? comment.article.editedBy.name
                                        : "No Designer"}
                                </p>
                                <p> Layout By by:{comment.article.layoutBy.name}</p>
                            </div> */}
                            {/* Body */}
                            <div className="mt-8">
                                {/* <p className="text-base text-justify whitespace-pre-line">
                                    {comment.article.body}
                                </p> */}
                                <div
                                    className="text-base text-justify whitespace-pre-line"
                                    dangerouslySetInnerHTML={{
                                        __html: comment.article.body,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                    {/* comment */}
                    <div
                        ref={commentRef}
                        className="bg-gray-50 dark:bg-gray-800 shadow-sm sm:rounded-lg my-4 p-4 flex flex-col gap-4"
                    >
                        <p className="text-red-600">Reported/Arhive Comment</p>
                        <div className="flex justify-between" key={comment.id}>
                            <div className="flex gap-2 w-full">
                                <div className="rounded-full overflow-hidden w-14 h-14 flex-shrink-0 border-2 border-indigo-500">
                                    {comment.commentedBy.profile_image_path && (
                                        <img
                                            src={
                                                comment.commentedBy
                                                    .profile_image_path
                                            }
                                            className="object-cover w-full h-full"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src =
                                                    "/images/default/profile.jpg";
                                            }}
                                            alt={comment.commentedBy.name}
                                        />
                                    )}
                                </div>
                                <div className="bg-gray-200 dark:bg-gray-900 w-full rounded-md p-2 shadow-sm border-indigo-500">
                                    <small className="text-base text-purple-800 dark:text-purple-300">
                                        {comment.commentedBy.name} |{" "}
                                        {comment.created_at}
                                    </small>
                                    <p className="text-justify text-base whitespace-pre-line text-gray-900 dark:text-gray-100 mt-2">
                                        {comment.body}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-2">
                            {/* <Link
                                    href={route(
                                        "designer-comment.article.edit",
                                        comment.article.id
                                    )}
                                    className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                                >
                                    Hide TODO
                                </Link> */}
                            <SecondaryButton
                                href={route(
                                    "designer-review-report-comment.index"
                                )}
                            >
                                Back
                            </SecondaryButton>
                        </div>
                    </div>
                </div>
            </div>
        </DesignerAuthenticatedLayout>
    );
}
