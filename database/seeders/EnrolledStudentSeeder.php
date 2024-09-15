<?php

namespace Database\Seeders;

use App\Models\EnrolledStudent;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EnrolledStudentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        EnrolledStudent::factory()->count(1000)->create();
    }
}
