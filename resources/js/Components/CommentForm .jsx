import React from "react";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import InputError from "@/Components/InputError";
import { Link } from "@inertiajs/react";

export default function CommentForm({
    auth,
    data,
    setData,
    handleSubmit,
    errors,
}) {
    return (
        <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg my-4 p-4">
            {auth.user ? (
                <form onSubmit={handleSubmit}>
                    {/* Comment Body */}
                    <div className="mt-2 w-full">
                        <InputLabel htmlFor="body" value="Write a Comment" />
                        <TextAreaInput
                            id="body"
                            type="text"
                            name="body"
                            placeholder={`Comment as ${auth.user.name}`}
                            value={data.body}
                            className="mt-2 block w-full min-h-24 resize-none"
                            onChange={(e) => setData("body", e.target.value)}
                        />
                        <InputError message={errors.body} className="mt-2" />
                    </div>
                    <button
                        type="submit"
                        className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                    >
                        Comment
                    </button>
                </form>
            ) : (
                <Link href={route("login")}>
                    <p className="text-gray-400 w-full text-center">
                        Please log in to your account to comment.
                    </p>
                </Link>
            )}
        </div>
    );
}
