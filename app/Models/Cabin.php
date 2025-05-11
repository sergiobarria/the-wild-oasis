<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use OwenIt\Auditing\Auditable;
use OwenIt\Auditing\Contracts\Auditable as AuditableContract;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;

class Cabin extends Model implements AuditableContract, HasMedia
{
    use HasFactory, HasUlids, Auditable, InteractsWithMedia, HasSlug;

    protected $fillable = [
        'name', 'slug', 'summary', 'description', 'price_per_night',
        'max_guests', 'bedrooms', 'bathrooms', 'published_at'
    ];

    public function availability(): HasMany
    {
        return $this->hasMany(CabinAvailability::class);
    }

    public function amenities(): BelongsToMany
    {
        return $this->belongsToMany(Amenity::class);
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('images')->useDisk('r2');
    }

    public function mainImageUrl(): ?string
    {
        return $this->getFirstMediaUrl('images');
    }

    public function getRatingAttribute(): float
    {
        return round($this->reviews()->avg('rating') ?? 0, 1);
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
}
