import RatingComponent from "@/Components/RatingComponent";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function ReadArticle({ auth, article, categories, userRating }) {
    // Check if user is authenticated
    const isAuthenticated = !!auth.user;

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
                                        {article.article_image_path && (
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
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
