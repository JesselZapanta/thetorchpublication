<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class WordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            // Bisaya
            ['name' => 'm@ut'],
            ['name' => 'atay'],
            ['name' => 'maut'],
            ['name' => 'maot'],
            ['name' => 'bati'],
            ['name' => 'yawa'],
            ['name' => 'atay'],
            ['name' => 'nimal'],
            ['name' => 'deputa'],
            ['name' => 'giatay'],
            ['name' => 'geatay'],
            ['name' => 'bogo'],
            ['name' => 'gago'],
            ['name' => 'tanga'],
            ['name' => 'buang'],
            ['name' => 'ulol'],
            ['name' => 'bakla'],
            ['name' => 'bayot'],
            ['name' => 'ingon'],
            ['name' => 'kagwang'],
            ['name' => 'kauban'],
            ['name' => 'gihapon'],
            ['name' => 'y@wa'],
            ['name' => 'y*wa'],
            ['name' => 'y@*wa'],
            ['name' => 'ulol'],
            ['name' => 'buang'],
            ['name' => 'b*ang'],
            ['name' => 'bay@t'],
            ['name' => 'gihapon'],
            ['name' => 'pisti'],
            ['name' => 'p*sti'],
            ['name' => 'p!sti'],
            ['name' => 't*ng-ina'],
            ['name' => 't*ngina'],
            ['name' => 'yot-yot'],
            ['name' => 'tambaloslos'],
            ['name' => 'paita'],
            ['name' => 'giatay'],
            ['name' => 'kaibog'],
            ['name' => 'kantot'],
            ['name' => 'bigaon'],
            ['name' => 'kabit'],
            ['name' => 'tangina'],
            ['name' => 'b*kit'],
            ['name' => 'sapi'],
            ['name' => 'utot'],
            ['name' => 'unlan'],
            ['name' => 't*ng'],
            ['name' => 'b@bo'],
            ['name' => 'b@w@'],
            ['name' => 'puk*'],
            ['name' => 'b*rkat'],
            ['name' => 'otin'],
            ['name' => 'oten'],
            ['name' => 'uten'],
            ['name' => '0ten'],
            ['name' => '0tin'],
            ['name' => 'ohten'],
            ['name' => 'ohtin'],

            // Tagalog
            ['name' => 'putang ina'],
            ['name' => 'puta'],
            ['name' => 'gago'],
            ['name' => 'tarantado'],
            ['name' => 'tanga'],
            ['name' => 'ulol'],
            ['name' => 'bobo'],
            ['name' => 'inutil'],
            ['name' => 'bwisit'],
            ['name' => 'siraulo'],
            ['name' => 'sira-ulo'],
            ['name' => 'punyeta'],
            ['name' => 'leche'],
            ['name' => 'demonyo'],
            ['name' => 'hayop'],
            ['name' => 'salot'],
            ['name' => 'lintik'],
            ['name' => 'shet'],
            ['name' => 'ogag'],
            ['name' => 'burat'],
            ['name' => 'kantot'],
            ['name' => 'jakol'],
            ['name' => 'puke'],
            ['name' => 'pakyu'],
            ['name' => 'putangina'],
            ['name' => 'put@ngina'],
            ['name' => 'put@ng ina'],
            ['name' => 't@ngina'],
            ['name' => 't@ng-ina'],
            ['name' => 'put&ngina'],
            ['name' => 'hinayupak'],
            ['name' => 'ul*l'],
            ['name' => 'abnoy'],
            ['name' => 'santo'],
            ['name' => 'santong kabayo'],
            ['name' => 'suplado'],
            ['name' => 'supot'],
            ['name' => 'ampalaya'],
            ['name' => 'burara'],
            ['name' => 'dudung'],
            ['name' => 'kupit'],
            ['name' => 'kupalin'],
            ['name' => 'utak talangka'],
            ['name' => 'amoy patay'],
            ['name' => 'maitim'],
            ['name' => 'itim'],
            ['name' => 'nognog'],
            ['name' => 'panget'],
            ['name' => 'pangit'],
            ['name' => 'baho'],
            ['name' => 'tulo'],
            ['name' => 'sabog'],
            ['name' => 'malibog'],
            ['name' => 'kupal'],
            ['name' => 'linta'],
            ['name' => 'malas'],
            ['name' => 'yaya'],
            ['name' => 'bakla'],
            ['name' => 'hitad'],
            ['name' => 'batugan'],
            ['name' => 'patpat'],
            ['name' => 'ngongo'],
            ['name' => 'batuta'],
            ['name' => 'salaula'],

            // English
            ['name' => 'fuck'],
            ['name' => 'shit'],
            ['name' => 'asshole'],
            ['name' => 'bitch'],
            ['name' => 'bastard'],
            ['name' => 'damn'],
            ['name' => 'crap'],
            ['name' => 'dick'],
            ['name' => 'pussy'],
            ['name' => 'cunt'],
            ['name' => 'fucker'],
            ['name' => 'motherfucker'],
            ['name' => 'nigger'],
            ['name' => 'whore'],
            ['name' => 'slut'],
            ['name' => 'bimbo'],
            ['name' => 'twat'],
            ['name' => 'prick'],
            ['name' => 'cock'],
            ['name' => 'faggot'],
            ['name' => 'screw you'],
            ['name' => 'bullshit'],
            ['name' => 'goddamn'],
            ['name' => 'douchebag'],
            ['name' => 'son of a bitch'],
            ['name' => 'arsehole'],
            ['name' => 'wanker'],
            ['name' => 'retard'],
            ['name' => 'loser'],
            ['name' => 'jackass'],
            ['name' => 'bastard'],
            ['name' => 'piss off'],
            ['name' => 'bloody hell'],
            ['name' => 'dumbass'],
            ['name' => 'jerk'],
            ['name' => 'suck my dick'],
            ['name' => 'eat shit'],
            ['name' => 'fuck you'],
            ['name' => 'shut up'],
            ['name' => 'douche'],
            ['name' => 'shithead'],
            ['name' => 'asshat'],
            ['name' => 'bastards'],
            ['name' => 'dickhead'],
            ['name' => 'scumbag'],
            ['name' => 'skank'],
            ['name' => 'crackhead'],
            ['name' => 'methhead'],
            ['name' => 'dumb'],
            ['name' => 'stupid'],
            ['name' => 'shitface'],
            ['name' => 'meathead'],
            ['name' => 'shitshow'],
            ['name' => 'shitstorm'],
            ['name' => 'goddammit'],
            ['name' => 'ballsack'],
            ['name' => 'ballsy'],
            ['name' => 'blow me'],
            ['name' => 'pricks'],
            ['name' => 'dipshit'],
            ['name' => 'nutjob'],
            ['name' => 'fuckwit'],
            ['name' => 'fucktard'],
            ['name' => 'nutcase'],
            ['name' => 'pisshead'],
            ['name' => 'shitfaced'],
            ['name' => 'clueless'],
            ['name' => 'brain-dead'],
            ['name' => 'shit-for-brains'],
            ['name' => 'fuckup'],
            ['name' => 'fuck-up'],
            ['name' => 'fvc u'],
            ['name' => 'fvck u'],
            ['name' => 'fvck'],
            ['name' => 'fck'],
            ['name' => 'fvk'],
        ];

        \App\Models\Word::insertOrIgnore($data);
    }
}
