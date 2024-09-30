<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ArticleStatus extends Notification implements ShouldQueue
{
    use Queueable;

    protected array $articleDetails;
    protected string $customMessage;

    /**
     * Create a new notification instance.
     *
     * @param array $articleDetails
     * @param string $customMessage
     */
    public function __construct(array $articleDetails, string $customMessage)
    {
        $this->articleDetails = $articleDetails;
        $this->customMessage = $customMessage;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = config('app.url');

        return (new MailMessage)
                    ->subject('Article Update')
                    ->greeting('Hello ' . ($notifiable->name ?? 'Contributor') . ',')
                    ->line('Article: ' . ($this->articleDetails['title']))  // Accessing 'title'
                    ->line($this->customMessage) // Custom message
                    ->line('Status: ' . ($this->articleDetails['status'] ?? 'Unknown'))
                    ->action('Visit Torch Publication', $url)
                    ->line('Thank you for your hard work!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            
        ];
    }
}
