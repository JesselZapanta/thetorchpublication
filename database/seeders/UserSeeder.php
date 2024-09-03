<?php

namespace Database\Seeders;

use App\Models\User;
use Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $users = [
            [
                'student_id' => '123456',
                'username' => 'thetorchpubpress',
                'name' => 'thetorchpubpress',
                'role' => 'admin',
                'position' => 'adviser',
                // 'profile_image_path' => 'profile.png',
                'email' => 'jeszapanta9@gmail.com',
                'password' => Hash::make('password'),
            ],

            [   
                'student_id' => '123369',
                'username' => 'jesselzapanta',
                'name' => 'jesselzapanta',
                'role' => 'student',
                'position' => 'none',
                // 'profile_image_path' => 'profile.png',
                'email' => 'jesselzapanta9@gmail.com',
                'password' => Hash::make('password'),
            ],
        ];
        
        User::insertOrIgnore($users);
         // Generate 1000 Freedom Wall entries
        User::factory()->count(8)->create();
    }
}
