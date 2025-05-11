<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Review extends Model implements AuditableContract
{
    use HasUlids, HasFactory, Auditable;

    protected $fillable = [
        'cabin_id', 'rating', 'comment', 'author_name'
    ];

    public function cabin(): BelongsTo
    {
        return $this->belongsTo(Cabin::class);
    }

    public function getFormattedDateAttribute(): string
    {
        return $this->created_at->format('F Y');
    }
}
