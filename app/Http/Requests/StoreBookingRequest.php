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
            'dates' => ['required', 'array'],
            'dates.start' => ['required', 'date', 'after_or_equal:today'],
            'dates.end' => ['required', 'date', 'after:dates.start'],
            'guests' => ['required', 'integer', 'min:1'],
            'cabinId' => ['required', 'string', 'exists:cabins,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'dates.required' => 'Please select your check-in and check-out dates.',
            'dates.start.required' => 'Please select a valid check-in date.',
            'dates.start.after_or_equal' => 'Check-in date must be today or later.',
            'dates.end.required' => 'Please select a valid check-out date.',
            'dates.end.after' => 'Check-out date must be after check-in date.',
            'guests.required' => 'Please enter how many guests will be staying',
            'guests.integer' => 'Number of guests must be a number.',
            'guests.min' => 'At least one guest is required',
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
