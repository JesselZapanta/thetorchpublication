import FreedomWallEntries from "@/Components/FreedomWallEntries";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, router, useForm } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function Index({ auth, categories, freedomWallEntries }) {

    //state for modal create and policy
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

    // const [search, setSearch] = useState("");
    // const [filteredFreedomWall, setFilteredFreedomWall] = useState(
    //     freedomWallEntries.data //
    // );
    // const [sort, setSort] = useState("");

    // useEffect(() => {
    //     handleSearch();
    // }, [search, sort]);

    // const handleSearch = () => {
    //     let filtered = freedomWallEntries.data.filter((entry) =>
    //         entry.body.toLowerCase().includes(search.toLowerCase())
    //     );

    //     if (sort === "date_asc") {
    //         filtered.sort(
    //             (a, b) => new Date(a.created_at) - new Date(b.created_at)
    //         );
    //     } else if (sort === "date_desc") {
    //         filtered.sort(
    //             (a, b) => new Date(b.created_at) - new Date(a.created_at)
    //         );
    //     } else if (sort === "body_asc") {
    //         filtered.sort((a, b) => a.body.localeCompare(b.body));
    //     } else if (sort === "body_desc") {
    //         filtered.sort((a, b) => b.body.localeCompare(a.body));
    //     }

    //     setFilteredFreedomWall(filtered);
    // };

    // const handleKeyPress = (e) => {
    //     if (e.key === "Enter") {
    //         handleSearch();
    //     }
    // };

    const [sort, setSort] = useState(""); // Initial value is an empty string

    useEffect(() => {
        // Fetch sorted data whenever `sort` changes, excluding the initial empty state
        if (sort) {
            router.get(route("freedom-wall.index"), { sort });
        }
    }, [sort]);

    const handleSortChange = (e) => {
        const selectedValue = e.target.value;
        setSort(selectedValue); // Update the state with the selected value
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
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
            overflow-hidden"
            >
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
                <div className="max-w-7xl py-2 mx-auto w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectInput
                        className="w-full p-2 border border-gray-300 rounded-lg mt-4"
                        value={sort} // This binds the state to the select input
                        onChange={handleSortChange} // This updates the state on change
                    >
                        <option value="">Sort by</option>
                        <option value="date_asc">Date: Ascending</option>
                        <option value="date_desc">Date: Descending</option>
                        <option value="body_asc">Body: A-Z</option>
                        <option value="body_desc">Body: Z-A</option>
                    </SelectInput>

                    {/* <SelectInput
                        className="w-full p-2 border border-gray-300 rounded-lg mt-4"
                        // value={emotionSort}
                        // onChange={handleEmotionSortChange}
                    >
                        <option value="">Sort by Emotion</option>
                        <option value="happy">Happy</option>
                        <option value="sad">Sad</option>
                        <option value="annoyed">Annoyed</option>
                        <option value="proud">Proud</option>
                        <option value="drained">Drained</option>
                        <option value="inlove">Inlove</option>
                        <option value="calm">Calm</option>
                        <option value="excited">Excited</option>
                        <option value="angry">Angry</option>
                        <option value="down">Down</option>
                    </SelectInput> */}

                    {/* <TextInput
                        type="text"
                        placeholder="Search Freedom Wall Entries..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full p-2 border border-gray-300 rounded-lg"
                    /> */}
                </div>
                {/* Freedom Wall Entries */}
                <FreedomWallEntries
                    freedomWallEntries={freedomWallEntries}
                    handleLike={handleLike}
                    handleDislike={handleDislike}
                />

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
                            Welcome to the Torch Freedom Wall, a platform for
                            open and respectful expression. By using this
                            platform, you agree to communicate respectfully,
                            avoiding hate speech, bullying, harassment, and
                            discrimination. Offensive content, such as vulgar or
                            obscene posts, is not allowed, and feedback should
                            always be constructive. Please do not share personal
                            information, including addresses, phone numbers, or
                            sensitive data about yourself or others. While you
                            may post anonymously, all posts must comply with
                            this policy. Ensure that your posts are relevant to
                            the platform’s purpose, and avoid spam, repetitive
                            content, and advertisements. Respect intellectual
                            property rights and do not post content that
                            infringes on these rights. Posts are monitored to
                            ensure compliance with this policy. Users can report
                            posts that violate the guidelines, and these reports
                            will be reviewed with appropriate actions taken.
                            Violations may result in the removal of posts from
                            the platform.
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
                                    <option value="">
                                        How are you feeling?
                                    </option>
                                    <option value="happy">Happy</option>
                                    <option value="sad">Sad</option>
                                    <option value="annoyed">Annoyed</option>
                                    <option value="proud">Proud</option>
                                    <option value="drained">Drained</option>
                                    <option value="inlove">Inlove</option>
                                    <option value="calm">Calm</option>
                                    <option value="excited">Excited</option>
                                    <option value="angry">Angry</option>
                                    <option value="down">Down</option>
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
            </div>
        </UnauthenticatedLayout>
    );
}
