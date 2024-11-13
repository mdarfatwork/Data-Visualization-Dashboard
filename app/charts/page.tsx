import React from 'react'
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import ChartCard from '@/components/charts/ChartCard';

const Page = async () => {
    const user = await currentUser()
    if (!user) redirect('/sign-in');
    const userEmail = user?.emailAddresses[0].emailAddress

    let chartData;

    try {
        const response = await fetch(`${process.env.API_BASE_URL}/api/get-all-charts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userEmail }),
        })

        chartData = await response.json();
    } catch (error: any) {
        console.error(`Error while fetching all charts: ${error?.message}`);
        return <div>Error loading charts</div>;
    }

    return (
        <div className='p-4 lg:p-8 flex flex-col gap-4'>
            <h2 className='text-lg font-semibold'>My Charts</h2>

            <div className="flex flex-wrap gap-4">
                {chartData?.myCharts?.length > 0 ? (
                    chartData.myCharts.map((chart: any) => (
                        <ChartCard chart={chart} key={chart.id} />
                    ))
                ) : (
                    <p>No charts available</p>
                )}
            </div>

            <h2 className='text-lg font-semibold'>Shared Charts</h2>
            <div className="flex flex-wrap gap-4">
                {chartData?.sharedCharts?.length > 0 ? (
                    chartData.sharedCharts.map((chart: any) => (
                        <ChartCard chart={chart} key={chart.id} />
                    ))
                ) : (
                    <p>No shared charts available</p>
                )}
            </div>
        </div>
    )
}

export default Page;