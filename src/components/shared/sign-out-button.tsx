import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { LogOutIcon } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'

export function SignOutButton({
    showLabel = false,
    variant = 'ghost',
    className,
}: {
    showLabel?: boolean
    variant?: 'ghost' | 'outline'
    className?: string
}) {
    const navigate = useNavigate()
    const router = useRouter()
    const queryClient = useQueryClient()

    const signOutMutation = useMutation({
        mutationFn: async () => {
            await authClient.signOut()
        },
        onSuccess: () => {
            queryClient.invalidateQueries()
            router.invalidate()
            navigate({ to: '/' })
        },
    })

    const handleSignOut = async () => {
        toast.promise(signOutMutation.mutateAsync(), {
            loading: 'Signing out...',
            success: 'You have been signed out',
            error: 'Failed to sign out. Please try again.',
        })
    }

    return (
        <Button
            variant={variant}
            size="sm"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
            className={cn('cursor-pointer', className)}
        >
            <LogOutIcon />
            {showLabel && 'Log out'}
        </Button>
    )
}
