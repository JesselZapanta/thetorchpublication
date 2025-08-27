<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewsletterNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected array $publicationDetails;
    protected string $customMessage;

    /**
     * Create a new notification instance.
     *
     * @param array $publicationDetails
     * @param string $customMessage
     */
    public function __construct(array $publicationDetails, string $customMessage)
    {
        $this->publicationDetails = $publicationDetails;
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
        // Properly concatenate app URL and file path
        $url = config('app.url') . 'storage/' . $this->publicationDetails['publication_file_path'];

        //http://127.0.0.1:8000/storage/newsletter-file/OanYtaktFlaeFVbwx7HfjLiwTi9LV4avrftuZoS0.pdf - correct

        return (new MailMessage)
                    ->subject('Publication Update')
                    ->greeting('Hello ' . ($notifiable->name) . ',') 
                    ->line($this->publicationDetails['description']) 
                    ->line($this->customMessage) // Custom message
                    ->action('View Publication', $url)
                    ->line('Stay updated with the latest publication and announcements!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            // Add data if you want to store the notification in the database
        ];
    }
}
