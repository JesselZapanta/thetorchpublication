<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

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
        $backupPath = storage_path('app/backups');
        $fileName = 'backup_' . date('Y-m-d_H-i-s') . '.sql';

        // Ensure the backup directory exists
        if (!file_exists($backupPath)) {
            mkdir($backupPath, 0755, true);
        }

        // Wrap paths and parameters with double quotes to handle spaces
        $command = "mysqldump --user=\"{$dbUser}\" --password=\"{$dbPass}\" --host=\"{$dbHost}\" \"{$dbName}\" > \"{$backupPath}/{$fileName}\"";

        // Log the command for debugging
        \Log::info("Running command: {$command}");

        // Execute the command
        $result = null;
        $output = null;
        exec($command, $output, $result);

        // Log the output for debugging
        \Log::info('Command output: ' . implode("\n", $output));
        \Log::info('Command result: ' . $result);

        if ($result === 0) {
            $this->info("Database backup was successful: {$fileName}");
        } else {
            $this->error("Failed to backup database.");
            \Log::error("Database backup failed.");
        }

        return 0;
    }

}
