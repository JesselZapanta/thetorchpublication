import AlertError from "@/Components/AlertError";
import AlertSuccess from "@/Components/AlertSuccess";
import DangerButton from "@/Components/DangerButton";
import Dropdown from "@/Components/Dropdown";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import SelectInput from "@/Components/SelectInput";
import TextAreaInput from "@/Components/TextAreaInput";
import UnauthenticatedLayout from "@/Layouts/UnauthenticatedLayout";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

export default function Show({ auth, categories, entry, success }) {
    // useEffect(() => {
    //     window.scrollTo(0, 0);
    // }, []);

    //tts
    const [isSpeaking, setIsSpeaking] = useState(null);
    const handleSpeak = (entry) => {
        // Stop any ongoing speech synthesis
        speechSynthesis.cancel();

        // If the same entry's button is clicked again, stop the speech and reset state
        if (isSpeaking === entry.id) {
            setIsSpeaking(null);
        } else {
            // Create a SpeechSynthesisUtterance with a pause after the name
            const textToRead = `${entry.body}`;
            const utterance = new SpeechSynthesisUtterance(textToRead);

            utterance.onend = () => {
                setIsSpeaking(null);
            };

            // Set the current speaking entry ID and start speaking
            setIsSpeaking(entry.id);
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

    //Colors
    const emotionColors = {
        happy: "bg-yellow-700",
        sad: "bg-blue-800",
        annoyed: "bg-red-700",
        proud: "bg-green-700",
        drained: "bg-gray-700",
        inlove: "bg-pink-700",
        calm: "bg-blue-600",
        excited: "bg-purple-700",
        angry: "bg-red-800",
        down: "bg-gray-600",
    };

    const [freedomWall, setFreedomWall] = useState(null); // For storing the freedomWall to edit/delete

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const { data, setData, post, put, errors, reset, clearErrors } = useForm({
        body: "",
        emotion: "",
    });

    //

    // update

    const openEditModal = (freedomWall) => {
        setFreedomWall(freedomWall);
        setData({
            body: freedomWall.body,
            emotion: freedomWall.emotion,
        }); // Set the form data with the selected entry's data
        setIsCreateModalOpen(true);
    };

    const onSubmit = (e) => {
        e.preventDefault();

        if (freedomWall) {
            // Update existing freedomWall
            router.put(
                route("freedom-wall.update", freedomWall.id),
                {
                    body: data.body, // Make sure the data is passed properly
                    emotion: data.emotion,
                },
                {
                    onSuccess: () => {
                        setIsCreateModalOpen(false);
                        reset(); // Reset the form after successful submission
                    },
                }
            );
        }
    };

    const closeEditModal = () => {
        setIsCreateModalOpen(false);
        reset(); // Reset the form when closing the modal
        clearErrors(); // Clear any validation errors
    };

    //

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
                    // alert(entry.data.id);
                    router.delete(
                        route(
                            "freedom-wall.destroy",
                            confirmAction.entry
                        ),
                        {
                            preserveScroll: true,
                        }
                    );
                    break;
                case "hide":
                    post(route("freedom-wall.hide", confirmAction.entry), {
                        preserveScroll: true,
                    });
                    break;
                case "report":
                    post(route("freedom-wall.report", confirmAction.entry), {
                        preserveScroll: true,
                    });
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
                className="max-w-7xl min-h-[70vh] mx-auto px-4 sm:px-6 lg:px-8 py-4
            overflow-hidden"
            >
                {/* Show Freedom Wall */}
                {/* <pre className="text-white">
                    {JSON.stringify(entry, null, 2)}
                </pre> */}
                <div className="max-w-xl py-2 mx-auto w-full">
                    <div className="mt-6 flex justify-end gap-2">
                        <SecondaryButton
                            href={route("freedom-wall.index")}
                        >
                            Back
                        </SecondaryButton>
                    </div>
                    <div className="relative mt-4 flex w-full flex-col rounded-xl dark:bg-gray-800 bg-gray-400 bg-clip-border text-gray-300 shadow-lg overflow-hidden">
                        <div className="dark:bg-gray-700 bg-gray-600 p-2 w-full h-16 flex justify-between items-center">
                            <div className="flex gap-2">
                                <div className="w-12 h-12 rounded-full border-2 border-indigo-500 overflow-hidden">
                                    <img
                                        src="/images/default/profile.jpg"
                                        alt=""
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-base">
                                        Anonymous
                                    </h4>
                                    <p className="text-sm">
                                        Publish: {entry.data.created_at}
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
                                                className="size-6 text-gray-50 dark:text-gray-50 cursor-pointer"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                />
                                            </svg>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            {/* change later */}
                                            {auth.user.role !== "student" &&
                                                auth.user.role !==
                                                    "student_contributor" && (
                                                    <Dropdown.Link
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            openHideModal(
                                                                entry.data.id
                                                            );
                                                        }}
                                                    >
                                                        Hide
                                                    </Dropdown.Link>
                                                )}

                                            {auth.user.id ===
                                                entry.data.user_id && (
                                                <Dropdown>
                                                    <button
                                                        className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                                                        onClick={() =>
                                                            openDeleteModal(
                                                                entry.data.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </Dropdown>
                                            )}
                                            {auth.user.id !==
                                                entry.data.user_id &&
                                                (auth.user.role === "student" ||
                                                    auth.user.role ===
                                                        "student_contributor") && (
                                                    <Dropdown>
                                                        <button
                                                            className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                                                            onClick={() =>
                                                                openReportModal(
                                                                    entry.data
                                                                        .id
                                                                )
                                                            }
                                                        >
                                                            Report
                                                        </button>
                                                    </Dropdown>
                                                )}

                                            {auth.user.id ===
                                                entry.data.user_id && (
                                                <Dropdown>
                                                    <button
                                                        className="block w-full px-4 py-2 text-start text-sm leading-5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800 transition duration-150 ease-in-out"
                                                        onClick={() =>
                                                            openEditModal(
                                                                entry.data
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                </Dropdown>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}
                        </div>
                        <div className="relative flex gap-1 items-end justify-end p-2 transition-all duration-300">
                            <p
                                className={`${
                                    emotionColors[entry.data.emotion] ||
                                    "bg-gray-500"
                                } text-white p-2 rounded-lg max-w-md mt-16 break-words text-justify`}
                            >
                                {entry.data.body}
                            </p>

                            <div>
                                <button
                                    className={`${
                                        isSpeaking === entry.data.id
                                            ? "text-indigo-400 animate-pulse"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleSpeak(entry)}
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
                        <div className="dark:bg-gray-700 bg-gray-600 p-2  w-full h-16 flex justify-between items-center">
                            <div className="flex gap-4">
                                <span
                                    className={`${
                                        entry.data.user_has_liked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {entry.data.likes_count}
                                </span>
                                <button
                                    className={`${
                                        entry.data.user_has_liked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleLike(entry.data.id)}
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
                                        entry.data.user_has_disliked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {entry.data.dislikes_count}
                                </span>
                                <button
                                    className={`${
                                        entry.user_has_disliked
                                            ? "text-indigo-400"
                                            : "text-gray-400"
                                    }`}
                                    onClick={() => handleDislike(entry.data.id)}
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
                                        {entry.data.emotion}
                                    </span>
                                </h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Create/Edit Modal */}
            <Modal show={isCreateModalOpen} onClose={closeEditModal}>
                <div className="p-6">
                    <div className="flex justify-between">
                        <h2 className="text-2xl text-indigo-600 font-bold">
                            Edit Freedom Wall Entries
                        </h2>
                        <button
                            onClick={closeEditModal}
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
                                <option value="">How are you feeling?</option>
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
                                // onClick={closeEditModal}
                                className="ml-auto px-4 py-2 bg-indigo-600 text-white transition-all rounded hover:bg-indigo-700"
                                type="submit"
                            >
                                Update
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
            {/* Action */}
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
                            : "Confirm Hide"}
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
                                : "Hide"}
                        </DangerButton>
                    </div>
                </div>
            </Modal>
        </UnauthenticatedLayout>
    );
}
