import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/auth/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-hot-toast"; // Import react-hot-toast

type FormData = {
    password: string;
    confirmPassword: string;
};

const ResetPasswordConfirmation = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        setError,
    } = useForm<FormData>();
    const router = useRouter();
    const { resetPasswordConfirm } = AuthActions();
    const searchParams = useSearchParams();

    // State for UID, Token, loading state, and password visibility
    const [uid, setUid] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for button text
    const [showPassword, setShowPassword] = useState<boolean>(false); // Password visibility state
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false); // Confirm password visibility state

    // Extract UID and Token from URL
    useEffect(() => {
        const uidParam = searchParams.get("uid");
        const tokenParam = searchParams.get("token");
        if (uidParam && tokenParam) {
            setUid(uidParam);
            setToken(tokenParam);
        }
    }, [searchParams]);

    // Custom validation for confirming passwords
    const password = watch("password");

    const onSubmit = async (data: FormData) => {
        if (!uid || !token) return; // Guard clause to prevent submission without UID and Token

        if (data.password !== data.confirmPassword) {
            setError("confirmPassword", {
                type: "manual",
                message: "Passwords do not match",
            });
            toast.error("Passwords do not match"); // Show error using react-hot-toast
            return;
        }

        setIsLoading(true); // Set loading to true when starting the password reset

        try {
            await resetPasswordConfirm(data.password, data.password, token, uid);
            toast.success("Password has been reset successfully.");
            router.push("/");
        } catch (err) {
            toast.error("Failed to reset password. Please try again.");
        } finally {
            setIsLoading(false); // Set loading to false after the process is completed
        }
    };

    // Render only if uid and token are available
    if (!uid || !token) {
        return <div className="text-center">Loading...</div>; // Or a suitable loading state
    }

    return (
        <div className="flex items-start justify-center min-h-screen bg-background dark:bg-background-dark">
            <div className="w-full max-w-md p-8 bg-white dark:bg-black rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-primary dark:text-primary-dark">
                    Set New Password
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    {/* Password field */}
                    <div>
                        <Label htmlFor="password" className="text-sm dark:text-muted-dark">
                            New Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"} // Toggle the password visibility
                                placeholder="Enter your new password"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 8,
                                        message: "Password must be at least 8 characters long",
                                    },
                                })}
                                className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
                                tabIndex={1} // Ensure tabbing order works
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-primary dark:text-primary-dark"
                                tabIndex={3} // Ensure the button is focusable via tab
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && (
                            <span className="text-xs text-red-600 mt-1">
                                {errors.password.message}
                            </span>
                        )}
                    </div>

                    {/* Confirm Password field */}
                    <div>
                        <Label htmlFor="confirmPassword" className="text-sm dark:text-muted-dark">
                            Confirm Password
                        </Label>
                        <div className="relative">
                            <Input
                                type={showConfirmPassword ? "text" : "password"} // Toggle the confirm password visibility
                                placeholder="Confirm your new password"
                                {...register("confirmPassword", {
                                    required: "Confirm Password is required",
                                })}
                                className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
                                tabIndex={2} // Ensure tabbing order works
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-primary dark:text-primary-dark"
                                tabIndex={4} // Ensure the button is focusable via tab
                            >
                                {showConfirmPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <span className="text-xs text-red-600 mt-1">
                                {errors.confirmPassword.message}
                            </span>
                        )}
                    </div>

                    <div>
                        <Button
                            type="submit"
                            className="w-full py-2 bg-primary dark:bg-primary-dark text-white rounded-md hover:bg-primary-dark dark:hover:bg-primary focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-colors"
                            disabled={isLoading} // Disable the button when loading
                            tabIndex={5} // Ensure the button is focusable via tab
                        >
                            {isLoading ? "Resetting password..." : "Reset Password"} {/* Toggle text */}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordConfirmation;
