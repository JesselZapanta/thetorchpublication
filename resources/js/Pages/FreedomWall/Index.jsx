
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SelectInput from '@/Components/SelectInput';
import TextAreaInput from '@/Components/TextAreaInput';
import UnauthenticatedLayout from '@/Layouts/UnauthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import React, { useState } from 'react'


export default function Index({ auth, categories, freedomWallEntries }) {
    const [policyModalOpen, setPolicyModalOpen] = useState(false);
    const [createModalOpen, setCreateModalOpen] = useState(false);

    //create freedom wall entry
    const { data, setData, post, errors, reset, clearErrors, processing } =
        useForm({
            body: "",
            emotion: "",
        });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("freedom-wall.store"), {
            data,
            onSuccess: () => {
                setCreateModalOpen(false); // Close the modal on success
                reset();
            },
            onError: () => {
                // Keep modal open on error
                setCreateModalOpen(true);
            },
            preserveScroll: true,
        });
    };

    //policy Modal
    const openPolicyModal = () => {
        setPolicyModalOpen(true);
    };

    const closePolicyModal = () => {
        setPolicyModalOpen(false);
    };

    //Create Modal
    const openCreateModal = () => {
        setCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        reset();
        clearErrors();
        setCreateModalOpen(false);
    };

    //LIke and Dislike

    // Like and Dislike
    const likeForm = useForm();
    const dislikeForm = useForm();

    const handleLike = (entryId) => {
        // alert(entryId);
        likeForm.post(route("freedom-wall.like", entryId), {
            onSuccess: () => {
                console.log("Freedom wall liked successfully");
            },
            onError: (errors) => {
                console.error("Failed to like freedom wall", errors);
            },
            preserveScroll: true, // Preserve scroll on success
        });
    };

    const handleDislike = (entryId) => {
        // alert(entryId);
        dislikeForm.post(route("freedom-wall.dislike", entryId), {
            onSuccess: () => {
                console.log("Freedom wall disliked successfully");
            },
            onError: (errors) => {
                console.error("Failed to dislike freedom wall", errors);
            },
            preserveScroll: true, // Preserve scroll on success
        });
    };

    return (
        <UnauthenticatedLayout
            user={auth.user}
            categories={categories}
            header={
                <div className="max-w-7xl mt-16 mx-auto flex items-center justify-center">
                    <h2 className="font-semibold text-3xl text-nowrap text-gray-200 leading-tight text-justify uppercase">
                        The Torch Freedom Wall
                    </h2>
                </div>
            }
        >
            <Head title="Freedom Wall" />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-4 overflow-hidden">
                <div className="w-full justify-center flex gap-4 my-4">
                    <button
                        onClick={openPolicyModal}
                        className="px-4 py-2 bg-emerald-600 text-white transition-all rounded hover:bg-emerald-700"
                    >
                        View Our Policy
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-indigo-600 text-white transition-all rounded hover:bg-indigo-700"
                    >
                        Write Something
                    </button>
                </div>
            </div>
            <div className="max-w-7xl py-2 mx-auto w-full grid lg:grid-cols-3 gap-4">
                {freedomWallEntries.data.map((entry) => (
                    <div
                        key={entry.id}
                        className="relative flex w-full flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg overflow-hidden"
                    >
                        <div className="bg-gray-700 p-2 w-full h-16 flex justify-between items-center">
                            <div className="flex gap-2">
                                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden">
                                    <img
                                        src="/images/default/profile.jpg"
                                        alt=""
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">
                                        Anonymous
                                    </h4>
                                    <p className="text-sm">
                                        Publish: {entry.created_at}
                                    </p>
                                </div>
                            </div>
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
                        </div>
                        <div className="relative h-[300px] flex gap-1 items-end justify-end p-2 transition-all duration-300">
                            <p className="bg-cyan-500 text-white p-2 rounded-lg max-w-xs break-words text-justify">
                                {entry.body.length > 350
                                    ? `${entry.body.substring(0, 350)}...`
                                    : entry.body}
                            </p>
                            <div>
                                <button
                                // className={`${
                                //     isSpeaking === comment.id
                                //         ? "text-indigo-400 animate-pulse"
                                //         : "text-gray-400"
                                // }`}
                                // onClick={() => handleSpeak(comment)}
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
                                </button>
                            </div>
                        </div>
                        {/* Bottoom Btns */}
                        <div className="bg-gray-700 p-2  w-full h-16 flex justify-between items-center">
                            <div className="flex gap-4">
                                <span
                                    className={`${
                                        entry.user_has_liked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {entry.likes_count}
                                    {/* {entry.id} */}
                                </span>
                                <button
                                    className={`${
                                        entry.user_has_liked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleLike(entry.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-6"
                                    >
                                        <path d="M7.493 18.5c-.425 0-.82-.236-.975-.632A7.48 7.48 0 0 1 6 15.125c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75A.75.75 0 0 1 15 2a2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23h-.777ZM2.331 10.727a11.969 11.969 0 0 0-.831 4.398 12 12 0 0 0 .52 3.507C2.28 19.482 3.105 20 3.994 20H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 0 1-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227Z" />
                                    </svg>
                                </button>
                                <span
                                    className={`${
                                        entry.user_has_disliked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {entry.dislikes_count}
                                </span>
                                <button
                                    className={`${
                                        entry.user_has_disliked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleDislike(entry.id)}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="size-6"
                                    >
                                        <path d="M15.73 5.5h1.035A7.465 7.465 0 0 1 18 9.625a7.465 7.465 0 0 1-1.235 4.125h-.148c-.806 0-1.534.446-2.031 1.08a9.04 9.04 0 0 1-2.861 2.4c-.723.384-1.35.956-1.653 1.715a4.499 4.499 0 0 0-.322 1.672v.633A.75.75 0 0 1 9 22a2.25 2.25 0 0 1-2.25-2.25c0-1.152.26-2.243.723-3.218.266-.558-.107-1.282-.725-1.282H3.622c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 1.5 12.25c0-2.848.992-5.464 2.649-7.521C4.537 4.247 5.136 4 5.754 4H9.77a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23ZM21.669 14.023c.536-1.362.831-2.845.831-4.398 0-1.22-.182-2.398-.52-3.507-.26-.85-1.084-1.368-1.973-1.368H19.1c-.445 0-.72.498-.523.898.591 1.2.924 2.55.924 3.977a8.958 8.958 0 0 1-1.302 4.666c-.245.403.028.959.5.959h1.053c.832 0 1.612-.453 1.918-1.227Z" />
                                    </svg>
                                </button>
                            </div>
                            <div>
                                <h2>
                                    Feeling{" "}
                                    <span className="capitalize">
                                        {entry.emotion}
                                    </span>
                                </h2>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {/* <pre className="text-white">
                {JSON.stringify(freedomWallEntries, null, 2)}
            </pre> */}

            {/* Policy Modal */}
            <Modal show={policyModalOpen} onClose={closePolicyModal}>
                <div className="p-6">
                    <div className="flex justify-between">
                        <h2 className="text-2xl text-emerald-500 font-bold">
                            The Torch Freedom Wall Policy
                        </h2>
                        <button
                            onClick={closePolicyModal}
                            className="text-gray-400 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <p className="block mt-4 text-justify font-sans text-base antialiased font-light leading-relaxed text-gray-400">
                        Welcome to the Torch Freedom Wall, a platform for open
                        and respectful expression. By using this platform, you
                        agree to communicate respectfully, avoiding hate speech,
                        bullying, harassment, and discrimination. Offensive
                        content, such as vulgar or obscene posts, is not
                        allowed, and feedback should always be constructive.
                        Please do not share personal information, including
                        addresses, phone numbers, or sensitive data about
                        yourself or others. While you may post anonymously, all
                        posts must comply with this policy. Ensure that your
                        posts are relevant to the platform’s purpose, and avoid
                        spam, repetitive content, and advertisements. Respect
                        intellectual property rights and do not post content
                        that infringes on these rights. Posts are monitored to
                        ensure compliance with this policy. Users can report
                        posts that violate the guidelines, and these reports
                        will be reviewed with appropriate actions taken.
                        Violations may result in the removal of posts from the
                        platform.
                    </p>
                    <div className="w-full flex">
                        <button
                            onClick={closePolicyModal}
                            className="ml-auto px-4 py-2 bg-emerald-600 text-white transition-all rounded hover:bg-emerald-700"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Create/Edit Modal */}
            <Modal show={createModalOpen} onClose={closeCreateModal}>
                <div className="p-6">
                    <div className="flex justify-between">
                        <h2 className="text-2xl text-indigo-600 font-bold">
                            Freedom Wall Entry
                        </h2>
                        <button
                            onClick={closeCreateModal}
                            className="text-gray-400 cursor-pointer"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="size-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>

                    <form onSubmit={onSubmit}>
                        {/* body */}
                        <div className="mt-2 w-full">
                            <InputLabel htmlFor="body" value="Message" />

                            <TextAreaInput
                                id="body"
                                type="text"
                                name="body"
                                value={data.body}
                                className="mt-2 block w-full min-h-44 resize-none"
                                onChange={(e) =>
                                    setData("body", e.target.value)
                                }
                            />

                            <InputError
                                message={errors.body}
                                className="mt-2"
                            />
                        </div>
                        {/* Emotion */}
                        <div className="mt-2 w-full">
                            <InputLabel
                                htmlFor="emotion"
                                value="Message Emotion"
                            />

                            <SelectInput
                                name="emotion"
                                id="emotion"
                                value={data.emotion}
                                className="mt-1 block w-full"
                                onChange={(e) =>
                                    setData("emotion", e.target.value)
                                }
                            >
                                <option value="">Select a emotion</option>
                                <option value="happy">Happy</option>
                                <option value="sad">Sad</option>
                            </SelectInput>

                            <InputError
                                message={errors.emotion}
                                className="mt-2"
                            />
                        </div>
                        <div className="w-full flex mt-4">
                            <button
                                // onClick={closeCreateModal}
                                className="ml-auto px-4 py-2 bg-indigo-600 text-white transition-all rounded hover:bg-indigo-700"
                                disabled={processing}
                            >
                                Submit Entry
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        </UnauthenticatedLayout>
    );
}
