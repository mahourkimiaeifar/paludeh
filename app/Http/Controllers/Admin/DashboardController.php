<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                'users' => User::count(),
                'verified' => User::whereNotNull('email_verified_at')->count(),
                'admins' => User::role('super_admin')->count(),
                'newThisWeek' => User::where('created_at', '>=', now()->subWeek())->count(),
            ],
            'recentUsers' => User::latest()->take(5)->get()->map(fn ($u) => [
                'name' => $u->name,
                'email' => $u->email,
                'created_at' => \Morilog\Jalali\Jalalian::fromCarbon($u->created_at)->ago(),
            ]),
        ]);
    }
}