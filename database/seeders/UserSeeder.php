<?php

namespace Database\Seeders;

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
                'profile_image_path' => 'profile.png',
                'email' => 'thetorchpubpress@gmail.com',
                'password' => Hash::make('password'),
            ],

            [
                'student_id' => '123369',
                'username' => 'jesselzapanta',
                'name' => 'jesselzapanta',
                'role' => 'student',
                'position' => 'none',
                'profile_image_path' => 'profile.png',
                'email' => 'jesselzapanta@gmail.com',
                'password' => Hash::make('password'),
            ],
        ];
        
        \App\Models\User::insertOrIgnore($users);
    }
}
