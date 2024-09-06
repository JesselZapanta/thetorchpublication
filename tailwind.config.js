import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                "custom-gradient":
                    "linear-gradient(to right, #0c251c 0%, #0c251c 25%, #1a3a3d 50%, #1a3a3d 100%)",
            },
        },
    },

    plugins: [forms],
    //user.theme=light show this if dark remove, the
    darkMode: "class",
};
