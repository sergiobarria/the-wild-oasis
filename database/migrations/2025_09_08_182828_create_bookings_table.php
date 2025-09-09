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
        Schema::create('bookings', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->timestamps();
            $table->string('booking_code', 20)->unique();
            $table->foreignUlid('cabin_id')->constrained('cabins')->nullOnDelete();
            $table->foreignId('user_id')->nullable()->constrained('users')->nullOnDelete();
            $table->date('start_date');
            $table->date('end_date');
            $table->unsignedTinyInteger('guests');
            $table->unsignedTinyInteger('nights');
            $table->decimal('subtotal');
            $table->decimal('booking_fee');
            $table->decimal('taxes');
            $table->decimal('total');
            $table->enum('status', ['pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out', 'no_show', 'refunded'])
                ->default('pending');
            $table->text('notes')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
