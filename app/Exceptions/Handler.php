<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Inertia\Inertia;
use Throwable;

class Handler extends ExceptionHandler
{
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    public function render($request, Throwable $e)
    {
        // ═══ Handle 404 for Inertia requests ═══
        if ($this->isInertiaRequest($request) && $this->is404($e)) {
            return Inertia::render('Error', [
                'status' => 404,
                'title' => 'صفحه یافت نشد',
                'description' => 'متأسفانه صفحه‌ای که دنبالش هستید وجود ندارد یا حذف شده است.',
            ])->toResponse($request)->setStatusCode(404);
        }

        // ═══ Handle 403 (Forbidden) ═══
        if ($this->isInertiaRequest($request) && $e instanceof HttpException && $e->getStatusCode() === 403) {
            return Inertia::render('Error', [
                'status' => 403,
                'title' => 'دسترسی غیرمجاز',
                'description' => 'شما اجازه دسترسی به این صفحه را ندارید.',
            ])->toResponse($request)->setStatusCode(403);
        }

        // ═══ Handle 500 (Server Error) ═══
        if ($this->isInertiaRequest($request) && $e instanceof HttpException && $e->getStatusCode() === 500) {
            return Inertia::render('Error', [
                'status' => 500,
                'title' => 'خطای سرور',
                'description' => 'یه مشکلی در سرور پیش اومده. تیم فنی در حال بررسیه.',
            ])->toResponse($request)->setStatusCode(500);
        }

        return parent::render($request, $e);
    }

    private function isInertiaRequest($request): bool
    {
        return $request->header('X-Inertia') || $request->wantsJson();
    }

    private function is404(Throwable $e): bool
    {
        return $e instanceof NotFoundHttpException 
            || $e instanceof ModelNotFoundException
            || ($e instanceof HttpException && $e->getStatusCode() === 404);
    }
}