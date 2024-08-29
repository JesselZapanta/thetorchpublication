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
        // Generate 50 Freedom Wall entries
        FreedomWall::factory()->count(1000)->create();
    }
}
