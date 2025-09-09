<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class CabinAvailability extends Model implements Auditable
{
    use HasUlids, HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'cabin_id', 'start_date', 'end_date', 'is_available',
    ];

    public function cabin(): BelongsTo
    {
        return $this->belongsTo(Cabin::class);
    }

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_available' => 'boolean',
        ];
    }
}
