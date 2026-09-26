<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Inertia::share([
            'auth' => function () {
                if (!auth()->check()) {
                    return ['user' => null];
                }

                return [
                    'user' => [
                        'id' => auth()->user()->id,
                        'name' => auth()->user()->name,
                        'email' => auth()->user()->email,
                        'roles' => auth()->user()->getRoleNames(),
                    ],
                ];
            },
            'flash' => function () {
                return [
                    'success' => session('success'),
                    'error' => session('error'),
                    'status' => session('status'),
                ];
            },
        ]);
    }
}