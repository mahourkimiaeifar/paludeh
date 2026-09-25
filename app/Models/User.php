<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailNotification;
use Illuminate\Auth\Notifications\ResetPassword as ResetPasswordNotification;


class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, Notifiable, HasRoles;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'avatar',
        'is_active',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function sendEmailVerificationNotification()
    {
        $this->notify(new class extends VerifyEmailNotification {
            public function toMail($notifiable): MailMessage
            {
                $verificationUrl = $this->verificationUrl($notifiable);
                
                return (new MailMessage)
                    ->subject('تایید ایمیل پالوده')
                    ->view('emails.verify', [
                        'user' => $notifiable,
                        'url' => $verificationUrl,
                    ]);
            }
        });
    }

    public function sendPasswordResetNotification($token)
    {
        $this->notify(new class($token) extends ResetPasswordNotification {
            public function toMail($notifiable): MailMessage
            {
                $url = route('password.reset', ['token' => $this->token, 'email' => $notifiable->email]);

                return (new MailMessage)
                    ->subject('بازیابی رمز عبور پالوده')
                    ->view('emails.reset', ['url' => $url, 'user' => $notifiable]);
            }
        });
    }
}