<?php

namespace App\Data;

use App\Models\Cabin;
use Carbon\Carbon;

class BookingRequestData
{
    public function __construct(
        public readonly Cabin  $cabin,
        public readonly Carbon $checkin,
        public readonly Carbon $checkout,
        public readonly int    $guests,
        public readonly int    $nights,
        public readonly array  $price,
    )
    {
        // ...
    }
}
