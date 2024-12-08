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
                'student_id' => '111111',
                'username' => 'torchadmin',
                'name' => 'Torch Admin',
                'role' => 'admin',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchadmin@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '222222',
                'username' => 'assistantadviser',
                'name' => 'Torch Assistant Adviser',
                'role' => 'admin',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'assistantadviser@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '543189',
                'username' => 'torcheditor1',
                'name' => 'Torch Editor 1',
                'role' => 'editor',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torcheditor1@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '542369',
                'username' => 'torcheditor2',
                'name' => 'Torch Editor 2',
                'role' => 'editor',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torcheditor2@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '544369',
                'username' => 'torcheditor3',
                'name' => 'Torch Editor 3',
                'role' => 'editor',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torcheditor3@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '595469',
                'username' => 'torchwriter1',
                'name' => 'Torch Writer 1',
                'role' => 'writer',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchwriter1@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '546564',
                'username' => 'torchdesigner1',
                'name' => 'Torch Designer 1',
                'role' => 'designer',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchdesigner1@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '546569',
                'username' => 'torchstudent1',
                'name' => 'Torch Student 1',
                'role' => 'student',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'torchstudent1@gmail.com',
                'password' => Hash::make('1'),
            ],

            [   
                'student_id' => '123369',
                'username' => 'jesselzapanta',
                'name' => 'Jessel Zapanta',
                'role' => 'student',
                'position' => 'none',
                'email_verified_at' => now(),
                'email' => 'jesselzapanta9@gmail.com',
                'password' => Hash::make('1'),
            ],

            [
                'student_id' => '123456',
                'username' => 'jessel zapanta',
                'name' => 'jessel zapanta',
                'role' => 'admin',
                'position' => 'adviser',
                'email_verified_at' => now(),
                'email' => 'jeszapanta9@gmail.com',
                'password' => Hash::make('1'),
            ],
        ];
        
        User::insertOrIgnore($users);
         // Generate 1000 Freedom Wall entries
        // User::factory()->count(15)->create();
    }
}
