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
            $table->string('name')->nullable();
            $table->string('description')->nullable();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('cascade');
                        
            $table->longText('title')->nullable();//new
            $table->text('excerpt')->nullable();//new
            $table->longText('body')->nullable();//new
            $table->text('caption')->nullable();//new

            $table->string('priority')->nullable();
            $table->string('status')->default('pending');

            $table->timestamp('due_date')->nullable();
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
