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
            $table->string('message')->nullable();//todo remove this one
            $table->string('revision_message')->nullable();
            $table->string('newsletter_thumbnail_image_path');
            $table->string('newsletter_file_path');
            $table->string('status')->default('pending');
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');//todo
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
