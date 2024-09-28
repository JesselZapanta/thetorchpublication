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
                'start_at' => '2024-08-01 00:00:00',
                'end_at' => '2024-12-27 00:00:00',
            ],
            [
                'code' => '242',
                'description' => '2ND SEM AY 2024-2025',
                'status' => 'inactive',
                'start_at' => '2025-01-01 00:00:00',
                'end_at' => '2025-06-01 00:00:00',
            ],
            [
                'code' => '243',
                'description' => 'SUMMER AY 2024-2025',
                'status' => 'inactive',
                'start_at' => '2024-06-01 00:00:00',
                'end_at' => '2024-08-01 00:00:00',
            ],
            [
                'code' => '231',
                'description' => '1ST SEM AY 2023-2024',
                'status' => 'inactive',
                'start_at' => '2023-08-01 00:00:00',
                'end_at' => '2023-12-31 00:00:00',
            ],
            [
                'code' => '232',
                'description' => '2ND SEM AY 2023-2024',
                'status' => 'inactive',
                'start_at' => '2024-01-01 00:00:00',
                'end_at' => '2024-05-31 00:00:00',
            ],
            [
                'code' => '233',
                'description' => 'SUMMER AY 2023-2024',
                'status' => 'inactive',
                'start_at' => '2024-05-31 00:00:00',
                'end_at' => '2024-07-31 00:00:00',
            ],

            [
                'code' => '241',
                'description' => '1ST SEM AY 2024-2025',
                'status' => 'inactive',
                'start_at' => '2024-08-01 00:00:00',
                'end_at' => '2024-12-27 00:00:00',
            ]
            
        ];
        \App\Models\AcademicYear::insertOrIgnore($data);
    }
}
