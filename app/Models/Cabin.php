<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Contracts\Auditable;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Cabin extends Model implements Auditable, HasMedia
{
    use HasFactory, HasUlids, HasSlug, InteractsWithMedia, \OwenIt\Auditing\Auditable;

    protected $fillable = [
        'name', 'slug', 'summary', 'description', 'price_per_night', 'discount_percentage',
        'beds', 'baths', 'max_guests'
    ];

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('cabins')
            ->useDisk('r2');
    }

    public function getRatingAttribute(): float
    {
        return round($this->reviews->avg('rating') ?? 0, 1);
    }
}
