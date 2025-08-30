import { Link, router } from "@inertiajs/react";
import React from "react";


import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";



export default function PublicationCard({ publication }) {
    const incrementViews = () => {
        router.post(
            // `/articles/${publication.id}/increment-views`,
            {},
            {
                preserveScroll: true,
                // onSuccess: () => {
                //     router.visit(route("publication.read", publication.id));
                // },
            }
        );
    };

    //text limit
    const truncate = (text, limit) => {
        if (text.length > limit) {
            return text.slice(0, limit) + "...";
        }
        return text;
    };

            
    useEffect(() => {
        AOS.init({
            duration: 1000, // Animation duration in ms
            // once: true, // Whether animation should happen only once
        });
    }, []);


    return (
        <>
            {/* <pre className="text-gray-900">
                {JSON.stringify(publication, null, 2)}
            </pre> */}
            <div data-aos="fade-up">
                <div className="overflow-hidden rounded-xl h-96 shadow-lg">
                    <a href={publication.publication_file_path} target="blank">
                        <img
                            src={publication.publication_thumbnail_image_path}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/images/default/article.png"; //todo
                            }}
                            alt={publication.description}
                        />
                    </a>
                </div>
                <p className="block mt-2 text-center">
                    {truncate(publication?.description, 40)}

                    {publication?.category && (
                        <p className="block italic uppercase text-center">
                            ({truncate(publication.category, 40)})
                        </p>
                    )}
                </p>
            </div>
        </>
    );
}
