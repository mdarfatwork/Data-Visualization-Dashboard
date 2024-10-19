"use client"
import React, { useCallback, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { InputOTP, InputOTPGroup, InputOTPSlot, } from "@/components/ui/input-otp"
import { useSignUp } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const FormSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

const Verification = () => {
    const { isLoaded, signUp, setActive } = useSignUp()
    const [error, setError] = useState<string>('')
    const router = useRouter()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            pin: "",
        },
    })

    const handleSubmit = useCallback(async (values: z.infer<typeof FormSchema>) => {
        if (!isLoaded) return;
        
        try {
          const { pin } = values;
          const completeSignUp = await signUp.attemptEmailAddressVerification({ code: pin });
          
          if (completeSignUp.status === 'complete') {
            const { emailAddress, createdUserId, createdSessionId } = completeSignUp;
            const register = await axios.post('/api/sign-up', { emailAddress, createdUserId });
            
            if (register.status === 200) {
              await setActive({ session: createdSessionId });
              router.push('/');
            } else {
              setError('Failed to Sign Up');
              console.log('Register failed:', register);
            }
          }
        } catch (err: any) {
          console.error('Verification failed:', err);
          setError('An error occurred during verification.');
        }
      }, [isLoaded, signUp, setActive, router]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-lg w-full flex flex-col gap-4 border-2 rounded-lg xl:rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] px-5 xl:px-10 py-10 xl:py-20">
                <h1 className='text-center text-xl font-semibold'>Verify Email</h1>
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem className='flex flex-col gap-3 items-center'>
                            <FormLabel className='text-base'>One-Time Password</FormLabel>
                            <FormControl>
                                <InputOTP maxLength={6} {...field} >
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormDescription>
                                Please enter the one-time password sent to your mail.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {error && <span className="text-sm text-red-500">{error}</span>}

                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )
}

export default Verification;