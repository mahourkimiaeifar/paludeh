<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class UserController extends Controller
{
    use LogsActivity;

    public function index()
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => User::latest()->get()->map(fn($u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'roles' => $u->getRoleNames(),
                'is_active' => $u->is_active,
                'created_at' => $u->created_at->format('Y-m-d H:i'),
            ]),
            'roles' => ['super_admin', 'content_manager', 'support', 'user'],
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create', [
            'roles' => ['super_admin', 'content_manager', 'support', 'user'],
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'role' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $user->assignRole($validated['role']);

        $this->logActivity('create', "کاربر «{$user->name}» ساخته شد", User::class, $user->id);

        return redirect()->route('admin.users.index')->with('success', 'کاربر با موفقیت ساخته شد!');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->getRoleNames()->first() ?? 'user',
                'is_active' => $user->is_active,
            ],
            'roles' => ['super_admin', 'content_manager', 'support', 'user'],
        ]);
    }

    public function update(Request $request, User $user)
    {
        $oldValues = $user->only(['name', 'email', 'is_active']);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string',
            'is_active' => 'boolean',
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];
        $user->is_active = $validated['is_active'];

        if (!empty($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();
        $user->syncRoles([$validated['role']]);

        $this->logActivity('update', "کاربر «{$user->name}» ویرایش شد", User::class, $user->id, $oldValues, $user->only(['name', 'email', 'is_active']));

        return redirect()->route('admin.users.index')->with('success', 'کاربر ویرایش شد!');
    }

    public function destroy(User $user)
    {
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => 'نمی‌تونی خودت رو حذف کنی!']);
        }

        $name = $user->name;
        $user->delete();

        $this->logActivity('delete', "کاربر «{$name}» حذف شد", User::class, $user->id);

        return redirect()->route('admin.users.index')->with('success', 'کاربر حذف شد!');
    }
}