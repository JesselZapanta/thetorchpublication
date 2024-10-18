import RatingComponent from "@/Components/RatingComponent";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, Link, router, useForm } from "@inertiajs/react";
import React, { useState, useEffect } from "react";
import CommentsSection from "@/Components/CommentsSection";
import CommentForm from "@/Components/CommentForm ";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import ShareToFacebook from "@/Components/ShareBtns/ShareToFacebook";
import ShareToX from "@/Components/ShareBtns/ShareToX";
import RecommendedArticles from "@/Components/Article/RecommendedArticles";

export default function ReadArticle({
    auth,
    article,
    categories,
    comments,
    flash,
    recommendedArticles,
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Check if user is authenticated
    const isAuthenticated = !!auth.user;

    // alert(auth.user.id)

    const [isSpeaking, setIsSpeaking] = useState(false);

    const MAX_CHUNK_LENGTH = 1000; // You can adjust this length

    const chunkText = (text) => {
        const words = text.split(" ");
        let chunks = [];
        let currentChunk = "";

        for (let word of words) {
            if ((currentChunk + word).length <= MAX_CHUNK_LENGTH) {
                currentChunk += word + " ";
            } else {
                chunks.push(currentChunk.trim());
                currentChunk = word + " ";
            }
        }

        if (currentChunk) {
            chunks.push(currentChunk.trim());
        }

        return chunks;
    };

    // Function to strip HTML tags
    const stripHtml = (html) => {
        const doc = new DOMParser().parseFromString(html, "text/html");
        return doc.body.textContent || "";
    };

    // Function to normalize Unicode text generated by font generators
    const normalizeText = (text) => {
        // Using regex to replace common Unicode variations with regular characters
        return text.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); // Removes diacritics, etc.
    };

    const handleSpeak = () => {
        if (isSpeaking) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        } else {
            const selectedText = window.getSelection().toString();
            const cleanSelectedText = selectedText
                ? normalizeText(stripHtml(selectedText))
                : "";

            const cleanTitle = normalizeText(article.title);
            const cleanAuthor = article.author
                ? normalizeText(article.author) // Use article.author if it exists
                : article.is_anonymous === "yes"
                ? "Anonymous" // Show "Anonymous" if the article is marked as anonymous
                : article.createdBy?.name
                ? normalizeText(article.createdBy.name) // Use article.createdBy.name if it exists
                : "Unknown Author"; // Fallback in case both are missing

            const cleanText = stripHtml(article.body);
            const normalizedText = normalizeText(cleanText);

            const textToRead =
                cleanSelectedText ||
                `${cleanTitle}. Written by ${cleanAuthor}. ${normalizedText}`;

            const textChunks = chunkText(textToRead); // Split the text into chunks

            let chunkIndex = 0;

            const speakNextChunk = () => {
                if (chunkIndex < textChunks.length) {
                    const utterance = new SpeechSynthesisUtterance(
                        textChunks[chunkIndex]
                    );
                    utterance.onend = () => {
                        chunkIndex++;
                        speakNextChunk(); // Speak the next chunk
                    };
                    utterance.onerror = () => {
                        setIsSpeaking(false);
                    };
                    window.speechSynthesis.speak(utterance);
                } else {
                    setIsSpeaking(false);
                }
            };

            setIsSpeaking(true);
            speakNextChunk(); // Start speaking the first chunk
        }
    };

    useEffect(() => {
        const stopSpeech = () => {
            if (window.speechSynthesis.speaking) {
                window.speechSynthesis.cancel();
            }
        };

        // Cleanup on unmount or page unload
        window.addEventListener("beforeunload", stopSpeech);

        return () => {
            stopSpeech(); // Stop speech when component unmounts
            window.removeEventListener("beforeunload", stopSpeech);
        };
    }, []);

    // Write Comment
    const { data, setData, post, reset, errors, processing } = useForm({
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

    //report
    const [confirmReport, setConfirmReport] = useState(false);
    const [currentArticle, setCurrentArticle] = useState(null);
    const [reportProcessing, setReportProcessing] = useState(false); // Added reportProcessing state

    const openReportModal = (article) => {
        setCurrentArticle(article);
        setConfirmReport(true);
    };

    const handleReport = () => {
        if (currentArticle) {
            // Close the modal
            setReportProcessing(true);
            setConfirmReport(false);

            // Send the report request using Inertia router.post
            router.post(
                route("article.report", currentArticle.id),
                {},
                {
                    preserveScroll: true,
                    onFinish: () => setReportProcessing(false),
                }
            );
        }
    };

    return (
        <UnauthenticatedLayout
            categories={categories}
            user={auth.user}
            header={
                <div className="max-w-7xl mx-auto flex items-center justify-between mt-16">
                    <h2 className="font-semibold sm:txt-md lg:text-xl text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        {article.title}
                    </h2>
                </div>
            }
        >
            <Head title={`Read ${article.title}`} />

            <ToastContainer position="bottom-right" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(recommendedArticles, null, 2)}
            </pre> */}

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="relative">
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
                                                        article.author
                                                            ? "/images/default/profile.jpg"
                                                            : article.is_anonymous ===
                                                              "yes"
                                                            ? "/images/default/profile.jpg"
                                                            : article.createdBy
                                                                  .profile_image_path
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
                                                            : "Profile Picture"
                                                    }
                                                />
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-base">
                                                Author:
                                                {article.author
                                                    ? article.author
                                                    : article.is_anonymous ===
                                                      "yes"
                                                    ? "Anonymous"
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
                                    {auth.user &&
                                        auth.user.role === "student" && (
                                            <div className="mt-4">
                                                <button
                                                    className="px-2 bg-rose-400 text-white transition-all duration-300 rounded hover:bg-rose-500"
                                                    onClick={() =>
                                                        openReportModal(article)
                                                    }
                                                >
                                                    Report
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>
                            <div className="w-full h-[2px] bg-indigo-400 my-8"></div>
                            <div className="mt-8">
                                <div
                                    className="article-body text-base text-justify whitespace-pre-line"
                                    dangerouslySetInnerHTML={{
                                        __html: article.body,
                                    }}
                                >
                                    {/* {article.body} */}
                                </div>
                            </div>
                        </div>
                        <div className="p-4 flex justify-between items-center">
                            {/* TTS Button */}
                            <button
                                onClick={handleSpeak}
                                className="px-4 py-2 flex gap-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
                                    <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
                                </svg>
                                {isSpeaking ? "Stop Reading" : "Read Aloud"}
                            </button>
                            <ShareToFacebook />
                        </div>
                    </div>
                    {/* Recommended arti */}
                    {recommendedArticles.data.length > 0 && (
                        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg my-4 p-4">
                            <h4 className="text-indigo-500">
                                Recommended Articles
                            </h4>
                            <div className="overflow-auto mt-2">
                                <RecommendedArticles
                                    recommendedArticles={recommendedArticles}
                                />
                            </div>
                        </div>
                    )}

                    {/* Use the CommentForm Component */}
                    <CommentForm
                        auth={auth}
                        data={data}
                        setData={setData}
                        handleSubmit={handleSubmit}
                        errors={errors}
                        processing={processing}
                    />
                    {/* <pre className="text-white">
                        {JSON.stringify(comments, undefined, 2)}
                    </pre> */}
                    {/*Show limit 5 Comment */}
                    <CommentsSection
                        auth={auth}
                        comments={comments}
                        handleDelete={handleDelete}
                        handleLike={handleLike}
                        handleDislike={handleDislike}
                    />
                </div>
            </div>
            {/* Confirm Report Modal */}
            <Modal show={confirmReport} onClose={() => setConfirmReport(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Report</h2>
                    <p className="mt-4">
                        Are you sure you want to report this content?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton
                            onClick={() => setConfirmReport(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            onClick={handleReport}
                            disabled={reportProcessing}
                        >
                            {reportProcessing ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>
        </UnauthenticatedLayout>
    );
}
