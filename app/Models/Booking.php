<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class Booking extends Model implements Auditable
{
    use HasUlids, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'cabin_id', 'user_id', 'booking_code', 'start_date', 'end_date',
        'guests', 'nights', 'subtotal', 'booking_fee', 'taxes', 'total', 'status', 'notes'
    ];

    public function cabin(): BelongsTo
    {
        return $this->belongsTo(Cabin::class);
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'datetime',
            'end_date' => 'datetime',
        ];
    }
}
