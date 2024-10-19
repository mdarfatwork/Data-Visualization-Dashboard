import React from 'react'
import { Metadata } from 'next';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import DashboardComponent from '@/components/dashboard/DashboardComponent';

export const metadata: Metadata = {
    title: 'Dynamic Sales Dashboard | Real-Time Data Visualization and Insights',
    description: "Explore our interactive sales dashboard designed for data-driven decision-making. Filter by gender, age, and date range to visualize key metrics and trends. Analyze product performance with detailed charts and gain valuable insights to enhance your business strategies. Get started today!"
};

const Page = () => {
    const { userId }: { userId: string | null } = auth();
    if (!userId) redirect('/sign-in');
  return (
    <div>
      <DashboardComponent/>
    </div>
  )
}

export default Page;