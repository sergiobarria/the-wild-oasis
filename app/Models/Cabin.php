<?php

namespace App\Models;

use Carbon\CarbonPeriod;
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

    public function getUnavailableDatesAttribute(): string
    {
        $dates = [];

        foreach ($this->availability as $range) {
            $start = $range->start_date->copy();
            $end = $range->end_date->copy();

            // Check if there is an adyacent booking
            $hasPrevious = $this->availability->contains(fn($r) => $r->end_date->isSameDay($start->copy()->subDay()));
            $hasNex = $this->availability->contains(fn($r) => $r->start_date->isSameDay($end->copy()->subDay()));

            if (!$hasPrevious) {
                $dates[] = $start->toDateString();
            };

            if (!$hasNex) {
                $dates[] = $end->toDateString();
            }

            // Block all in between days
            $period = CarbonPeriod::create($start->copy()->addDay(), $end->copy()->subDay());
            foreach ($period as $date) {
                $dates[] = $date->toDateString();
            }
        }

        return implode(',', array_unique($dates));

//        foreach ($this->availability as $range) {
//            // Exclude check-in y check-out
//            $period = CarbonPeriod::create(
//                $range->start_date->copy()->addDay(),
//                $range->end_date->copy()->subDay()
//            );
//
//            foreach ($period as $date) {
//                $dates[] = $date->toDateString();
//            }
//        }
//
//        return implode(',', $dates);
    }

    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('name')
            ->saveSlugsTo('slug');
    }
}
