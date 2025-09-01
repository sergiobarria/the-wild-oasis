<x-mail.base-layout title="Booking Confirmed – The Wild Oasis">
    <h2 style="margin-top: 0;">Hi {{ $booking->user->profile->name }},</h2>

    <p>We’re happy to let you know that your booking at <strong>{{ $booking->cabin->name }}</strong> is confirmed.</p>

    <ul style="margin: 1rem 0; padding-left: 1rem;">
        <li><strong>Check-in: </strong>{{ $booking->start_date->format('M j, Y') }}</li>
        <li><strong>Check-out: </strong>{{ $booking->end_date->format('M j, Y') }}</li>
        <li><strong>Guests:</strong> {{ $booking->guests }}</li>
    </ul>

    <p>If you have any questions or need to make changes, feel free to contact us anytime.</p>

    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <tr>
            <td align="center" bgcolor="#d4af37" style="border-radius: 8px;">
                <a href="{{ route('account.reservations') }}" target="_blank"
                   style="display: inline-block; padding: 12px 24px; font-weight: bold; color: #1e293b; text-decoration: none; font-family: 'Josefin Sans', sans-serif;">
                    View My Booking
                </a>
            </td>
        </tr>
    </table>
</x-mail.base-layout>
