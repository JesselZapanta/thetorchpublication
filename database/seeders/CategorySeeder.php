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
                'name' => 'annoucements',
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
                'name' => 'sports',
                'description' => 'This is sports description',
                'slug' => 'sports',
                'status' => 'active',
            ],
            [
                'name' => 'feature',
                'description' => 'This is feature description',
                'slug' => 'feature',
                'status' => 'active',
            ],
            [
                'name' => 'editorial',
                'description' => 'This is editorial description',
                'slug' => 'editorial',
                'status' => 'active',
            ],
            [
                'name' => 'literary',
                'description' => 'This is literary description',
                'slug' => 'literary',
                'status' => 'active',
            ],
            [
                'name' => 'others',
                'description' => 'This is others description',
                'slug' => 'others',
                'status' => 'active',
            ],
        ];
        \App\Models\Category::insertOrIgnore($data);
    }
}
