<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SupportMessage extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Support Message',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'view.name',
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        <?php

        namespace App\Mail;

        use Illuminate\Bus\Queueable;
        use Illuminate\Mail\Mailable;
        use Illuminate\Queue\SerializesModels;

        class SupportMessage extends Mailable
        {
            use Queueable, SerializesModels;

            public $name;
            public $email;
            public $messageText;

            public function __construct($name, $email, $messageText)
            {
                $this->name = $name;
                $this->email = $email;
                $this->messageText = $messageText;
            }

            public function build()
            {
                return $this->subject('New Support Message from PixelLumo')
                            ->view('emails.support-message')
                            ->with([
                                'name' => $this->name,
                                'email' => $this->email,
                                'messageText' => $this->messageText,
                            ]);
            }
        }
