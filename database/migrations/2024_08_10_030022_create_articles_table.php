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
            $table->string('author')->nullable()->default(null);//todo
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');//todo
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');
            $table->foreignId('edited_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('slug')->nullable();//todo
            $table->longText('title');
            $table->text('excerpt')->nullable();//todo
            $table->longText('body');
            $table->text('caption');
            $table->string('article_image_path');
            $table->string('status')->default('pending');
            $table->bigInteger('views')->default(0);
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_anonymous')->default(false);//todo
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

