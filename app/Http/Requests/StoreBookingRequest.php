<?php

namespace App\Http\Requests;

use App\Data\BookingRequestData;
use App\Models\Cabin;
use App\Services\BookingPriceService;
use Carbon\Carbon;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'dates.start' => ['required', 'date', 'after_or_equal:today'],
            'dates.end' => ['required', 'date', 'after:dates.start'],
            'guests' => ['required', 'integer', 'min:1'],
            'cabinId' => ['required', 'string', 'exists:cabins,id'],
        ];
    }

    public function toBookingData(): BookingRequestData
    {
        $checkin = Carbon::parse($this->input('dates.start'));
        $checkout = Carbon::parse($this->input('dates.end'));
        $nights = $checkin->diffInDays($checkout);
        $guests = (int)$this->input('guests');
        $cabin = Cabin::findOrFail($this->input('cabinId'));
        $price = BookingPriceService::calculate($cabin, $nights);

        return new BookingRequestData($cabin, $checkin, $checkout, $guests, $nights, $price);
    }
}
