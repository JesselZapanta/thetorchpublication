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
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');

            $table->foreignId('assigned_by')->nullable()->constrained('users')->onDelete('cascade');//todo who assigned the task
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('cascade');
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('cascade');//todo new the assignee
            
            $table->longText('title')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('body')->nullable();
            $table->text('caption')->nullable();

            $table->tinyText('priority')->nullable();
            $table->tinyText('status')->default('pending');
            $table->tinyText('draft')->default('no');

            $table->timestamp('assigned_date')->nullable();

            $table->timestamp('content_submitted_date')->nullable();

            // $table->foreignId('content_revision_by')->nullable()->constrained('users')->onDelete('cascade');// todo who set the revsion status and messege
            $table->text('content_revision_message')->nullable();
            $table->timestamp('content_revision_date')->nullable();

            // $table->foreignId('content_approved_by')->nullable()->constrained('users')->onDelete('cascade');// todo who aproved the content
            $table->timestamp('content_approved_date')->nullable();
            
            $table->timestamp('image_submitted_date')->nullable();
            
            // $table->foreignId('image_revision_by')->nullable()->constrained('users')->onDelete('cascade');// todo who set the image revsion status and messege
            $table->text('image_revision_message')->nullable();
            $table->timestamp('image_revision_date')->nullable();
            
            // $table->foreignId('approved_published_by')->nullable()->constrained('users')->onDelete('cascade');// todo who approved and published the task
            $table->timestamp('task_completed_date')->nullable();
            
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
