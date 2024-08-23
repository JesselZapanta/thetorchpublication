import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import RatingComponent from "@/Components/RatingComponent";
import TextAreaInput from "@/Components/TextAreaInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import Dropdown from "./../Components/Dropdown";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/16/solid";

export default function ReadArticle({
    auth,
    article,
    categories,
    userRating,
    comments,
}) {
    // Check if user is authenticated
    const isAuthenticated = !!auth.user;

    // alert(auth.user.id)

    // State to manage speech synthesis
    const [isSpeaking, setIsSpeaking] = useState(false);
    const speechSynthesis = window.speechSynthesis;

    const handleSpeak = () => {
        if (isSpeaking) {
            speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            // Get the selected text or fallback to the full article text
            const selectedText = window.getSelection().toString();
            const textToRead =
                selectedText ||
                `${article.title}. Written by ${article.createdBy.name}. ${article.body}`;
            const utterance = new SpeechSynthesisUtterance(textToRead);

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            setIsSpeaking(true);
            speechSynthesis.speak(utterance);
        }
    };

    useEffect(() => {
        const stopSpeech = () => {
            if (speechSynthesis.speaking) {
                speechSynthesis.cancel();
            }
        };

        // Add event listener for beforeunload
        window.addEventListener("beforeunload", stopSpeech);

        // Cleanup function
        return () => {
            stopSpeech(); // Ensure speech synthesis is stopped
            window.removeEventListener("beforeunload", stopSpeech);
        };
    }, [speechSynthesis]);

    // Write Comment
    const { data, setData, post, reset, errors } = useForm({
        article_id: article.id,
        body: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route("comments.store", data), {
            onSuccess: () => reset(), // Reset the form on success
            preserveScroll: true, // Preserve scroll on error
        });
    };

    //Delete Comment
    const handleDelete = (comment) => {
        if (comment) {
            router.delete(route("comments.destroy", comment.id), {
                onSuccess: () => {
                    console.log("Comment deleted successfully");
                },
                onError: (errors) => {
                    console.error("Failed to delete comment", errors);
                },
                preserveScroll: true, // Preserve scroll on error
            });
        }
    };

    const [showAll, setShowAll] = useState(false);

    const toggleComments = () => {
        setShowAll(!showAll);
    };

    const displayedComments = showAll
        ? comments.data
        : comments.data.slice(0, 3);

    return (
        <UnauthenticatedLayout
            categories={categories}
            user={auth.user}
            header={
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8 flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        {article.title}
                    </h2>
                </div>
            }
        >
            <Head title={`Article ${article.title}`} />
            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative">
                            {/* <img
                                src={article.article_image_path}
                                alt={article.name}
                                className="w-full object-cover"
                            /> */}
                            <img
                                src={article.article_image_path}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                    e.target.onerror = null; // Prevents infinite loop in case the default image also fails to load
                                    e.target.src =
                                        "/images/default/article.png";
                                }}
                                alt={article.title}
                            />
                            <div className="absolute bottom-0 left-0 w-full px-6 py-2 bg-slate-800 bg-opacity-50">
                                <p className="italic text-justify text-white text-xs">
                                    {article.caption}
                                </p>
                            </div>
                        </div>
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="flex flex-col md:flex-row justify-between">
                                <div className="flex gap-2">
                                    <div className="rounded-full overflow-hidden w-14 h-14 border-2 border-indigo-500">
                                        {article.createdBy
                                            .profile_image_path && (
                                            <img
                                                src={
                                                    article.createdBy
                                                        .profile_image_path
                                                }
                                                className="object-cover w-full h-full"
                                                onError={(e) => {
                                                    e.target.onerror = null; // Prevents infinite loop in case the default image also fails to load
                                                    e.target.src =
                                                        "/images/default/profile.jpg";
                                                }}
                                                alt={article.createdBy.name}
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
                                        <h4 className="font-bold mt-4 text-lg">
                                            Category: {article.category.name}
                                        </h4>
                                    </div>
                                </div>
                                <div>
                                    <RatingComponent
                                        articleId={article.id}
                                        isAuthenticated={isAuthenticated}
                                    />
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-base text-justify whitespace-pre-line">
                                    {article.body}
                                </p>
                            </div>
                        </div>
                        <div className="py-4">
                            {/* TTS Button */}
                            <button
                                onClick={handleSpeak}
                                className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                            >
                                {isSpeaking ? "Stop Reading" : "Read Aloud"}
                            </button>
                        </div>
                    </div>
                    {/* Comment Form */}
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg my-4 p-4">
                        {auth.user ? (
                            <form onSubmit={handleSubmit}>
                                {/* body */}
                                <div className="mt-2 w-full">
                                    <InputLabel
                                        htmlFor="body"
                                        value="Write a Comment"
                                    />

                                    <TextAreaInput
                                        id="body"
                                        type="text"
                                        name="body"
                                        value={data.body}
                                        className="mt-2 block w-full min-h-24 resize-none"
                                        onChange={(e) =>
                                            setData("body", e.target.value)
                                        }
                                    />

                                    <InputError
                                        message={errors.body}
                                        className="mt-2"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                                >
                                    Comment
                                </button>
                            </form>
                        ) : (
                            <Link href={route("login")}>
                                <p className="text-gray-400 w-full text-center">
                                    Please log in to your account to comment.
                                </p>
                            </Link>
                        )}
                    </div>
                    {/* <pre className="text-white">
                        {JSON.stringify(comments, undefined, 2)}
                    </pre> */}
                    {/*Show limit 5 Comment */}
                    <div className="bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg my-4 p-4 flex flex-col gap-4">
                        {displayedComments.length > 0 && (
                            <div className="flex gap-1">
                                <button
                                    onClick={toggleComments}
                                    className="text-gray-400"
                                >
                                    {showAll
                                        ? "show less comments"
                                        : "view all comments"}
                                </button>
                                <ChevronDownIcon
                                    className={`w-6 ${
                                        showAll ? "rotate-180" : ""
                                    } text-gray-400`}
                                />
                            </div>
                        )}
                        {/* comments */}
                        {displayedComments.length > 0 ? (
                            displayedComments.map((comment) => (
                                <div
                                    className="flex flex-col md:flex-row justify-between"
                                    key={comment.id}
                                >
                                    <div className="flex gap-2 w-full">
                                        <div className="rounded-full overflow-hidden w-14 h-14 flex-shrink-0 border-2 border-indigo-500">
                                            {comment.commentedBy
                                                .profile_image_path && (
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
                                                    alt={
                                                        comment.commentedBy.name
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div className="bg-gray-900 w-full rounded-md p-2 shadow-sm border-indigo-500">
                                            <small className="text-sm text-purple-300">
                                                {comment.commentedBy.name} |{" "}
                                                {comment.created_at}
                                            </small>
                                            <p className="text-justify text-gray-100 mt-2">
                                                {comment.body}
                                            </p>
                                        </div>
                                    </div>
                                    {auth.user && (
                                        <div className="ms-3 relative">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6 text-white cursor-pointer"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </Dropdown.Trigger>
                                                <Dropdown.Content>
                                                    {auth.user.id ===
                                                        comment.user_id && (
                                                        <Dropdown.Link
                                                            onClick={(
                                                                event
                                                            ) => {
                                                                event.preventDefault();
                                                                handleDelete(
                                                                    comment
                                                                );
                                                            }}
                                                        >
                                                            Delete
                                                        </Dropdown.Link>
                                                    )}
                                                    <Dropdown.Link
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            handleReport(
                                                                comment
                                                            );
                                                        }}
                                                    >
                                                        Report[todo]
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center text-gray-400">
                                No comments yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
