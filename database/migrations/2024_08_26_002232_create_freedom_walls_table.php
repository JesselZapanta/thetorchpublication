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
        Schema::create('freedom_walls', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('academic_year_id')->constrained('academic_years')->onDelete('cascade');//new ambot magamit bani HAHHA
            $table->text('body');
            $table->tinyText('emotion');
            $table->integer('report_count')->default(0);

            $table->tinyText('visibility')->default('visible');//archive
            $table->foreignId('archive_by')->nullable()->constrained('users')->onDelete('set null');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freedom_walls');
    }
};
