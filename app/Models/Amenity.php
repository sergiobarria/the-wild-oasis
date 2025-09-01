<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;

class Amenity extends Model implements AuditableContract
{
    use HasUlids, Auditable;

    protected $fillable = ['name', 'icon'];

    public function cabins(): BelongsToMany
    {
        return $this->belongsToMany(Cabin::class);
    }
}
