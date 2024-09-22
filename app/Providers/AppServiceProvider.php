<?php

namespace App\Providers;

use App\Models\Article;
use App\Models\FreedomWall;
use App\Models\User;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
         // Conditionally share data only for admin routes
        Inertia::share('editedCount', function () {
            return Article::where('status', 'edited')->count();
        });

        Inertia::share('badgeCount', function () {
            $userCount = User::count();    // Get the user count
            $editedCount = Article::where('status', 'edited')->count();

            return [
                'user' => $userCount,
                'editedCount' => $editedCount,
            ];
        });

    }
}
