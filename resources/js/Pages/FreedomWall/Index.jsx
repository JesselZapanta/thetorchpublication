
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
                {/* <div className="relative flex w-full flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg overflow-hidden">
                    <div className="bg-gray-700 p-2 flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden">
                                <img
                                    src="/images/default/profile.jpg"
                                    alt=""
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Anonymous</h4>
                                <p className="text-sm">Publish: 09-78-43</p>
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
                    <div className="relative min-h-[250px] flex gap-1 items-end justify-end p-2 transition-all duration-300">
                        <p className="bg-cyan-500 text-white p-2 rounded max-w-xs break-words text-justify">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Saepe deserunt qui exercitationem repellendus
                            sint architecto, accusantium vel delectus ratione
                            rem nobis deleniti ipsam aspernatur consequatur
                            veniam! Quibusdam, repellat, quisquam saepe ad eius
                            doloribus voluptas maxime aspernatur culpa dicta
                            quaerat eos, at odio assumenda quidem ea eligendi
                            labore nesciunt sed fuga.
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

                    <div className="bg-gray-700 p-2 flex justify-between items-center">
                        <div className="flex gap-2">
                            <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden">
                                <img
                                    src="/images/default/profile.jpg"
                                    alt=""
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <h4 className="font-bold text-lg">Anonymous</h4>
                                <p className="text-sm">Publish: 09-78-43</p>
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
                </div> */}

                {freedomWallEntries.map((entry) => (
                    <div
                        key={entry.id}
                        className="relative flex w-full flex-col rounded-xl bg-gray-800 bg-clip-border text-gray-300 shadow-lg overflow-hidden"
                    >
                        <div className="bg-gray-700 p-2 flex justify-between items-center">
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
                                    <p className="text-sm">Publish: 09-78-43</p>
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
                            <p className="bg-cyan-500 text-white p-2 rounded max-w-xs break-words text-justify">
                                {/* {entry.body} */}
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

                        <div className="bg-gray-700 p-2 flex justify-between items-center">
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
                                    <p className="text-sm">Publish: 09-78-43</p>
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
