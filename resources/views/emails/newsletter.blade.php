<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Newsletter</title>
</head>
<body>
    <h1>{{ $newsletter->description }}</h1> <!-- Ensure description is a string -->
    <p>{{ $messages }}</p>

    <p>
        The full newsletter is available as a PDF.
        <a href="{{ asset('storage/' . $newsletter->newsletter_file_path) }}" download>Click here to download the PDF</a>.
    </p>
</body>
</html>
