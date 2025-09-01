<?php

return [
    'fees' => [
        'booking' => env('BOOKING_FEE', 25),
        'processing' => env('PROCESSING_FEE', 2.9),
        'tax' => env('SALES_TAX', 7),
    ],
];
