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
                'name' => 'ANNOUNCEMENTS',
                'description' => 'This is ANNOUNCEMENTS description',
                'status' => 'active',
            ],
            [
                'name' => 'NEWS',
                'description' => 'This is NEWS description',
                'status' => 'active',
            ],
            [
                'name' => 'SPORTS',
                'description' => 'This is SPORTS description',
                'status' => 'active',
            ],
            [
                'name' => 'FEATURE',
                'description' => 'This is FEATURE description',
                'status' => 'active',
            ],
            [
                'name' => 'EDITORIAL',
                'description' => 'This is EDITORIAL description',
                'status' => 'active',
            ],
            [
                'name' => 'LITERARY',
                'description' => 'This is LITERARY description',
                'status' => 'active',
            ],
            [
                'name' => 'OTHERS',
                'description' => 'This is OTHERS description',
                'status' => 'active',
            ],
        ];
        \App\Models\Category::insertOrIgnore($data);
    }
}
