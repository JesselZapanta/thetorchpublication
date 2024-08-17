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
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->nullable()->constrained('users')->onDelete('cascade');//toto why null??
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('edited_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('set null');
            $table->longText('title');
            $table->string('article_image_path');
            $table->text('caption');
            $table->longText('body');
            $table->string('status')->default('pending');

            // todo
            $table->bigInteger('views')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('articles');
    }
};

