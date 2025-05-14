<x-layouts.app>
    <section id="register"
             class="max-w-lg w-full my-8 flex flex-col items-center justify-center mx-auto p-8 bg-zinc-800 rounded-lg">

        <h1 class="text-3xl font-semibold text-center mb-6">Sign In Back</h1>

        @if($errors->has('email'))
            <div class="bg-red-500 w-full p-2 my-2 rounded-lg text-sm text-white">
                {{ $errors->first('email') }}
            </div>
        @endif

        <form method="POST" action="{{ route('login.store') }}" class="space-y-4 w-full">
            @csrf

            <flux:field>
                <flux:label>Your Email</flux:label>
                <flux:input type="email" name="email" placeholder="iamawesome@email.com" value="{{ old('email') }}"/>
                <flux:error name="email"/>
            </flux:field>

            <flux:field>
                <flux:label>Your password</flux:label>
                <flux:input type="password" name="password" placeholder="**********"/>
                <flux:error name="password"/>
            </flux:field>

            <div class="flex items-center justify-between">
                <label class="flex items-center gap-2">
                    <input type="checkbox" name="remember" class="checkbox checkbox-primary"/>
                    <span class="text-sm">Remember Me</span>
                </label>

                <a href="#" class="text-sm link">Forgot your password?</a>
            </div>

            @if ($redirect)
                <input type="hidden" name="redirect" value="{{ $redirect }}">
            @endif

            <flux:button type="submit" variant="primary" class="w-full cursor-pointer">Sign In</flux:button>
        </form>

        <p class="mt-4 text-sm text-zinc-400">Don't have an account yet?, <a
                href="{{ route('register', ['redirect' => request('redirect') ?? request()->getRequestUri()]) }}"
                class="text-accent hover:text-primary/80 hover:underline">
                Sign Up</a>
            here.</p>
    </section>
</x-layouts.app>
