"use client";
import React, { useCallback, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useSignIn } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
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

const SignInForm = () => {
  const { isLoaded, signIn, setActive } = useSignIn()
  const [error, setError] = useState<Error | null>(null)
  const [showPass, setShowPass] = useState<boolean>(false);

  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { emailAddress: '', password: '' }
  });

  const togglePasswordVisibility = useCallback(() => setShowPass((prev) => !prev), []);

  const handleSubmit = useCallback(async (values: z.infer<typeof formSchema>) => {
    if (!isLoaded) return;
  
    try {
      const result = await signIn.create({
        identifier: values.emailAddress,
        password: values.password,
      });
  
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/');
      } else {
        setError({ field: 'unknown', message: 'Sign-in failed. Please try again.' });
      }
    } catch (err: any) {
      console.log(err?.errors)
      const errorResponse = err?.errors[0];
      if (errorResponse?.code === "form_identifier_not_found") {
        setError({ field: 'email', message: errorResponse?.message });
      } else if (errorResponse?.code === "form_password_incorrect") {
        setError({ field: 'password', message: errorResponse?.message });
      } else {
        setError({ field: 'unknown', message: errorResponse?.message || 'An error occurred' });
      }
    }
  }, [isLoaded, signIn, setActive, router]);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="max-w-lg w-full flex flex-col gap-4 border-2 rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-5 xl:px-10 py-10 xl:py-20"
            >
                <h1 className='text-center text-lg font-semibold'>Sign In - Data Dashboard</h1>
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
                                        onClick={togglePasswordVisibility}
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
                    Sign In
                </Button>
                <div className="w-full text-center">
                    Don&apos;t have an account? <Link href="/sign-up" className="text-blue-500 underline">Sign Up</Link>
                </div>
            </form>
        </Form>
    );
};

export default SignInForm;