import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import ArticlePagination from "@/Components/ArticlePagination";
import DangerButton from "@/Components/DangerButton";
import FreedomWallEntries from "@/Components/FreedomWallEntries";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import React, { useState } from "react";

export default function Index({ auth, categories, freedomWallEntries, success, error }) {
    // Infinite Scroll Logic

    //state for modal create and policy
    const [policyModalOpen, setPolicyModalOpen] = useState(false);

    const [freedomWall, setFreedomWall] = useState(null); // For storing the freedomWall to edit/delete

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        body: "",
        emotion: "",
    });

    //Create and update

    // Open modal for creating a new freedomWall
    const openCreateModal = () => {
        reset(); // Reset the form to clear previous data
        setFreedomWall(null); // Clear the selected freedomWall for editing
        setIsCreateModalOpen(true);
    };

    // Open modal for editing an existing freedomWall
    const openEditModal = (freedomWall) => {
        setFreedomWall(freedomWall);
        setData({
            body: freedomWall.body,
            emotion: freedomWall.emotion,
        }); // Set the form data with the selected freedomWall's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (freedomWall) {
            // Update existing freedomWall
            put(route("freedom-wall.update", freedomWall.id), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        } else {
            // Create new freedomWall
            post(route("freedom-wall.store"), {
                onSuccess: () => {
                    setIsCreateModalOpen(false);
                    reset(); // Reset the form after successful submission
                },
            });
        }
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        reset(); // Reset the form when closing the modal
        clearErrors(); // Clear any validation errors
    };

    //policy Modal
    const openPolicyModal = () => {
        setPolicyModalOpen(true);
    };

    const closePolicyModal = () => {
        setPolicyModalOpen(false);
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

    const [sort, setSort] = useState("");
    const [emotionSort, setEmotionSort] = useState("");
    const [search, setSearch] = useState("");

    const handleSortChange = (e) => {
        const selectedValue = e.target.value;
        setSort(selectedValue);

        // Trigger the request immediately
        router.get(
            route("freedom-wall.index"),
            { sort: selectedValue, emotionSort, search },
            {
                preserveState: true,
            }
        );
    };

    const handleEmotionSortChange = (e) => {
        const selectedValue = e.target.value;
        setEmotionSort(selectedValue);

        // Trigger the request immediately
        router.get(
            route("freedom-wall.index"),
            { sort, emotionSort: selectedValue, search },
            {
                preserveState: true,
            }
        );
    };

    // Function to handle search input changes
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearch(value);

        // Trigger the search immediately if the search input is cleared
        if (value === "") {
            router.get(
                route("freedom-wall.index"),
                { sort, emotionSort, search: value },
                {
                    preserveState: true,
                }
            );
        }
    };

    // Function to handle pressing the Enter key
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            // Trigger the request immediately when Enter is pressed
            router.get(
                route("freedom-wall.index"),
                { sort, emotionSort, search },
                {
                    preserveState: true,
                }
            );
        }
    };


    const [confirmAction, setConfirmAction] = useState({
        type: "", // 'delete', 'hide', or 'report'
        entry: null,
        show: false,
    });

    const openActionModal = (entry, actionType) => {
        setConfirmAction({
            type: actionType, // 'delete', 'hide', or 'report'
            entry: entry,
            show: true,
        });
    };

    const handleAction = () => {
        if (confirmAction.entry) {
            switch (confirmAction.type) {
                case "delete":
                    router.delete(
                        route("freedom-wall.destroy", confirmAction.entry.id),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "hide":
                    post(
                        route("freedom-wall.hide", confirmAction.entry.id),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "report":
                    post(
                        route("freedom-wall.report", confirmAction.entry.id),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                default:
                    break;
            }
        }
        setConfirmAction({ type: "", entry: null, show: false });
    };


    const openDeleteModal = (entry) => {
        openActionModal(entry, "delete");
    };

    const openHideModal = (entry) => {
        openActionModal(entry, "hide");
    };

    const openReportModal = (entry) => {
        openActionModal(entry, "report");
    };

    const { flash } = usePage().props;

    return (
        <UnauthenticatedLayout
            user={auth.user}
            categories={categories}
            header={
                <div className="max-w-7xl mt-16 mx-auto flex items-center justify-center">
                    <h2 className="font-semibold text-3xl text-nowrap text-gray-800 dark:text-gray-200 leading-tight text-justify uppercase">
                        The Torch Freedom Wall
                    </h2>
                </div>
            }
        >
            <Head title="Freedom Wall" />

            <AlertSuccess flash={flash} />
            <AlertError flash={flash} />
            
            <div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4
            overflow-hidden"
            >
                <div className="w-full justify-center flex gap-4 my-4">
                    <button
                        onClick={openPolicyModal}
                        className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700 "
                    >
                        View Our Policy
                    </button>
                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-indigo-600 text-white transition-all duration-300 rounded hover:bg-indigo-700"
                    >
                        Write Something
                    </button>
                </div>
                <div className="max-w-7xl py-2 mx-auto w-full grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SelectInput
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 md:mt-4"
                        value={sort}
                        onChange={handleSortChange} // Handle the change
                    >
                        {/* <option value="">Sort by</option> */}
                        <option value="date_desc">Date: Descending</option>
                        <option value="date_asc">Date: Ascending</option>

                        <option value="likes_desc">Likes: Descending</option>
                        <option value="likes_asc">Likes: Ascending</option>

                        <option value="dislikes_desc">
                            Dislikes: Descending
                        </option>
                        <option value="dislikes_asc">
                            Dislikes: Ascending
                        </option>

                        <option value="body_desc">Body: Z-A</option>
                        <option value="body_asc">Body: A-Z</option>
                    </SelectInput>

                    <SelectInput
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 md:mt-4"
                        value={emotionSort}
                        onChange={handleEmotionSortChange} // Handle the change
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
                    </SelectInput>

                    <TextInput
                        className="w-full p-2 border border-gray-300 rounded-lg mt-1 md:mt-4"
                        value={search}
                        placeholder="Search Entry..."
                        onChange={handleSearchChange}
                        onKeyPress={handleKeyPress} // Trigger search on Enter key
                    />
                </div>
                {/* Freedom Wall Entries */}
                <FreedomWallEntries
                    auth={auth}
                    freedomWallEntries={freedomWallEntries}
                    handleLike={handleLike}
                    handleDislike={handleDislike}
                    openHideModal={openHideModal}
                    openEditModal={openEditModal}
                    openDeleteModal={openDeleteModal}
                    openReportModal={openReportModal}
                />
                <ArticlePagination
                    links={freedomWallEntries.meta.links}
                    queryParams={{
                        sort: sort,
                        emotionSort: emotionSort,
                        search: search,
                    }}
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
                        <p className="block mt-4 text-justify text-base leading-relaxed text-gray-700 dark:text-gray-400">
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
                            the platform. ==Must Update==
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
                <Modal show={isCreateModalOpen} onClose={closeCreateModal}>
                    <div className="p-6">
                        <div className="flex justify-between">
                            <h2 className="text-2xl text-indigo-600 font-bold">
                                {freedomWall
                                    ? "Edit Freedom Wall Entries"
                                    : "Create New Freedom Wall Entries"}
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
                                    type="submit"
                                >
                                    {freedomWall ? "Update" : "Submit"}
                                </button>
                            </div>
                        </form>
                    </div>
                </Modal>
            </div>
            {/* Confirm Modal */}
            <Modal
                show={confirmAction.show}
                onClose={() =>
                    setConfirmAction({ ...confirmAction, show: false })
                }
            >
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">
                        {confirmAction.type === "delete"
                            ? "Confirm Delete"
                            : confirmAction.type === "report"
                            ? "Confirm Report"
                            : "Confirm Soft Delete"}
                    </h2>
                    <p className="mt-4">
                        {confirmAction.type === "delete"
                            ? "Are you sure you want to delete this entry?"
                            : confirmAction.type === "report"
                            ? "Are you sure you want to report this entry?"
                            : "Are you sure you want to soft delete this entry?"}
                    </p>
                    <div className="mt-4 flex justify-end">
                        <SecondaryButton
                            onClick={() =>
                                setConfirmAction({
                                    ...confirmAction,
                                    show: false,
                                })
                            }
                        >
                            Cancel
                        </SecondaryButton>
                        <DangerButton onClick={handleAction} className="ml-2">
                            {confirmAction.type === "delete"
                                ? "Delete"
                                : confirmAction.type === "report"
                                ? "Report"
                                : "Soft Delete"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </UnauthenticatedLayout>
    );
}
