import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import SignUpFlow from '@/components/SignUp/SignUpFlow';

export const metadata: Metadata = {
  title: 'Data Dashboard: Sign Up',
  description: 'Create an account to unlock powerful data visualization tools. Sign up to access interactive charts, personalized insights, and secure, real-time analytics on your dashboard.',
};

const Page = () => {
  const { userId } : { userId: string | null } = auth();
  if (userId) redirect('/');
  return (
    <main className="flex min-h-[90vh] py-2 w-full items-center justify-center">
        <SignUpFlow/>
    </main>
  )
}

export default Page;