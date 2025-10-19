<script lang="ts">
	import logo from '$lib/assets/logo-2.webp';
	import SignInForm from '$lib/components/auth/sign-in-form.svelte';
	import SocialSignIn from '$lib/components/shared/social-sign-in.svelte';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { APP_NAME } from '$lib/config/constants';
</script>

<svelte:head>
	<title>Sign In - {APP_NAME}</title>
</svelte:head>

<div class="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
	<div class="flex w-full max-w-lg flex-col gap-6">
		<a href="/" class="flex items-center gap-2 self-center font-medium">
			<img src={logo} alt="logo" width="24" height="24" />
			<span class="text-xl">{APP_NAME}</span>
		</a>

		<div class="flex w-full flex-col gap-3">
			<Card>
				<CardHeader class="text-center">
					<CardTitle class="text-xl">Sign In</CardTitle>
					<CardDescription>Sign in with your Google or Github account</CardDescription>
				</CardHeader>

				<CardContent class="space-y-6">
					<!-- Social auth buttons -->
					<SocialSignIn />

					<!-- Divider -->
					<div class="relative">
						<div class="absolute inset-0 flex items-center">
							<span class="w-full border-t"></span>
						</div>
						<div class="relative flex justify-center text-xs uppercase">
							<span class="bg-card px-2 text-muted-foreground">Or continue with email</span>
						</div>
					</div>

					<SignInForm />

					<div class="mt-4 text-center text-sm text-muted-foreground">
						Don't have an account?
						<a href="/sign-up" class="font-medium text-primary hover:underline"> Sign up </a>
					</div>

					<div class="text-center text-sm text-muted-foreground">
						<a href="/forgot-password" class="font-medium text-primary hover:underline">
							Forgot your password?
						</a>
					</div>
				</CardContent>
			</Card>

			<div class="p-4 text-center text-xs text-muted-foreground">
				By creating an account, you agree to our
				<a href="/terms" class="text-foreground hover:underline"> Terms of Service </a>
				and
				<a href="/privacy" class="text-foreground hover:underline"> Privacy Policy </a>
			</div>
		</div>
	</div>
</div>
