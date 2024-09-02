<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewsletterMail extends Mailable
{
    use Queueable, SerializesModels;

    public $newsletter;
    public $messages;

    public function __construct($newsletter, $messages)
    {
        $this->newsletter = $newsletter;
        $this->messages = $messages;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Newsletter Mail',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.newsletter',
            with: [
                'newsletter' => $this->newsletter,
                'messages' => $this->messages,
            ],
        );
    }

    public function attachments(): array
    {
        return [
            Attachment::fromPath(storage_path('app/public/' . $this->newsletter->newsletter_file_path))
                ->as('newsletter.pdf')
                ->withMime('application/pdf'),

            Attachment::fromPath(storage_path('app/public/' . $this->newsletter->newsletter_thumbnail_image_path))
                ->as('newsletter_thumbnail.jpg')
                ->withMime('image/jpeg'),
        ];
    }
}
