import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SignInForm from '@/components/SignIn/SignInForm';

export const metadata: Metadata = {
    title: 'Data Dashboard: Sign In',
    description: "Securely sign in to access your personalized data analytics dashboard. Enjoy real-time insights, advanced filtering, and seamless chart sharing features after logging into your account."
};

const Page = () => {
    const { userId }: { userId: string | null } = auth();
    if (userId) redirect('/');

    return (
        <main className="flex min-h-[90vh] py-2 w-full items-center justify-center">
            <SignInForm/>
        </main>
    )
}

export default Page;