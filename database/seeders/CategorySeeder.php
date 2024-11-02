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
                'name' => 'Annoucements',
                'description' => 'This is annoucements description',
                'slug' => 'annoucements',
                'status' => 'active',
            ],
            [
                'name' => 'news',
                'description' => 'This is news description',
                'slug' => 'news',
                'status' => 'active',
            ],
            [
                'name' => 'Sports',
                'description' => 'This is sports description',
                'slug' => 'sports',
                'status' => 'active',
            ],
            [
                'name' => 'Feature',
                'description' => 'This is feature description',
                'slug' => 'feature',
                'status' => 'active',
            ],
            [
                'name' => 'Editorial',
                'description' => 'This is editorial description',
                'slug' => 'editorial',
                'status' => 'active',
            ],
            [
                'name' => 'Literary',
                'description' => 'This is literary description',
                'slug' => 'literary',
                'status' => 'active',
            ],
            [
                'name' => 'Others',
                'description' => 'This is others description',
                'slug' => 'others',
                'status' => 'active',
            ],
        ];
        \App\Models\Category::insertOrIgnore($data);
    }
}
