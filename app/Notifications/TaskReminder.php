<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskReminder extends Notification implements ShouldQueue
{
    use Queueable;

    protected $taskDetails;
    protected $customMessage;

    /**
     * Create a new notification instance.
     *
     * @param array $taskDetails
     * @param string $customMessage
     */
    public function __construct(array $taskDetails, string $customMessage)
    {
        $this->taskDetails = $taskDetails;
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
                    ->subject('Task Update: ' . $this->taskDetails['task_name'])
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line($this->customMessage) // Custom message
                    ->line('Task: ' . $this->taskDetails['task_name'])
                    ->line('Assigned By: ' . $this->taskDetails['assigned_by_name'])
                    ->line('Due Date: ' . $this->taskDetails['due_date'])
                    ->line('Priority: ' . $this->taskDetails['priority'])
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
            'task_id' => $this->taskDetails['task_id'],
            'task_name' => $this->taskDetails['task_name'],
            'assigned_by' => $this->taskDetails['assigned_by_name'],
            'due_date' => $this->taskDetails['due_date'],
            'priority' => $this->taskDetails['priority'],
        ];
    }
}
