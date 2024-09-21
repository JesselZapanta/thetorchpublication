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

            $table->string('author')->nullable()->default(null);

            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');

            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade');

            $table->foreignId('edited_by')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('layout_by')->nullable()->constrained('users')->onDelete('set null');

            $table->text('slug')->nullable();

            $table->longText('title')->nullable();
            $table->text('excerpt')->nullable();
            $table->longText('body')->nullable();
            $table->text('caption')->nullable();
            $table->string('article_image_path')->nullable();

            $table->tinyText('status')->default('pending');
            $table->tinyText('draft')->default('no');
            $table->tinyText('visibility')->default('visible');//hidden
            
            $table->text('rejection_message')->nullable();
            $table->text('revision_message')->nullable();
            

            $table->tinyText('is_featured')->default('no');
            $table->tinyText('is_anonymous')->default('no');
            $table->tinyText('is_newsletter')->default('no');

            $table->timestamp('submitted_at')->nullable();//new
            $table->timestamp('rejected_at')->nullable();//new
            $table->timestamp('edited_at')->nullable();//new
            $table->timestamp(column: 'revision_at')->nullable();//new
            $table->timestamp('published_date')->nullable();

            $table->tinyText('report_count')->default(0);
            $table->bigInteger('views')->default(0);

            $table->timestamps();

            // todo save as draft, timeline[submitted_at, edited_at, rejected_at, revision_at, published_at]
            //calendar time line
            //version controll, not sure
            // 
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

