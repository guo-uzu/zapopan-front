'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSeparator,
} from "@/components/ui/field"

import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { createClient } from "@/utils/supabase/client"
import { useState } from "react"

export function LoginForm({
    className,
    ...props
}: React.ComponentProps<"form">) {

    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState<string | null>(null)

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password
            })
            if (error) throw error
            router.push("/")
            router.refresh()
        } catch (error) {
            console.error('Sign-in error:', (error as Error).message)
            setError((error as Error).message)
        }
    }

    const handleSignInWithGoogle = async () => {
        setError(null);
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `https://zapopan-front.vercel.app/auth/callback`,
                },
            });
            if (error) throw error;
            // Note: We don't redirect here. Supabase handles the
            // redirect *to* Google.
        } catch (error) {
            console.error('Google Sign-in error:', (error as Error).message);
            setError((error as Error).message);
        }
    };

    return (
        <form onSubmit={handleSignIn} className={cn("flex flex-col gap-6", className)} {...props}>
            <FieldGroup>
                <div className="flex flex-col items-center gap-1 text-center">
                    <h1 className="text-2xl font-bold">Login to your account</h1>
                    <p className="text-muted-foreground text-sm text-balance">
                        Enter your email below to login to your account
                    </p>
                </div>
                <Field>
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input value={email}
                        onChange={(e) => setEmail(e.target.value)} id="email" type="email" placeholder="m@example.com" required />
                </Field>
                <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input id="password" type="password" required value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </Field>
                {error && (
                    <p className="text-sm font-medium text-destructive">{error}</p>
                )}
                <Field>
                    <Button type="submit">Login</Button>
                </Field>
                <FieldSeparator>Or continue with</FieldSeparator>
                <Field>
                    <Button onClick={handleSignInWithGoogle} variant="outline" type="button">
                        <svg width="800px" height="800px" viewBox="0 0 32 32" data-name="Layer 1" id="Layer_1" xmlns="http://www.w3.org/2000/svg"><path d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16" fill="#00ac47" /><path d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16" fill="#4285f4" /><path d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z" fill="#ffba00" /><polygon fill="#2ab2db" points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374" /><path d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z" fill="#ea4435" /><polygon fill="#2ab2db" points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626" /><path d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z" fill="#4285f4" /></svg>
                        Login with Google
                    </Button>

                </Field>
            </FieldGroup>
        </form>
    )
}
