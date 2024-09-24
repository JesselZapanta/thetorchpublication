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
        Schema::create('newsletters', function (Blueprint $table) {
            $table->id();
            $table->string('description');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->string('newsletter_thumbnail_image_path');
            $table->string('newsletter_file_path');
            $table->string('status')->default('pending');

            $table->timestamp('submitted_at')->nullable();//new
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('cascade');

            $table->foreignId('revision_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('revision_at')->nullable();//new
            $table->string('revision_message')->nullable();

            $table->timestamp('approved_at')->nullable();//new
            $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');


            $table->timestamp('distributed_at')->nullable();//new
            $table->foreignId('distributed_by')->nullable()->constrained('users')->onDelete('set null');

            
            $table->tinyText('visibility')->default('visible');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('newsletters');
    }
};
