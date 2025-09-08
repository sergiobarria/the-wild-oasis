@props([
    'href',
    'match' => null,
    'active' => null,
])

@php
    $isActive = $active ?? ($match
        ? request()->is($match)
        : request()->url() === $href);
@endphp

<a
    href="{{ $href }}"
    {{ $attributes->class([
        'flex items-center gap-2',
        'hover:text-accent transition-colors duration-300 ease-in-out',
        'text-accent' => $isActive,
    ]) }}
>
    {{ $slot }}
</a>
