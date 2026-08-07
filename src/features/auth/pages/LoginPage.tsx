import { useState, type FormEvent } from "react";
import { useLogin } from "@/hooks/useAuth";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const login = useLogin();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        login.mutate({ email, password });
    };

    return (
        <div className="min-h-screen w-full bg-surface grid grid-cols-1 lg:grid-cols-2">
            {/* Brand panel — Visible on large screens */}
            <div className="relative hidden lg:flex flex-col justify-between p-12 overflow-hidden bg-primary text-on-primary select-none">
                {/* Background Decorative Lighting */}
                <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
                <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />

                {/* Brand Header */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md shadow-sm">
                        <span className="material-symbols-outlined text-2xl text-on-primary">
                            bolt
                        </span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-on-primary">
                        Marketrixa
                    </span>
                </div>

                {/* Hero Section */}
                <div className="relative z-10 w-full max-w-lg space-y-4 my-auto">
                    <h1 className="text-4xl font-extrabold tracking-tight leading-tight lg:text-5xl">
                        Run your pipeline <br />
                        with precision.
                    </h1>
                    <p className="text-lg text-on-primary/80 font-normal leading-relaxed">
                        Leads, teams, and performance — all in one place, built for
                        high-velocity sales operations.
                    </p>
                </div>

                {/* Footer */}
                <p className="relative z-10 text-xs text-on-primary/60 font-medium">
                    © {new Date().getFullYear()} Marketrixa Inc. All rights reserved.
                </p>
            </div>

            {/* Form panel */}
            <div className="flex flex-col justify-center items-center px-6 py-12 lg:px-16 bg-surface">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile Header Branding */}
                    <div className="flex items-center gap-3 lg:hidden">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
                            <span className="material-symbols-outlined text-2xl">bolt</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-on-surface">
                            Marketrixa
                        </span>
                    </div>

                    {/* Form Header */}
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tight text-on-surface">
                            Welcome back
                        </h2>
                        <p className="text-sm text-on-surface-variant">
                            Please enter your details to sign in to your account.
                        </p>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Error Message */}
                        {login.isError && (
                            <div className="flex items-center gap-3 rounded-xl bg-error-container p-4 text-on-error-container text-sm">
                                <span className="material-symbols-outlined shrink-0 text-xl">
                                    error
                                </span>
                                <p>Invalid email or password. Please check your credentials.</p>
                            </div>
                        )}

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-on-surface"
                            >
                                Email address
                            </label>
                            <div className="relative flex items-center rounded-xl border border-outline/30 bg-surface-container-lowest transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                                <span className="material-symbols-outlined absolute left-3.5 text-xl text-on-surface-variant/70">
                                    mail
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent py-3 pl-11 pr-4 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-medium text-on-surface"
                                >
                                    Password
                                </label>
                                <a
                                    href="#"
                                    className="text-xs font-semibold text-primary hover:underline hover:text-primary/80 transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative flex items-center rounded-xl border border-outline/30 bg-surface-container-lowest transition-all focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                                <span className="material-symbols-outlined absolute left-3.5 text-xl text-on-surface-variant/70">
                                    lock
                                </span>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    autoComplete="current-password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent py-3 pl-11 pr-11 text-sm text-on-surface outline-none placeholder:text-on-surface-variant/40"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((v) => !v)}
                                    className="absolute right-3.5 text-on-surface-variant/70 hover:text-on-surface focus:outline-none transition-colors"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    <span className="material-symbols-outlined text-xl">
                                        {showPassword ? "visibility_off" : "visibility"}
                                    </span>
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={login.isPending}
                            className="w-full flex items-center justify-center gap-2 rounded-xl bg-primary py-3.5 px-4 font-semibold text-on-primary shadow-sm transition-all hover:bg-primary/90 focus:ring-2 focus:ring-primary/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {login.isPending ? (
                                <>
                                    <span className="material-symbols-outlined animate-spin text-xl">
                                        progress_activity
                                    </span>
                                    <span>Signing in…</span>
                                </>
                            ) : (
                                "Sign in"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;