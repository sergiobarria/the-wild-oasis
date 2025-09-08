<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use OwenIt\Auditing\Contracts\Auditable;

class Review extends Model implements Auditable
{
    use HasUlids, HasFactory, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'cabin_id', 'user_id', 'rating', 'comment', 'author_name'
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
