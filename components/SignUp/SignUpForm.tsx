"use client";
import React, { useState, useCallback } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSignUp } from '@clerk/nextjs';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Link from 'next/link';

interface Error {
    field: string,
    message: string
}

// Zod schema for signup form
const formSchema = z.object({
    emailAddress: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
        .regex(/[^A-Za-z0-9]/, { message: "Password must contain at least one special character" }),
});

const SignUpForm = ({ onSend }: { onSend: (e: boolean) => void }) => {
    const { isLoaded, signUp } = useSignUp();
    const [error, setError] = useState<Error | null>(null)
    const [showPass, setShowPass] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { emailAddress: '', password: '' },
    });

    const handleSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
        if (!isLoaded) return;
        try {
            const { emailAddress, password } = values;
            await signUp.create({ emailAddress, password });
            await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
            onSend(true);
        } catch (err: any) {
            console.error(err);
            if (err?.clerkError?.errors) {
                const errorMapping: any = {
                    form_identifier_exists: "Email address already exists",
                    form_email_address_blocked: "Email address blocked",
                    form_password_pwned: "Password has been compromised"
                };
                const firstError = err.errors[0];
                setError({ field: firstError.field || 'unknown', message: errorMapping[firstError.code] || firstError.message });
            }
        }
    }, [isLoaded, signUp, onSend]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="max-w-lg w-full flex flex-col gap-4 border-2 rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-5 xl:px-10 py-10 xl:py-20">
                <h1 className='text-center text-lg font-semibold'>Sign Up - Data Dashboard</h1>
                {error?.field === 'unknown' && <span className="-mt-1 text-sm text-red-500">{error?.message}</span>}
                {/* Email Address Field */}
                <FormField
                    control={form.control}
                    name="emailAddress"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Email address"
                                    type="email"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error?.field === 'email' && <span className="-mt-1 text-sm text-red-500">{error?.message}</span>}

                {/* Password Field */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        placeholder="Password"
                                        type={showPass ? "text" : "password"}
                                        {...field}
                                    />
                                    <span
                                        className="absolute right-3 top-3 cursor-pointer"
                                        onClick={() => setShowPass(!showPass)}
                                    >
                                        {showPass ? <FaEyeSlash className="text-black" /> : <FaEye className="text-black" />}
                                    </span>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error?.field === 'password' && <span className="-mt-1 text-sm text-red-500">{error?.message}</span>}

                {/* Submit Button */}
                <Button type="submit" className="w-full">
                    Verify
                </Button>
                <div className="w-full text-center">
                    <span>Already have an account? <Link href="/sign-in" className='text-blue-500 underline'>Sign In</Link></span>
                </div>
            </form>
        </Form>
    );
};

export default SignUpForm;