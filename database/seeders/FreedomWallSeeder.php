<?php

namespace Database\Seeders;

use App\Models\FreedomWall;
use Illuminate\Database\Seeder;

class FreedomWallSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate 1000 Freedom Wall entries
        FreedomWall::factory()->count(10)->create();
    }
}
