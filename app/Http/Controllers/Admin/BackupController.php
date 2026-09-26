<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Concerns\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use ZipArchive;

class BackupController extends Controller
{
    use LogsActivity;

    public function index()
    {
        $backups = $this->getBackups();

        return Inertia::render('Admin/Backup/Index', [
            'backups' => $backups,
            'disk_info' => [
                'total' => $this->formatBytes(disk_total_space(base_path())),
                'free' => $this->formatBytes(disk_free_space(base_path())),
                'used_percent' => round((1 - disk_free_space(base_path()) / disk_total_space(base_path())) * 100, 1),
            ],
        ]);
    }

    public function create(Request $request)
    {
        $type = $request->input('type', 'database');
        $timestamp = now()->format('Y-m-d_H-i-s');

        try {
            if ($type === 'database') {
                $this->backupDatabase($timestamp);
                $message = 'بکاپ دیتابیس با موفقیت ساخته شد!';
            } elseif ($type === 'files') {
                $this->backupFiles($timestamp);
                $message = 'بکاپ فایل‌ها با موفقیت ساخته شد!';
            } elseif ($type === 'full') {
                $this->backupDatabase($timestamp);
                $this->backupFiles($timestamp);
                $message = 'بکاپ کامل (دیتابیس + فایل‌ها) با موفقیت ساخته شد!';
            }

            $this->logActivity('backup', "بکاپ {$type} ساخته شد");

            return back()->with('success', $message);
        } catch (\Exception $e) {
            return back()->with('error', 'خطا در ساخت بکاپ: ' . $e->getMessage());
        }
    }

    public function download(string $filename)
    {
        $path = 'backups/' . $filename;

        if (!Storage::disk('local')->exists($path)) {
            return back()->with('error', 'فایل بکاپ پیدا نشد!');
        }

        $this->logActivity('backup', "بکاپ {$filename} دانلود شد");

        return response()->download(
            Storage::disk('local')->path($path),
            $filename
        );
    }

    public function destroy(string $filename)
    {
        $path = 'backups/' . $filename;

        if (Storage::disk('local')->exists($path)) {
            Storage::disk('local')->delete($path);
            $this->logActivity('delete', "بکاپ {$filename} حذف شد");
            return back()->with('success', 'بکاپ با موفقیت حذف شد!');
        }

        return back()->with('error', 'فایل بکاپ پیدا نشد!');
    }

    // ═══ Private Methods ═══

    private function backupDatabase(string $timestamp): void
    {
        $dbConfig = config('database.connections.mysql');
        $filename = "database_{$timestamp}.sql";
        $path = storage_path('app/backups/' . $filename);

        // Ensure directory exists
        if (!is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        // Use mysqldump
        $command = sprintf(
            'mysqldump --user=%s --password=%s --host=%s --port=%s %s > %s',
            escapeshellarg($dbConfig['username']),
            escapeshellarg($dbConfig['password']),
            escapeshellarg($dbConfig['host']),
            escapeshellarg($dbConfig['port'] ?? '3306'),
            escapeshellarg($dbConfig['database']),
            escapeshellarg($path)
        );

        exec($command, $output, $returnCode);

        if ($returnCode !== 0) {
            throw new \Exception('خطا در اجرای mysqldump');
        }
    }

    private function backupFiles(string $timestamp): void
    {
        $filename = "files_{$timestamp}.zip";
        $path = storage_path('app/backups/' . $filename);

        // Ensure directory exists
        if (!is_dir(dirname($path))) {
            mkdir(dirname($path), 0755, true);
        }

        $zip = new ZipArchive();
        if ($zip->open($path, ZipArchive::CREATE) !== true) {
            throw new \Exception('خطا در ساخت فایل زیپ');
        }

        // Add storage/app/public to zip
        $publicPath = storage_path('app/public');
        if (is_dir($publicPath)) {
            $files = new \RecursiveIteratorIterator(
                new \RecursiveDirectoryIterator($publicPath),
                \RecursiveIteratorIterator::LEAVES_ONLY
            );

            foreach ($files as $file) {
                if (!$file->isDir()) {
                    $filePath = $file->getRealPath();
                    $relativePath = 'public/' . substr($filePath, strlen($publicPath) + 1);
                    $zip->addFile($filePath, $relativePath);
                }
            }
        }

        $zip->close();
    }

    private function getBackups(): array
    {
        $backups = [];
        $backupDir = storage_path('app/backups');

        if (!is_dir($backupDir)) {
            return $backups;
        }

        $files = scandir($backupDir);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') continue;

            $path = $backupDir . '/' . $file;
            $backups[] = [
                'filename' => $file,
                'type' => str_starts_with($file, 'database_') ? 'database' : 'files',
                'size' => $this->formatBytes(filesize($path)),
                'created_at' => date('Y/m/d H:i', filemtime($path)),
            ];
        }

        // Sort by date descending
        usort($backups, fn($a, $b) => strcmp($b['filename'], $a['filename']));

        return $backups;
    }

    private function formatBytes($bytes, $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, $precision) . ' ' . $units[$pow];
    }
}