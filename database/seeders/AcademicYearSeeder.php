<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AcademicYearSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'code' => '241',
                'description' => '1ST SEM AY 2024-2025',
                'status' => 'active',
            ],
            [
                'code' => '242',
                'description' => '2ND SEM AY 2024-2025',
                'status' => 'inactive',
            ],
            [
                'code' => '243',
                'description' => 'SUMMER AY 2024-2025',
                'status' => 'inactive',
            ],
            
            [
                'code' => '231',
                'description' => '1ST SEM AY 2023-2024',
                'status' => 'inactive',
            ],
            [
                'code' => '232',
                'description' => '2ND SEM AY 2023-2024',
                'status' => 'inactive',
            ],
            [
                'code' => '233',
                'description' => 'SUMMER AY 2023-2024',
                'status' => 'inactive',
            ],
        ];
        \App\Models\AcademicYear::insertOrIgnore($data);
    }
}
