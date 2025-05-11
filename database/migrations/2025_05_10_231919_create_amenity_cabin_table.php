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
        Schema::create('amenity_cabin', function (Blueprint $table) {
            $table->foreignUlid('cabin_id')->constrained('cabins')->cascadeOnDelete();
            $table->foreignUlid('amenity_id')->constrained('amenities')->cascadeOnDelete();
            $table->primary(['cabin_id', 'amenity_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('amenity_cabin');
    }
};
