<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected $commands = [
        'App\Console\Commands\SendTaskNotification'
    ];
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
         // Task that checks past due
        // command :  php artisan schedule:run
        $schedule->command('taskpastdue')->everyFiveSeconds();

        // Database backup task running daily at 12:00 midnight
        // $schedule->command('database:backup')->daily()->at('00:00');

        //for testing
        //command :  php artisan database:backup
        $schedule->command('database:backup')->everyFiveSeconds();
    }
    

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}
