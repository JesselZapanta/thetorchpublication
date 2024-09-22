import { Head, useForm } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import React, { useState } from "react";
import InputLabel from "@/Components/InputLabel";
import SelectInput from "@/Components/SelectInput";
import InputError from "@/Components/InputError";
import TextInput from "@/Components/TextInput";
import SecondaryButton from "@/Components/SecondaryButton";
import Modal from "@/Components/Modal";
import TextAreaInput from "@/Components/TextAreaInput";

export default function Edit({ auth, newsletter, badgeCount }) {
    const { data, setData, post, errors } = useForm({
        message:
            "Our latest newsletter is packed with highlights, updates, and valuable insights. From exciting events that brought our community together to important announcements shaping our future, there's something for everyone. Whether you're interested in the latest trends, curious about upcoming initiatives, or just want to stay informed, this newsletter has it all. Don't miss out on this detailed recap of the past few months. Download or click the file attached to read our latest newsletter and stay connected with everything that's happening.",
        password: "",
    });

    const onSubmit = () => {
        post(route("newsletter.distribute", newsletter.id));
    };

    const [confirmUpdate, setConfirmUpdate] = useState(false);

    const openUpdateModal = () => {
        setConfirmUpdate(true);
    };

    const handleConfirmUpdate = () => {
        setConfirmUpdate(false);
        onSubmit();
    };

    return (
        <AdminAuthenticatedLayout
            badgeCount={badgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Distribute Newsletter
                    </h2>
                </div>
            }
        >
            <Head title="Distribute Newsletter" />

            {/* <pre className="text-gray-900">
                {JSON.stringify(newsletter, null, 2)}
            </pre> */}

            <div className="py-12">
                <div className="max-w-5xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        {newsletter.newsletter_file_path && (
                            <div className="w-full h-[400px]">
                                <iframe
                                    className="w-full h-full"
                                    src={newsletter.newsletter_file_path}
                                ></iframe>
                            </div>
                        )}
                        <form
                            onSubmit={onSubmit}
                            className="p-4 sm:p8 bg-white dark:bg-gray-800 shadow "
                        >
                            <div className="mt-4">
                                <InputLabel htmlFor="message" value="Message" />
                                <TextAreaInput
                                    id="message"
                                    type="text"
                                    name="message"
                                    value={data.message}
                                    className="mt-2 block w-full min-h-32 text-justify"
                                    onChange={(e) =>
                                        setData("message", e.target.value)
                                    }
                                />
                                <InputError
                                    message={errors.message}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-4">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password || ""}
                                    className="mt-1 block w-full"
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <SecondaryButton
                                    href={route("newsletter.index")}
                                >
                                    Cancel
                                </SecondaryButton>
                                <button
                                    type="button"
                                    className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                                    onClick={openUpdateModal}
                                >
                                    Distribute
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            {/* Confirm Update Modal */}
            <Modal show={confirmUpdate} onClose={() => setConfirmUpdate(false)}>
                <div className="p-6 text-gray-900 dark:text-gray-100">
                    <h2 className="text-base font-bold">Confirm Distribute</h2>
                    <p className="mt-4">
                        Are you sure you want to distribute this newsletter?
                    </p>
                    <div className="mt-4 flex justify-end gap-2">
                        <SecondaryButton
                            onClick={() => setConfirmUpdate(false)}
                        >
                            Cancel
                        </SecondaryButton>
                        <button
                            type="button"
                            className="px-4 py-2 bg-emerald-600 text-white transition-all duration-300 rounded hover:bg-emerald-700"
                            onClick={handleConfirmUpdate}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </Modal>
        </AdminAuthenticatedLayout>
    );
}
