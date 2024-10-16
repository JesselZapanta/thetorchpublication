<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AdminDatabaseBackupController extends Controller
{
    public function downloadBackup()
    {
        // Name of the backup file (e.g., backup.sql)
        $fileName = 'backup_' . date('Y-m-d_H-i-s') . '.sql';

        // MySQL database credentials (from .env)
        $dbHost = env('DB_HOST');
        $dbName = env('DB_DATABASE');
        $dbUser = env('DB_USERNAME');
        $dbPass = env('DB_PASSWORD');

        // Path to store the temporary backup file
        $path = storage_path('app/' . $fileName);

        // mysqldump command
        $command = "mysqldump --user={$dbUser} --password={$dbPass} --host={$dbHost} {$dbName} > {$path}";

        // Execute the command to generate the SQL dump
        exec($command);

        // Return the file as a downloadable response
        return response()->download($path)->deleteFileAfterSend(true);
    }
}

// wa na gamit 