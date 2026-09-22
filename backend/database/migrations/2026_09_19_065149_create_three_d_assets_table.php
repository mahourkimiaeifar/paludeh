<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('three_d_assets', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('file_path');
            $table->string('file_type'); // glb, gltf, hdr, png, jpg
            $table->string('category')->nullable(); // models, textures, environments
            $table->integer('file_size')->nullable(); // in bytes
            $table->json('metadata')->nullable(); // additional info like dimensions, poly count
            $table->foreignId('uploaded_by')->constrained('users')->onDelete('set null');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->index(['category', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('three_d_assets');
    }
};
