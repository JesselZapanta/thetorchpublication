import React from "react";

const Newsletter = ({ newsletter }) => {
    return (
        <div>
            <h1>{newsletter.title}</h1>
            <p>{newsletter.content}</p>
            <p>
                You can view the full newsletter{" "}
                <a
                    href={`/storage/${newsletter.newsletter_file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    here
                </a>
                .
            </p>
        </div>
    );
};

export default Newsletter;
