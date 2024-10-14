<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [   
                'name' => 'Glydel Abella',
                'role' => 'admin',
                'position' => 'Torch Adviser',
                'status' => 'active',
            ],
            [   
                'name' => 'Paul Kristian Nabo',
                'role' => 'admin',
                'position' => 'Torch Assistant Adviser',
                'status' => 'active',
            ],
            [   
                'name' => 'Irish Tagailo',
                'role' => 'editor',
                'position' => 'Editor-in-Chief',
                'status' => 'active',
            ],
            [   
                'name' => 'Vea Mariel Lusica',
                'role' => 'editor',
                'position' => 'Associate Editor',
                'status' => 'active',
            ],
            [   
                'name' => 'Meldhee Claire Kaamiño',
                'role' => 'editor',
                'position' => 'Managing Editor/Graphic Designer',
                'status' => 'active',
            ],
            [   
                'name' => 'Jeralyn Tag-Ulo',
                'role' => 'writer',
                'position' => 'Editorial Writer',
                'status' => 'active',
            ],
            [   
                'name' => 'Louie Ghay Basin',
                'role' => 'writer',
                'position' => 'Feature Writer',
                'status' => 'active',
            ],
            [   
                'name' => 'Althea Jandugan',
                'role' => 'writer',
                'position' => 'News Writer',
                'status' => 'active',
            ],
            [   
                'name' => 'Lenny Mae Panares',
                'role' => 'writer',
                'position' => 'News Writer',
                'status' => 'active',
            ],
            [   
                'name' => 'Rhea Angel Atis',
                'role' => 'writer',
                'position' => 'News Writer',
                'status' => 'active',
            ],
            [   
                'name' => 'Maria Raizha Buenafe',
                'role' => 'writer',
                'position' => 'Social Media Manager',
                'status' => 'active',
            ],
            [   
                'name' => 'Mark Angelo Alojasin',
                'role' => 'designer',
                'position' => 'Editorial Cartoonist',
                'status' => 'active',
            ],
            [   
                'name' => 'Christian Caralos',
                'role' => 'designer',
                'position' => 'Layout Artist',
                'status' => 'active',
            ],
            [   
                'name' => 'Vensaint Charls Biolanggo',
                'role' => 'designer',
                'position' => 'Photographer',
                'status' => 'active',
            ],
            [   
                'name' => 'James Espaltero',
                'role' => 'designer',
                'position' => 'Photographer',
                'status' => 'active',
            ],
        ];
        
        Member::insertOrIgnore($users);
    }
}
