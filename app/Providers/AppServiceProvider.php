<?php

namespace App\Providers;

use App\Models\FreedomWall;
use Illuminate\Database\Eloquent\Relations\Relation;
use Illuminate\Support\ServiceProvider;

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
        // todo
        // Relation::enforceMorphMap([
        //     'freedom_wall' => FreedomWall::class,
        // ]);
    }
}
