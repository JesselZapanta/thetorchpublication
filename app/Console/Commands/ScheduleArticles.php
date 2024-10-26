<?php

namespace App\Console\Commands;

use App\Models\Article;
use Illuminate\Console\Command;

class ScheduleArticles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'scheduledArticles';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Publish articles that are scheduled for today';

    /**
     * Execute the console command.
     */
    public function handle()
    {

        // Fetch articles scheduled for today
        $articles = Article::where('status', 'scheduled')
            ->whereDate('published_date', '<=', today()) 
            ->get();

        foreach ($articles as $article) {
            // Update the article's status to published
            $article->update(['status' => 'published']);

            // Optionally, you can add additional logic here (e.g., sending notifications)
        }

        $this->info('Scheduled articles have been published successfully.');
    }
}
