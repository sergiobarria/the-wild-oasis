<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cabins', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->decimal('price_per_night', 10, 2);
            $table->decimal('discount_percentage', 5, 2)->nullable();
            $table->string('summary');
            $table->unsignedTinyInteger('max_guests')->default(1);
            $table->unsignedTinyInteger('beds')->default(1);
            $table->unsignedTinyInteger('baths')->default(1);
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }
    
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cabins');
    }
};
