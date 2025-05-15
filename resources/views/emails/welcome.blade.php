<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>{{ $title ?? 'The Wild Oasis' }}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;600&display=swap');

        :root {
            --accent: oklch(73.94% 0.112 83.18);
            --accent-foreground: oklch(28% 0.03 83.18);
            --accent-content: oklch(61% 0.14 83.18);
            --gray-50: oklch(97.5% 0.005 270);
            --gray-100: oklch(95% 0.007 270);
            --gray-800: oklch(27% 0.01 270);
        }

        body {
            background-color: var(--gray-50);
            font-family: 'Josefin Sans', sans-serif;
            color: var(--gray-800);
            margin: 0;
            padding: 0;
        }

        .container {
            max-width: 600px;
            margin: 2rem auto;
            background-color: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
        }

        .header {
            background: linear-gradient(to right, var(--accent), var(--accent-content));
            padding: 2rem;
            text-align: center;
            color: white;
        }

        .header h1 {
            margin: 0;
            font-size: 1.5rem;
        }

        .content {
            padding: 2rem;
        }

        .button {
            display: inline-block;
            background-color: var(--accent);
            color: var(--accent-foreground);
            text-decoration: none;
            font-weight: 600;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            margin-top: 2rem;
        }

        .footer {
            padding: 1.5rem;
            text-align: center;
            font-size: 0.875rem;
            color: var(--gray-100);
            background-color: var(--gray-800);
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <h1>{{ $title ?? 'The Wild Oasis' }}</h1>
    </div>

    <div class="content">
        <h2 style="margin-top: 0">Hi {{ $user->profile->name }},</h2>

        <p>
            Welcome to <strong>The Wild Oasis</strong> 🌴 — your dream escape awaits. We’re excited to have you onboard!
        </p>

        <p>
            You can now explore our cabins, check availability, and book your stay with just a few clicks.
        </p>

        <p>
            If you have any questions or need assistance, feel free to reach out. We’re here for you.
        </p>

        <a href="{{ route('cabins.index') }}" class="button" target="_blank" rel="noopener noreferrer">Explore
            Cabins</a>
    </div>

    <div class="footer">
        &copy; {{ date('Y') }} The Wild Oasis. All rights reserved.
    </div>
</div>
</body>
</html>
