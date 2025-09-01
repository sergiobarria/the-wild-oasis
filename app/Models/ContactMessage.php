<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class ContactMessage extends Model implements AuditableContract
{
    use HasUlids, Auditable;

    protected $fillable = ['name', 'email', 'phone', 'subject', 'message'];
}
