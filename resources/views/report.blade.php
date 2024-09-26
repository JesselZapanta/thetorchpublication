<!doctype html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
        }
        h1 {
            font-size: 24px;
            font-weight: bold;
            text-decoration: underline;
        }
        .article-container {
            margin-top: 16px;
        }
        .article-title {
            font-size: 12px;
        }
        .article-dates {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
        }
        .image-container {
            overflow: hidden;
            height: 250px;
            border: 2px solid #ccc;
            margin-bottom: 16px;
        }
        .image-container img {
            object-fit: cover;
            width: 100%;
            height: 100%;
        }
    </style>
</head>
<body>
    <h1>Articles</h1>
    @foreach($editedArticlesDetais as $article)
        <div class="article-container">
            <p class="article-title">
                Title: {{ $article->title }}
            </p>
            <div class="article-dates">
                <p>
                    Edited Date: {{ $article->edited_at }}
                </p>
                <p>
                    Published Date: {{ $article->published_date }}
                </p>
            </div>
            <div class="image-container">
                @if($article->article_image_path)
                    <img
                        src="/storage/{{$article->article_image_path}}"
                    />
                @endif
            </div>
        </div>
    @endforeach
</body>
</html>
