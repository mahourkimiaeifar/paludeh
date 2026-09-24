<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use App\Models\User;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions (idempotent)
        $permissions = [
            'manage-users',
            'manage-articles',
            'manage-pages',
            'manage-assets',
            'manage-settings',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission, 'guard_name' => 'web']);
        }

        // Create roles (idempotent)
        $superAdmin = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $superAdmin->syncPermissions(Permission::all());

        $contentManager = Role::firstOrCreate(['name' => 'content_manager', 'guard_name' => 'web']);
        $contentManager->syncPermissions(['manage-articles', 'manage-pages', 'manage-assets']);

        $support = Role::firstOrCreate(['name' => 'support', 'guard_name' => 'web']);
        $support->syncPermissions(['manage-users']);

        // Create a super admin user
        $admin = User::firstOrCreate(
            ['email' => 'admin@paludeh.test'],
            [
                'name' => 'Super Admin',
                'password' => bcrypt('password'),
                'is_active' => true,
            ]
        );
        
        if (!$admin->hasRole('super_admin')) {
            $admin->assignRole('super_admin');
        }

        $this->command->info('✅ Roles and permissions seeded successfully!');
        $this->command->info('🔑 Super admin: admin@paludeh.test / password');
    }
}
