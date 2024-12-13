<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

use Carbon\Carbon;

class DatabaseBackup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'database:backup';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Dump the database to a backup file';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $dbName = env('DB_DATABASE');
        $dbUser = env('DB_USERNAME');
        $dbPass = env('DB_PASSWORD');
        $dbHost = env('DB_HOST');

        //in prod, Set the backup path to a directory / e change path 
        $backupPath = storage_path('app/backups');
        $fileName = 'torch_db_backup_' . Carbon::now('Asia/Manila')->format('F j, Y') . '.sql';

        // Ensure the backup directory exists
        if (!file_exists($backupPath)) {
            mkdir($backupPath, 0755, true);
        }

        $command = "mysqldump --user=\"{$dbUser}\" --password=\"{$dbPass}\" --host=\"{$dbHost}\" \"{$dbName}\" > \"{$backupPath}/{$fileName}\"";

        // Execute the command
        $result = null;
        exec($command, $output, $result);

        if ($result === 0) {
            $this->info("Database backup was successful: {$fileName}");
        } else {
            $this->error("Failed to backup database.");
        }

        return 0;
    }
}
