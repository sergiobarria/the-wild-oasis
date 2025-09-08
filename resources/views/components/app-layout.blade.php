<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <title>{{ isset($title) ? $title . ' | ' : '' }} {{ config('app.name', 'Laravel') }}</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet"/>

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Josefin+Sans:ital,wght@0,100..700;1,100..700&display=swap"
          rel="stylesheet">

    <link href={{ asset('/favicon/favicon.ico') }} rel="icon"/>
    <link href={{ asset('/favicon/apple-touch-icon.png') }} rel="apple-touch-icon" sizes="180x180"/>
    <link href={{ asset('/favicon/favicon-32x32.png') }} rel="icon" sizes="32x32" type="image/png"/>
    <link href={{ asset('/favicon/favicon-16x16.png') }} rel="icon" sizes="16x16" type="image/png"/>
    <link href={{ asset('/favicon/site.webmanifest') }} rel="manifest"/>

    <!-- Styles / Scripts -->
    @if (file_exists(public_path('build/manifest.json')) || file_exists(public_path('hot')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @endif

    @fluxAppearance
</head>
<body class="min-h-screen antialiased">
{{ $slot }}

@persist('toast')
<flux:toast/>
@endpersist

@fluxScripts
</body>
</html>
