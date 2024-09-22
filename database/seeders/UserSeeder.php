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
                'student_id' => '000000',
                'username' => 'torchadmin',
                'name' => 'torchadmin',
                'role' => 'admin',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchadmin@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '111111',
                'username' => 'assistantadviser',
                'name' => 'assistantadviser',
                'role' => 'admin',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'assistantadviser@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '543189',
                'username' => 'torcheditor',
                'name' => 'torcheditor',
                'role' => 'editor',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torcheditor@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '542369',
                'username' => 'torcheditor2',
                'name' => 'torcheditor2',
                'role' => 'editor',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torcheditor2@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '544369',
                'username' => 'torcheditor3',
                'name' => 'torcheditor3',
                'role' => 'editor',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torcheditor3@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '595469',
                'username' => 'torchwriter',
                'name' => 'torchwriter',
                'role' => 'writer',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchwriter@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '546564',
                'username' => 'torchdesigner',
                'name' => 'torchdesigner',
                'role' => 'designer',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchdesigner@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '546569',
                'username' => 'torchstudent',
                'name' => 'torchstudent',
                'role' => 'student',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchstudent@gmail.com',
                'password' => Hash::make('1'),
            ],

            [
                'student_id' => '123456',
                'username' => 'thetorchpubpress',
                'name' => 'thetorchpubpress',
                'role' => 'admin',
                'position' => 'adviser',
                'email_verified_at' => now(),
                'email' => 'jeszapanta9@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '123369',
                'username' => 'jesselzapanta',
                'name' => 'jesselzapanta',
                'role' => 'student',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'jesselzapanta9@gmail.com',
                'password' => Hash::make('1'),
            ],
        ];
        
        User::insertOrIgnore($users);
         // Generate 1000 Freedom Wall entries
        User::factory()->count(15)->create();
    }
}
