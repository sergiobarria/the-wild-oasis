@props([
    'href',
    'active' => request()->url() === $href,
])

<a
    href="{{ $href }}"
    {{ $attributes->class([
        'hover:text-accent transition-colors duration-300 ease-in-out',
        'text-accent' => $active,
    ]) }}
>
    {{ $slot }}
</a>
