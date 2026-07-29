<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RestablecerContrasena extends Mailable
{
    use Queueable, SerializesModels;

    public const ASUNTO = 'Restablece tu contrasena - GameWolf';

    public function __construct(
        public readonly User $usuario,
        public readonly string $urlRestablecimiento,
    ) {
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: self::ASUNTO);
    }

    public function content(): Content
    {
        return new Content(view: 'emails.restablecer-contrasena');
    }

    public function attachments(): array
    {
        return [];
    }
}
