<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
    <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        
        <!-- Title and Meta Description -->
        <title>The Torch Publication | Student News & Journalism at Tangub City Global College</title>
        <meta name="description" content="The Torch is the official student publication of Tangub City Global College. Discover college news, events, and creative works through newsletters, tabloids, and literary folios." />
        
        <!-- Keywords for SEO -->
        <meta name="keywords" content="Tangub City Global College, student publication, student journalism, college news, newsletters, literary folios, academic articles, student voice, freedom wall, ethical journalism, TCGC" />

        <!-- Open Graph Meta Tags for Social Sharing -->
        <meta property="og:title" content="The Torch Publication | Student News at Tangub City Global College" />
        <meta property="og:description" content="The Torch is the student voice of Tangub City Global College, sharing news, events, and student creativity. Explore our monthly newsletters, literary folios, and more." />
        <meta property="og:image" content="/images/logo.jpg" />
        <meta property="og:url" content="https://torch.kod-lens.tech/" />
        <meta property="og:type" content="website" />

        <!-- Twitter Meta Tags -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Torch Publication | Student News at TCGC" />
        <meta name="twitter:description" content="Official student publication of Tangub City Global College, promoting academic discourse and creativity." />
        <meta name="twitter:image" content="/images/logo.jpg" />

        <!-- Canonical URL -->
        <link rel="canonical" href="https://torch.kod-lens.tech/" />

        <!-- Fonts -->
        <link rel="icon" href="/images/logo.jpg" />
        <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" />

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])
        @inertiaHead

        <!-- Structured Data for SEO (Educational Organization) -->
        <script type="application/ld+json">
        {
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "Tangub City Global College",
            "department": {
            "@type": "Organization",
            "name": "The Torch Publication",
            "description": "The official student publication of Tangub City Global College, promoting ethical journalism, creativity, and academic excellence.",
            "url": "https://torch.kod-lens.tech/",
            "logo": "/images/logo.jpg"
            },
            "sameAs": [
            "https://www.facebook.com/TheTORCHofficialpage",
            "https://www.facebook.com/tcgcluxmundi",
            "http://www.gadtc.edu.ph/"
            ],
            "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Service",
            "email": "thetorchpubpress@gmail.com"
            }
        }
        </script>
    </head>

    <body class="font-sans antialiased">
        @inertia
    </body>
</html>
