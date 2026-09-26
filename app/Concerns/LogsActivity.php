<?php

namespace App\Concerns;

use App\Models\ActivityLog;

trait LogsActivity
{
    protected function logActivity(
        string $action,
        string $description,
        ?string $modelType = null,
        ?string $modelId = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): void {
        ActivityLog::create([
            'user_id' => auth()->id(),
            'action' => $action,
            'model_type' => $modelType,
            'model_id' => $modelId,
            'description' => $description,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}