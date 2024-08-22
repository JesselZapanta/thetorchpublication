<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $data = [
            [
                'name' => 'NEWS',
                'description' => 'This is NEWS description',
                'status' => 'active',
                'category_image_path' => 'NEWS_category_image_path.png'
            ],
            [
                'name' => 'SPORTS',
                'description' => 'This is SPORTS description',
                'status' => 'active',
                'category_image_path' => 'NEWS_category_image_path.png'
            ],
            [
                'name' => 'SPORTS',
                'description' => 'This is SPORTS description',
                'status' => 'active',
                'category_image_path' => 'SPORTS_category_image_path.png'
            ],
            [
                'name' => 'FEATURE',
                'description' => 'This is FEATURE description',
                'status' => 'active',
                'category_image_path' => 'FEATURE_category_image_path.png'
            ],
            [
                'name' => 'EDITORIAL',
                'description' => 'This is EDITORIAL description',
                'status' => 'active',
                'category_image_path' => 'EDITORIAL_category_image_path.png'
            ],
            [
                'name' => 'LITERARY',
                'description' => 'This is LITERARY description',
                'status' => 'active',
                'category_image_path' => 'LITERARY_category_image_path.png'
            ],
        ];
        \App\Models\Category::insertOrIgnore($data);
    }
}
