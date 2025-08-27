import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // For month view
import { Head, Link } from "@inertiajs/react";
import AdminAuthenticatedLayout from "@/Layouts/AdminAuthenticatedLayout";
import SecondaryButton from "@/Components/SecondaryButton";

export default function MyCalendar({ auth, publications, AdminBadgeCount }) {
    // Map publications to FullCalendar events
    const events = publications.map((publication) => ({
        // title: "[" + publication.status + "] " + publication.name,
        title: publication.description,
        date: publication.distributed_at.split(" ")[0],
        // date: publication.newsletter_completed_date
        //     ? publication.newsletter_completed_date.split(" ")[0]
        //     : publication.assigned_date,

        url: route("publication.edit", publication.id),
    }));

    return (
        <AdminAuthenticatedLayout
            AdminBadgeCount={AdminBadgeCount}
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold sm:text-sm lg:text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Distributed Publication Calendar
                    </h2>
                    <div className="flex gap-4">
                        <SecondaryButton href={route("publication.index")}>
                            Back
                        </SecondaryButton>
                    </div>
                </div>
            }
        >
            <Head title="Publication" />
            {/* 
            <pre className="text-gray-900">
                {JSON.stringify(publications, null, 2)}
            </pre> */}

            <div className="py-4">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <div className="overflow-auto mt-2">
                                <FullCalendar
                                    plugins={[dayGridPlugin]} // Only loading the month view
                                    initialView="dayGridMonth" // Default view to month
                                    events={events} // Events fetched from the server
                                    eventDisplay="list-item" // Ensure event dots are displayed
                                    eventClick={(info) => {
                                        info.jsEvent.preventDefault(); // Prevent default navigation
                                        if (info.event.url) {
                                            window.open(
                                                info.event.url,
                                                "_self"
                                            ); // Open link in the same tab
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminAuthenticatedLayout>
    );
}
