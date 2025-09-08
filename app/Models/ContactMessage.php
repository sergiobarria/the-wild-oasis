<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Contracts\Auditable;

class ContactMessage extends Model implements Auditable
{
    use HasUlids, \OwenIt\Auditing\Auditable;

    protected $fillable = ['name', 'email', 'phone', 'subject', 'message'];
}
