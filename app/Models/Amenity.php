<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use OwenIt\Auditing\Contracts\Auditable;

class Amenity extends Model implements Auditable
{
    use HasUlids, \OwenIt\Auditing\Auditable;

    protected $fillable = ['name', 'icon'];

    public function cabins(): BelongsToMany
    {
        return $this->belongsToMany(Cabin::class);
    }
}
