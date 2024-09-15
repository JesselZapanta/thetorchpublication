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
        Schema::create('enrolled_students', function (Blueprint $table) {
            $table->id();
            $table->integer('student_id');
            $table->string(column: 'firstname');
            $table->string(column: 'middelname');//todo next migration
            $table->string(column: 'lastname');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrolled_students');
    }
};
