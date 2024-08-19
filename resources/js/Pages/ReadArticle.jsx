import RatingComponent from "@/Components/RatingComponent";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

export default function ReadArticle({ auth, article, categories, userRating }) {
    // Check if user is authenticated
    const isAuthenticated = !!auth.user;

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [synth, setSynth] = useState(null);
    const [utterance, setUtterance] = useState(null);

    useEffect(() => {
        setSynth(window.speechSynthesis);
        return () => {
            if (synth) {
                synth.cancel(); // Stop TTS if the page reloads
            }
        };
    }, [synth]);

    const handleTextToSpeech = () => {
        if (!synth) return;

        const fullText = `${article.title}. Author: ${article.createdBy.name}. ${article.body}`;
        const newUtterance = new SpeechSynthesisUtterance(fullText);
        newUtterance.lang = "en-US";

        newUtterance.onstart = () => setIsSpeaking(true);
        newUtterance.onend = () => setIsSpeaking(false);

        setUtterance(newUtterance);
        synth.speak(newUtterance);
    };

    const handlePauseResume = () => {
        if (!synth) return;

        if (synth.speaking) {
            if (synth.paused) {
                synth.resume();
            } else {
                synth.pause();
            }
        }
    };

    const handleStop = () => {
        if (!synth) return;

        synth.cancel();
        setIsSpeaking(false);
    };

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
                            <img
                                src={article.article_image_path}
                                alt={article.name}
                                className="w-full object-cover"
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

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={handleTextToSpeech}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={isSpeaking}
                                >
                                    Listen to this article
                                </button>
                                <button
                                    onClick={handlePauseResume}
                                    className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={!isSpeaking}
                                >
                                    {synth && synth.paused ? "Resume" : "Pause"}
                                </button>
                                <button
                                    onClick={handleStop}
                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                    disabled={!isSpeaking}
                                >
                                    Stop
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UnauthenticatedLayout>
    );
}
