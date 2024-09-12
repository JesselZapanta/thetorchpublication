import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import StudentAuthenticatedLayout from "@/Layouts/StudentAuthenticatedLayout";
import EditorAuthenticatedLayout from "@/Layouts/EditorAuthenticatedLayout";
import WriterAuthenticatedLayout from "@/Layouts/WriterAuthenticatedLayout";
import DeleteUserForm from "./Partials/DeleteUserForm";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head } from "@inertiajs/react";
import DesignerAuthenticatedLayout from "@/Layouts/DesignerAuthenticatedLayout";

export default function Edit({ auth, mustVerifyEmail, status }) {

    const Layout =
        auth.user.role === "admin"
            ? AdminAuthenticatedLayout
            : auth.user.role === "editor"
            ? EditorAuthenticatedLayout
            : auth.user.role === "writer"
            ? WriterAuthenticatedLayout
            : auth.user.role === "designer"
            ? DesignerAuthenticatedLayout
            : StudentAuthenticatedLayout;


    return (
        <Layout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="max-w-xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <UpdatePasswordForm className="max-w-xl" />
                    </div>

                    <div className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg">
                        <DeleteUserForm className="max-w-xl" />
                    </div>
                </div>
            </div>
        </Layout>
    );
}
