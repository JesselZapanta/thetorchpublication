<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Category; // Assuming you have a Category model

class ArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Fetch all categories
        $categories = Category::all();

        // Loop through each category and create an article
        foreach ($categories as $category) {
            $data = [
                'created_by' => 1,
                // 'author' => null, //todo
                'category_id' => $category->id,
                'slug' => 'Sample',//todo
                'excerpt' => 'Sample',//todo
                'academic_year_id' => 1,//todo
                'edited_by' => 1,
                'layout_by' => 1,
                'title' => 'Sample title for ' . $category->name,
                'caption' => 'Sample caption for ' . $category->name,
                'article_image_path' => strtolower($category->name) . '_article_image_path.png',
                'body' => 'This is a sample body for the ' . $category->name . ' category.',
                'status' => 'published',
                'is_featured' => 0,
                'is_anonymous' => 0,//todo
                'views' => 20
            ];

            \App\Models\Article::insertOrIgnore($data);
        }
    }
}
