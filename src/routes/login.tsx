import { createFileRoute } from "@tanstack/react-router"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Header } from "@/layout/header"
import { authClient } from "@/lib/auth-client"

export const Route = createFileRoute('/login')({ component: Login })

type LoginFormValues = {
    email: string
    password: string
}

export function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormValues>()

    const Navigate = Route.useNavigate()

    const onSubmit = async (data: LoginFormValues) => {
        await authClient.signIn.email({
            email: data.email,
            password: data.password,
        })
        Navigate({ to: "/dashboard" });
    }

    return (
        <>
            <Header />

            <div className="gap-3 text-center mt-5 max-w-2xl mx-auto px-6">
                <h1 className="text-2xl font-bold">Login</h1>
                <p className="text-sm text-muted-foreground mb-5">Sign in to your account</p>

                <form onSubmit={handleSubmit(onSubmit)} className="gap-5 flex flex-col">
                    <div>
                        <Input
                            placeholder="Email"
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: "Enter a valid email address",
                                },
                            })}
                        />
                        {errors.email && (
                            <p className="text-sm text-destructive mt-1 text-left">{errors.email.message}</p>
                        )}
                    </div>

                    <div>
                        <Input
                            placeholder="Password"
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters",
                                },
                            })}
                        />
                        {errors.password && (
                            <p className="text-sm text-destructive mt-1 text-left">{errors.password.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </div>
        </>
    )
}