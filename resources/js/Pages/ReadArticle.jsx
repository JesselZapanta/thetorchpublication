import RatingComponent from "@/Components/RatingComponent";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import CommentsSection from "@/Components/CommentsSection";
import CommentForm from "@/Components/CommentForm ";

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

    const handleReport = (comment) => {
        // Implement report functionality here
    };

    //LIke and Dislike

    const { post: likePost, post: dislikePost } = useForm();

    const handleLike = (commentId) => {
        likePost(route("comments.like", commentId), {
            onSuccess: () => {
                console.log("Comment liked successfully");
            },
            onError: (errors) => {
                console.error("Failed to like comment", errors);
            },
            preserveScroll: true, // Preserve scroll on success
        });
    };

    const handleDislike = (commentId) => {
        dislikePost(route("comments.dislike", commentId), {
            onSuccess: () => {
                console.log("Comment disliked successfully");
            },
            onError: (errors) => {
                console.error("Failed to dislike comment", errors);
            },
            preserveScroll: true, // Preserve scroll on success
        });
    };

    return (
        <UnauthenticatedLayout
            categories={categories}
            user={auth.user}
            header={
                <div className="max-w-7xl mx-auto flex items-center justify-between mt-16">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        {article.title}
                    </h2>
                </div>
            }
        >
            <Head title={`Read ${article.title}`} />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
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
                                <div className="flex gap-2 flex-col">
                                    <div className="flex gap-2">
                                        <div className="rounded-full overflow-hidden w-14 h-14 border-2 border-indigo-500">
                                            {article.createdBy
                                                .profile_image_path && (
                                                <img
                                                    src={
                                                        article.is_anonymous ===
                                                        "yes"
                                                            ? "/images/default/profile.jpg"
                                                            : article.article_image_path
                                                    }
                                                    className="object-cover w-full h-full"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src =
                                                            "/images/default/profile.jpg";
                                                    }}
                                                    alt={
                                                        article.is_anonymous ===
                                                        "yes"
                                                            ? "Default image"
                                                            : article.article_image_path
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">
                                                Author:
                                                {article.is_anonymous === "yes"
                                                    ? " Anonymous"
                                                    : article.createdBy.name}
                                            </h4>
                                            <p className="mt-1">
                                                Published Date:{" "}
                                                {article.published_date}
                                            </p>
                                        </div>
                                    </div>
                                    <h4 className="font-bold mt-4 text-base">
                                        Category:{" "}
                                        <span className="text-indigo-500">
                                            {article.category.name}
                                        </span>
                                    </h4>
                                    <p className="mt-1">
                                        Views: {article.views}
                                    </p>
                                </div>
                                <div>
                                    <RatingComponent
                                        articleId={article.id}
                                        isAuthenticated={isAuthenticated}
                                    />
                                </div>
                            </div>
                            <div className="w-full h-[2px] bg-indigo-400 my-8"></div>
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
                                className="ml-4 px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                            >
                                {isSpeaking ? "Stop Reading" : "Read Aloud"}
                            </button>
                        </div>
                    </div>
                    {/* Use the CommentForm Component */}
                    <CommentForm
                        auth={auth}
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        errors={errors}
                    />
                    {/* <pre className="text-white">
                        {JSON.stringify(comments, undefined, 2)}
                    </pre> */}
                    {/*Show limit 5 Comment */}
                    <CommentsSection
                        auth={auth}
                        comments={comments}
                        handleDelete={handleDelete}
                        handleReport={handleReport}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                    />
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
