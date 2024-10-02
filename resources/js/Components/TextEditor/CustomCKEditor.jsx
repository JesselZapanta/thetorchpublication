import React, { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import {
    ClassicEditor,
    Autoformat,
    Bold,
    Italic,
    Underline,
    BlockQuote,
    Base64UploadAdapter,
    CKFinder,
    CKFinderUploadAdapter,
    CloudServices,
    // CKBox,
    Essentials,
    Heading,
    Image,
    ImageCaption,
    ImageResize,
    ImageStyle,
    ImageToolbar,
    ImageUpload,
    PictureEditing,
    Indent,
    IndentBlock,
    Link,
    List,
    MediaEmbed,
    Mention,
    Paragraph,
    PasteFromOffice,
    Table,
    TableColumnResize,
    TableToolbar,
    TextTransformation,
    Undo,
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";


const CustomCKEditor = ({ value, onChange, className = "", id }) => {
    const editorRef = useRef();

    return (
        <div className={className}>
            <CKEditor
                editor={ClassicEditor}
                data={value}
                onReady={(editor) => {
                    editorRef.current = editor; // Store the editor instance
                }}
                onChange={(event, editor) => {
                    const data = editor.getData();
                    onChange(data); // Call onChange to update the state
                }}
                // config={{
                //     toolbar: [
                //         "heading",
                //         "|",
                //         "bold",
                //         "italic",
                //         "link",
                //         // "bulletedList", not working
                //         // "numberedList", not working
                //         "blockQuote",
                //         "undo",
                //         "redo",
                //     ],
                //     // No media or table options included
                // }}
                config={{
                    toolbar: {
                        items: [
                            "undo",
                            "redo",
                            "|",
                            // "heading",
                            "|",
                            "bold",
                            "italic",
                            "underline",
                            "|",
                            "link",
                            "uploadImage",
                            "resizeImage",
                            // "ckbox",
                            "blockQuote",
                            "mediaEmbed",
                            "|",
                            // "bulletedList",
                            // "numberedList",
                            "|",
                            "outdent",
                            "indent",
                        ],
                    },

                    heading: {
                        options: [
                            {
                                model: "paragraph",
                                title: "Paragraph",
                                class: "ck-heading_paragraph",
                            },
                            {
                                model: "heading1",
                                view: "h1",
                                title: "Heading 1",
                                class: "ck-heading_heading1",
                            },
                            {
                                model: "heading2",
                                view: "h2",
                                title: "Heading 2",
                                class: "ck-heading_heading2",
                            },
                            {
                                model: "heading3",
                                view: "h3",
                                title: "Heading 3",
                                class: "ck-heading_heading3",
                            },
                            {
                                model: "heading4",
                                view: "h4",
                                title: "Heading 4",
                                class: "ck-heading_heading4",
                            },
                        ],
                    },

                    image: {
                        resizeOptions: [
                            {
                                name: "resizeImage:original",
                                label: "Default image width",
                                value: null,
                            },
                            {
                                name: "resizeImage:50",
                                label: "50% page width",
                                value: "50",
                            },
                            {
                                name: "resizeImage:75",
                                label: "75% page width",
                                value: "75",
                            },
                        ],
                        toolbar: [
                            "imageTextAlternative",
                            "toggleImageCaption",
                            "|",
                            "imageStyle:inline",
                            "imageStyle:wrapText",
                            "imageStyle:breakText",
                            "|",
                            "resizeImage",
                        ],
                    },

                    link: {
                        addTargetToExternalLinks: true,
                        defaultProtocol: "https://",
                    },
                    table: {
                        contentToolbar: [
                            "tableColumn",
                            "tableRow",
                            "mergeTableCells",
                        ],
                    },

                    plugins: [
                        Autoformat,
                        BlockQuote,
                        Bold,
                        CKFinder,
                        CKFinderUploadAdapter,
                        CloudServices,
                        Essentials,
                        Heading,
                        Image,
                        ImageCaption,
                        ImageResize,
                        ImageStyle,
                        ImageToolbar,
                        ImageUpload,
                        Base64UploadAdapter,
                        Indent,
                        IndentBlock,
                        Italic,
                        Link,
                        List,
                        MediaEmbed,
                        Mention,
                        Paragraph,
                        PasteFromOffice,
                        PictureEditing,
                        Table,
                        TableColumnResize,
                        TableToolbar,
                        TextTransformation,
                        Underline,
                    ],
                    // contentStyle:
                    //     "body { border-radius: 10px; padding: 10px; }", 
                    //licenseKey: '<YOUR_LICENSE_KEY>',
                    // mention: {
                    //     // Mention configuration
                    // },
                    // initialData: "<p>Hello from CKEditor 5 in React!</p>",
                }}
            />
        </div>
    );
};

export default CustomCKEditor;
