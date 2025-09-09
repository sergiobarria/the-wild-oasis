<?php

namespace App\Models;

use Carbon\CarbonPeriod;
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

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }

    public function availabilities(): HasMany
    {
        return $this->hasMany(CabinAvailability::class);
    }

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

    public function getUnavailableDatesAttribute(): string
    {
        if (!$this->relationLoaded('availabilities')) {
            $this->load('availabilities');
        }

        if (!$this->relationLoaded('bookings')) {
            $this->load('bookings');
        }

        $allBlockedDates = collect();

        // 1. From cabin_availabilities
        foreach($this->availabilities as $blockedPeriod) {
            $period = CarbonPeriod::create($blockedPeriod->start_date, $blockedPeriod->end_date);
            foreach($period as $date) {
                $allBlockedDates->push($date->toDateString());
            }
        }

        // 3. From bookings
        foreach ($this->bookings as $booking) {
            if ($booking->end_date->greatherThan($booking->start_date)) {
                $period = CarbonPeriod::create(
                    $booking->start_date->copy()->addDay(),
                    $booking->end_date->copy()->subDay()
                );

                foreach($period as $date) {
                    $allBlockedDates->push($date->toDateString());
                }
            }

            if ($booking->start_date->isSameDay($booking->end_date)) {
                $allBlockedDates->push($booking->start_date->toDateString());
            }
        }

        return $allBlockedDates->unique()->sort()->implode(',');
    }
}
