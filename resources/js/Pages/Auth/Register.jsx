import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        profile_image_path: "",
        student_id: "",
        username: "",
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        return () => {
            reset("password", "password_confirmation");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        // Validate student_id
        fetch(`/validate-student/${data.student_id}`)
            .then((response) => response.json()) // This will parse the response as JSON
            .then((isValidStudent) => {
                if (isValidStudent) {
                    // If true, make the post request
                    post(route("register"));
                } else {
                    // If false, show an alert
                    alert("Student not found");
                }
            })
            .catch((error) => {
                console.error("An error occurred during validation:", error);
            });
    };


    return (
        <GuestLayout>
            <Head title="Register" />

            <div className="w-full rounded-lg overflow-hidden mb-4">
                <Link href="/">
                    <img
                        src="/images/about.png"
                        alt="Torch Logo"
                        className="w-full j-full"
                    />
                </Link>
            </div>

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="student_id" value="Student Id" />

                    <TextInput
                        id="student_id"
                        name="student_id"
                        value={data.student_id}
                        className="mt-1 block w-full"
                        autoComplete="student_id"
                        onChange={(e) => setData("student_id", e.target.value)}
                        required
                    />

                    <InputError message={errors.student_id} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="username" value="Username" />

                    <TextInput
                        id="username"
                        name="username"
                        value={data.username}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("username", e.target.value)}
                        required
                    />

                    <InputError message={errors.username} className="mt-2" />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="name" value="Full Name" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full"
                        autoComplete="name"
                        onChange={(e) => setData("name", e.target.value)}
                        required
                    />

                    <InputError message={errors.name} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={(e) => setData("email", e.target.value)}
                        required
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirm Password"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData("password_confirmation", e.target.value)
                        }
                        required
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>
                <div className="mt-4">
                    <InputLabel htmlFor="profile_image_path" value="Profile" />

                    <TextInput
                        id="profile_image_path"
                        type="file"
                        name="profile_image_path"
                        className="mt-2 block w-full cursor-pointer"
                        onChange={(e) =>
                            setData("profile_image_path", e.target.files[0])
                        }
                    />

                    <InputError
                        message={errors.profile_image_path}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-end mt-8">
                    <Link
                        href={route("login")}
                        className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                    >
                        Already registered?
                    </Link>

                    <PrimaryButton className="ms-4" disabled={processing}>
                        Register
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
