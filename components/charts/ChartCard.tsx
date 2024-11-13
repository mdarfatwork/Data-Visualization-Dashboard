"use client"
import React from 'react'
import Link from 'next/link';

const ChartCard = ({ chart }: { chart: any }) => {
    if (!chart) return null;

    const formattedDate = new Date(chart.createdAt).toLocaleDateString('en-GB');
    return (
        <div className='w-72 max-w-80 rounded-lg bg-emerald-100 py-4 px-3'>
            <h3 className='text-center text-xl font-semibold mb-2 lg:mb-4'>{chart.chartName}</h3>
            <p className='flex justify-between'>
                <span>{formattedDate}</span>
                <Link className='underline' href={`chart?token=${chart.chartId}`}>Open</Link>
            </p>
        </div>
    )
}

export default ChartCard