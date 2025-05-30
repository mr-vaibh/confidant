import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { AuthActions } from "@/app/auth/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FormData = {
    email: string;
};

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const { resetPassword } = AuthActions();
    const [loading, setLoading] = useState(false);

    const onSubmit = async (data: FormData) => {
        try {
            setLoading(true); // Set loading to true when starting the request
            await resetPassword(data.email);
            toast.success("Password reset email sent. Please check your inbox.");
        } catch (err) {
            console.error("Reset password error:", err);
            toast.error(
                "Failed to send password reset email. Please try again."
            );
        } finally {
            setLoading(false); // Reset loading state when the process is complete
        }
    };

    return (
        <div className="flex items-start justify-center min-h-[45vh] bg-background dark:bg-background-dark">
            <div className="w-full max-w-md p-8 bg-white dark:bg-black rounded-lg shadow-lg">
                <h3 className="text-2xl font-semibold text-primary dark:text-primary-dark">
                    Reset Password
                </h3>
                <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
                    <div>
                        <Label htmlFor="email" className="text-sm dark:text-muted-dark">
                            Email
                        </Label>
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            {...register("email", { required: "Email is required" })}
                            className="w-full p-2 mt-2 border dark:border-muted dark:bg-muted dark:text-muted-text focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark rounded-md"
                        />
                        {errors.email && (
                            <span className="text-xs text-red-600 mt-1">
                                {errors.email.message}
                            </span>
                        )}
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className={`w-full py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'bg-primary dark:bg-primary-dark text-white hover:bg-primary-dark dark:hover:bg-primary'}`}
                            disabled={loading} // Disable button while loading
                        >
                            {loading ? 'Sending...' : 'Send Reset Email'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
