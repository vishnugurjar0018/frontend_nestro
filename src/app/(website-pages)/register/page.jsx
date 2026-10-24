
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Eye,
    EyeOff,
    LockKeyhole,
    Mail,
    ShieldCheck,
    UserRound,
} from "lucide-react";

const API_URL =
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth`;

export default function RegisterPage() {
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const updateField = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setMessage("");
    };

    // STEP 1: Validate and send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!form.name.trim()) {
            setError("Please enter your full name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        email: form.email.trim().toLowerCase(),
                        password: form.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to send OTP."
                );
            }

            setStep(2);
            setMessage(
                data.message || "OTP sent to your email."
            );
        } catch (err) {
            setError(
                err.message ||
                "Something went wrong. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // STEP 2: Verify OTP and create account
    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        if (!/^\d{6}$/.test(otp)) {
            setError("Please enter the 6-digit OTP.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/verify-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: form.email.trim().toLowerCase(),
                        otp,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "OTP verification failed."
                );
            }

            setMessage("Account created successfully!");

            router.replace("/sign-in?registered=success");
        } catch (err) {
            setError(
                err.message ||
                "Unable to verify OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // Resend OTP using the same endpoint
    const handleResendOtp = async () => {
        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await fetch(
                `${API_URL}/send-otp`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name: form.name.trim(),
                        email: form.email.trim().toLowerCase(),
                        password: form.password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(
                    data.message || "Unable to resend OTP."
                );
            }

            setOtp("");
            setMessage("A new OTP has been sent to your email.");
        } catch (err) {
            setError(err.message || "Unable to resend OTP.");
        } finally {
            setLoading(false);
        }
    };

    const inputClass = `
        w-full rounded-xl border border-[#e7dfd5]
        bg-[#fcfbf9] px-4 py-3.5 text-sm text-[#29251f]
        outline-none transition-all placeholder:text-[#aaa39a]
        focus:border-[#a87951] focus:bg-white
        focus:ring-2 focus:ring-[#a87951]/10
    `;

    return (
        <main className="
            min-h-screen bg-[#faf8f5] px-4 py-10
            sm:px-6 sm:py-14
        ">
            <div className="
                mx-auto grid w-full max-w-5xl overflow-hidden
                rounded-3xl border border-[#eee7de] bg-white
                shadow-[0_20px_70px_rgba(70,48,28,0.08)]
                lg:grid-cols-2
            ">
                {/* Left brand panel */}
                <section className="
                    relative hidden flex-col justify-between
                    overflow-hidden bg-[#34271f] p-10 text-white
                    lg:flex xl:p-12
                ">
                    <div className="
                        absolute -right-24 -top-24 h-72 w-72
                        rounded-full border border-white/10
                    " />
                    <div className="
                        absolute -bottom-28 -left-20 h-80 w-80
                        rounded-full border border-white/10
                    " />

                    <div className="relative z-10">
                        <Link
                            href="/"
                            className="
                                text-2xl font-medium tracking-[5px]
                                text-white no-underline
                            "
                        >
                            NESTRO.
                        </Link>

                        <div className="
                            mt-24 max-w-sm
                        ">
                            <p className="
                                mb-4 text-xs uppercase tracking-[4px]
                                text-[#d4ad87]
                            ">
                                Thoughtfully designed living
                            </p>

                            <h1 className="
                                text-4xl font-light leading-[1.25]
                                xl:text-5xl
                            ">
                                Make room for
                                <span className="
                                    block font-medium italic
                                    text-[#d7b18d]
                                ">
                                    better living.
                                </span>
                            </h1>

                            <p className="
                                mt-6 max-w-xs text-sm leading-7
                                text-white/65
                            ">
                                Create your Nestro account to enjoy
                                a smoother, more personal shopping
                                experience.
                            </p>
                        </div>
                    </div>

                    <div className="
                        relative z-10 flex items-center gap-3
                        border-t border-white/15 pt-6
                        text-xs text-white/60
                    ">
                        <ShieldCheck
                            size={20}
                            className="text-[#d7b18d]"
                        />
                        Your account starts with a verified email.
                    </div>
                </section>

                {/* Form panel */}
                <section className="
                    flex items-center justify-center p-6
                    sm:p-10 lg:p-12 xl:p-14
                ">
                    <div className="w-full max-w-md">
                        <Link
                            href="/"
                            className="
                                inline-flex items-center gap-2
                                text-sm text-[#82776c]
                                no-underline transition hover:text-[#9a633b]
                                lg:hidden
                            "
                        >
                            <ArrowLeft size={16} />
                            Back to store
                        </Link>

                        <div className="mb-8 mt-7 lg:mt-0">
                            <div className="
                                mb-5 flex h-12 w-12 items-center
                                justify-center rounded-2xl
                                bg-[#f4ece3] text-[#9a633b]
                            ">
                                {step === 1 ? (
                                    <UserRound size={23} />
                                ) : (
                                    <ShieldCheck size={23} />
                                )}
                            </div>

                            <p className="
                                mb-2 text-xs font-medium uppercase
                                tracking-[3px] text-[#a87951]
                            ">
                                {step === 1
                                    ? "Join Nestro"
                                    : "Email verification"}
                            </p>

                            <h2 className="
                                text-3xl font-medium tracking-tight
                                text-[#29251f] sm:text-4xl
                            ">
                                {step === 1
                                    ? "Create account"
                                    : "Verify your email"}
                            </h2>

                            <p className="
                                mt-3 text-sm leading-6 text-[#847b72]
                            ">
                                {step === 1
                                    ? "Enter your details to get started."
                                    : `We've sent a 6-digit verification code to ${form.email}.`}
                            </p>
                        </div>

                        {/* Progress indicator */}
                        <div className="mb-8 flex items-center gap-3">
                            <div className="
                                h-1.5 flex-1 overflow-hidden
                                rounded-full bg-[#eee8e1]
                            ">
                                <div className={`
                                    h-full rounded-full bg-[#9a633b]
                                    transition-all duration-300
                                    ${step === 1 ? "w-1/2" : "w-full"}
                                `} />
                            </div>

                            <span className="
                                whitespace-nowrap text-xs
                                text-[#92877b]
                            ">
                                Step {step} of 2
                            </span>
                        </div>

                        {/* Error / success messages */}
                        {error && (
                            <div
                                role="alert"
                                className="
                                    mb-5 rounded-xl border
                                    border-red-200 bg-red-50
                                    px-4 py-3 text-sm text-red-700
                                "
                            >
                                {error}
                            </div>
                        )}

                        {message && (
                            <div
                                role="status"
                                className="
                                    mb-5 rounded-xl border
                                    border-green-200 bg-green-50
                                    px-4 py-3 text-sm text-green-800
                                "
                            >
                                {message}
                            </div>
                        )}

                        {/* STEP 1: Registration form */}
                        {step === 1 && (
                            <form
                                onSubmit={handleSendOtp}
                                className="space-y-5"
                            >
                                <div>
                                    <label
                                        htmlFor="name"
                                        className="
                                            mb-2 block text-sm
                                            font-medium text-[#494037]
                                        "
                                    >
                                        Full name
                                    </label>

                                    <div className="relative">
                                        <UserRound
                                            size={18}
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-[#a79a8b]
                                            "
                                        />

                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="Enter your full name"
                                            value={form.name}
                                            onChange={updateField}
                                            maxLength={100}
                                            required
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="email"
                                        className="
                                            mb-2 block text-sm
                                            font-medium text-[#494037]
                                        "
                                    >
                                        Email address
                                    </label>

                                    <div className="relative">
                                        <Mail
                                            size={18}
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-[#a79a8b]
                                            "
                                        />

                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            placeholder="you@example.com"
                                            value={form.email}
                                            onChange={updateField}
                                            maxLength={254}
                                            required
                                            className={`${inputClass} pl-11`}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="password"
                                        className="
                                            mb-2 block text-sm
                                            font-medium text-[#494037]
                                        "
                                    >
                                        Password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={18}
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-[#a79a8b]
                                            "
                                        />

                                        <input
                                            id="password"
                                            name="password"
                                            type={
                                                showPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            placeholder="Minimum 8 characters"
                                            value={form.password}
                                            onChange={updateField}
                                            minLength={8}
                                            required
                                            className={`
                                                ${inputClass}
                                                pl-11 pr-12
                                            `}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPassword((v) => !v)
                                            }
                                            aria-label={
                                                showPassword
                                                    ? "Hide password"
                                                    : "Show password"
                                            }
                                            className="
                                                absolute right-3 top-1/2
                                                -translate-y-1/2 p-1
                                                text-[#92877b]
                                                hover:text-[#9a633b]
                                            "
                                        >
                                            {showPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="confirmPassword"
                                        className="
                                            mb-2 block text-sm
                                            font-medium text-[#494037]
                                        "
                                    >
                                        Confirm password
                                    </label>

                                    <div className="relative">
                                        <LockKeyhole
                                            size={18}
                                            className="
                                                absolute left-4 top-1/2
                                                -translate-y-1/2
                                                text-[#a79a8b]
                                            "
                                        />

                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={
                                                showConfirmPassword
                                                    ? "text"
                                                    : "password"
                                            }
                                            autoComplete="new-password"
                                            placeholder="Re-enter your password"
                                            value={form.confirmPassword}
                                            onChange={updateField}
                                            required
                                            className={`
                                                ${inputClass}
                                                pl-11 pr-12
                                            `}
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(
                                                    (v) => !v
                                                )
                                            }
                                            aria-label={
                                                showConfirmPassword
                                                    ? "Hide confirm password"
                                                    : "Show confirm password"
                                            }
                                            className="
                                                absolute right-3 top-1/2
                                                -translate-y-1/2 p-1
                                                text-[#92877b]
                                                hover:text-[#9a633b]
                                            "
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff size={19} />
                                            ) : (
                                                <Eye size={19} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="
                                        flex w-full items-center
                                        justify-center gap-3 rounded-xl
                                        bg-[#9a633b] px-5 py-4
                                        text-sm font-medium text-white
                                        transition-all duration-200
                                        hover:bg-[#80512f]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {loading
                                        ? "Sending verification code..."
                                        : "Create Account"}

                                    {!loading && (
                                        <ArrowRight size={18} />
                                    )}
                                </button>

                                <p className="
                                    text-center text-xs leading-5
                                    text-[#958a7f]
                                ">
                                    By continuing, you agree to use
                                    your account responsibly.
                                </p>
                            </form>
                        )}

                        {/* STEP 2: OTP form */}
                        {step === 2 && (
                            <form
                                onSubmit={handleVerifyOtp}
                                className="space-y-6"
                            >
                                <div>
                                    <label
                                        htmlFor="otp"
                                        className="
                                            mb-2 block text-sm
                                            font-medium text-[#494037]
                                        "
                                    >
                                        6-digit verification code
                                    </label>

                                    <input
                                        id="otp"
                                        name="otp"
                                        type="text"
                                        inputMode="numeric"
                                        autoComplete="one-time-code"
                                        placeholder="000000"
                                        value={otp}
                                        onChange={(e) => {
                                            setOtp(
                                                e.target.value
                                                    .replace(/\D/g, "")
                                                    .slice(0, 6)
                                            );
                                            setError("");
                                            setMessage("");
                                        }}
                                        maxLength={6}
                                        pattern="[0-9]{6}"
                                        required
                                        className="
                                            w-full rounded-xl border
                                            border-[#e7dfd5] bg-[#fcfbf9]
                                            px-4 py-5 text-center
                                            text-3xl font-semibold
                                            tracking-[12px] text-[#34271f]
                                            outline-none transition
                                            focus:border-[#a87951]
                                            focus:bg-white
                                            focus:ring-2
                                            focus:ring-[#a87951]/10
                                        "
                                    />

                                    <p className="
                                        mt-3 text-xs leading-5
                                        text-[#92877b]
                                    ">
                                        The code expires in 5 minutes.
                                        Check your spam folder if needed.
                                    </p>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
                                    className="
                                        flex w-full items-center
                                        justify-center gap-3 rounded-xl
                                        bg-[#9a633b] px-5 py-4
                                        text-sm font-medium text-white
                                        transition-all duration-200
                                        hover:bg-[#80512f]
                                        disabled:cursor-not-allowed
                                        disabled:opacity-60
                                    "
                                >
                                    {loading
                                        ? "Verifying..."
                                        : "Verify Email & Create Account"}

                                    {!loading && (
                                        <CheckCircle2 size={18} />
                                    )}
                                </button>

                                <div className="
                                    flex flex-col items-center gap-4
                                    text-sm
                                ">
                                    <button
                                        type="button"
                                        onClick={handleResendOtp}
                                        disabled={loading}
                                        className="
                                            font-medium text-[#9a633b]
                                            underline-offset-4
                                            hover:underline
                                            disabled:opacity-50
                                        "
                                    >
                                        Resend OTP
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setStep(1);
                                            setOtp("");
                                            setError("");
                                            setMessage("");
                                        }}
                                        disabled={loading}
                                        className="
                                            inline-flex items-center gap-2
                                            text-[#82776c]
                                            hover:text-[#9a633b]
                                            disabled:opacity-50
                                        "
                                    >
                                        <ArrowLeft size={15} />
                                        Edit account details
                                    </button>
                                </div>
                            </form>
                        )}

                        <div className="
                            my-7 flex items-center gap-4
                        ">
                            <div className="h-px flex-1 bg-[#eee8e1]" />
                            <span className="
                                text-xs text-[#a49a90]
                            ">
                                ALREADY HAVE AN ACCOUNT?
                            </span>
                            <div className="h-px flex-1 bg-[#eee8e1]" />
                        </div>

                        <Link
                            href="/sign-in"
                            className="
                                flex w-full items-center justify-center
                                rounded-xl border border-[#d9cabb]
                                px-5 py-3.5 text-sm font-medium
                                text-[#755239] no-underline
                                transition-colors hover:bg-[#faf6f0]
                            "
                        >
                            Sign In
                        </Link>

                        <div className="
                            mt-8 flex items-center justify-center
                            gap-2 text-xs text-[#a49a90]
                        ">
                            <ShieldCheck size={15} />
                            Secure registration with email verification
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}
