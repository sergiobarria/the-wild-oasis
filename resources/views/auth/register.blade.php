<x-layouts.app>
    <section id="register"
             class="max-w-lg w-full my-8 flex flex-col items-center justify-center mx-auto p-8 bg-zinc-800 rounded-lg">

        <h1 class="text-3xl font-semibold text-center mb-6">Create your new Account</h1>

        <livewire:register-form/>

        <p class="mt-4 text-sm text-zinc-400">Already have an account?, <a href="{{ route('login') }}"
                                                                           class="text-accent hover:text-primary/80 hover:underline">
                Sign In</a>
            instead</p>
    </section>
</x-layouts.app>
