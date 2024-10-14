<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Title and Meta Description -->
        <title>The Torch Publication | The Torch is Tangub City Global College's official publication.</title>
        <meta name="description" content="The Torch is the official student publication of Tangub City Global College. Discover college news, events, and creative works through newsletters, tabloids, and literary folios." />
        
        <!-- Keywords for SEO -->
        <meta name="keywords" content="Tangub City Global College, student publication, student journalism, college news, newsletters, literary folios, academic articles, student voice, freedom wall, ethical journalism, TCGC" />


        <!-- Fonts -->
        <link rel="icon" href="/images/logo.jpg" />
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead
    </head>

    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
