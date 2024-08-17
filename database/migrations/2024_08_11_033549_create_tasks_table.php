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
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_by')->constrained('users')->onDelete('cascade');
            $table->string('description');
            $table->string('body')->nullable();
            $table->string('message')->nullable();
            $table->string('priority');
            $table->string('status')->default('pending');
            $table->timestamp('due_date');
            $table->string('task_image_path')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tasks');
    }
};
