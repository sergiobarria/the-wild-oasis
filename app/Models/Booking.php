<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Booking extends Model implements AuditableContract
{
    use HasUlids, Auditable;

    protected $fillable = [
        'cabin_id', 'user_id', 'start_date', 'end_date',
        'guests', 'nights', 'subtotal', 'booking_fee', 'taxes', 'total', 'stripe_session_id'
    ];
}
