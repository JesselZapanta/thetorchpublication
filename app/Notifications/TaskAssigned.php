<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskAssigned extends Notification
{
    use Queueable;

    protected $taskDetails;
    protected $role;
    protected $customMessage;

    /**
     * Create a new notification instance.
     *
     * @param array $taskDetails
     * @param string $role
     * @param string $customMessage
     */
    public function __construct(array $taskDetails, string $role, string $customMessage)
    {
        $this->taskDetails = $taskDetails;
        $this->role = $role;
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
        // Dynamically set the URL based on the user's role
        switch ($this->role) {
            case 'admin':
                $taskUrl = url('/admin-task/' . $this->taskDetails['task_id'] . '/show');
                break;
            case 'editor':
                $taskUrl = url('/editor-task/' . $this->taskDetails['task_id'] . '/show');
                break;
            case 'designer':
                $taskUrl = url('/designer-task/' . $this->taskDetails['task_id'] . '/show');
                break;
            case 'writer':
            default: // Default to writer if no specific case matches
                $taskUrl = url('/writer-task/' . $this->taskDetails['task_id'] . '/show');
                break;
        }

        return (new MailMessage)
                    ->subject('Task Update: ' . $this->taskDetails['task_name'])
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line($this->customMessage) // Custom message
                    ->line('Task: ' . $this->taskDetails['task_name'])
                    ->line('Assigned By: ' . $this->taskDetails['assigned_by_name'])
                    ->line('Due Date: ' . $this->taskDetails['due_date'])
                    ->action('View Task', $taskUrl)
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
        ];
    }
}
