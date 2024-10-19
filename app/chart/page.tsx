import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import RequestPage from '@/components/chart/RequestPage';
import ChartFlow from '@/components/chart/ChartFlow';
import RequestedEmail from '@/components/chart/RequestedEmail';

interface PageProps {
    searchParams: { token?: string };
}

const Page = async ({ searchParams }: PageProps) => {
    const { token } = searchParams;
    const user = await currentUser()
    if (!user) redirect('/sign-in');
    const userEmail = user?.emailAddresses[0].emailAddress

    if (!token) {
        return (
            <div>
                <h1>No token provided</h1>
                <p>You need a token to access this chart.</p>
            </div>
        );
    }

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/verify-chart-request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, userEmail }),
        });

        const data = await response.json();

        if (response.status === 403 || response.status === 409) {
            const isRequested = response.status === 409;
            return <RequestPage token={token} userEmail={userEmail} isRequested={isRequested} />;
        }

        if (response.status === 404) {
            return (
                <div className='text-center my-5'>
                    <h1>Chart Not Found</h1>
                    <p>{data.error}</p>
                </div>
            );
        }

        return (
            <div>
                <ChartFlow filter={data.data.filter} selectedProduct={data.data.selectedProduct} />
                <RequestedEmail token={token} userEmail={userEmail} />
            </div>
        );
    } catch (error) {
        console.error('Error fetching verify-chart-request:', error);
        return (
            <div className='text-center my-5'>
                <h1>Error Occurred</h1>
                <p>Something went wrong while verifying the chart access.</p>
            </div>
        );
    }
};

export default Page;