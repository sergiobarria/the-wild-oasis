<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class NewsletterSubscriber extends Model implements Auditable
{
    use HasUlids, \OwenIt\Auditing\Auditable;

    protected $fillable = ['email', 'subscribe_at'];
}
