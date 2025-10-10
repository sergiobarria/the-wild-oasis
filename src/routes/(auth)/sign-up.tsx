import { Link, createFileRoute } from '@tanstack/react-router'

import { GitHubIcon } from '@/components/icons/github-icon'
import { GoogleIcon } from '@/components/icons/google-icon'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { APP_NAME } from '@/config/constants'
import { SignUpForm } from '@/features/auth/components/sign-up-form'

export const Route = createFileRoute('/(auth)/sign-up')({
    component: RouteComponent,
})

function RouteComponent() {
    return (
        <div className="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-lg flex-col gap-6">
                <Link to="/" className="flex items-center gap-2 self-center font-medium">
                    <img src="/logo-2.webp" alt="logo" width="24" height="24" />
                    <span className="text-xl">{APP_NAME}</span>
                </Link>

                <div className="flex w-full flex-col gap-3">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-xl">Sign Up</CardTitle>
                            <CardDescription>Sign up with your GitHub or Google account</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Social Auth Buttons */}
                            <div className="space-y-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => console.log('Sign up with Google')}
                                >
                                    <GoogleIcon />
                                    Continue with Google
                                </Button>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => console.log('Sign up with GitHub')}
                                >
                                    <GitHubIcon />
                                    Continue with GitHub
                                </Button>
                            </div>

                            {/* Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-card text-muted-foreground px-2">Or continue with email</span>
                                </div>
                            </div>

                            <SignUpForm />

                            <div className="text-muted-foreground mt-4 text-center text-sm">
                                Already have an account?{' '}
                                <Link to="/sign-in" className="text-primary font-medium hover:underline">
                                    Sign in
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                    <div className="text-muted-foreground p-4 text-center text-xs">
                        By creating an account, you agree to our{' '}
                        <Link to="/terms" className="text-foreground hover:underline">
                            Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-foreground hover:underline">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
