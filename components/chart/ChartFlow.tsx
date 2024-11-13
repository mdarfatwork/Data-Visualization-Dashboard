"use client";
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ChartComponent } from '@/components/dashboard/Chart';
import { LineChartComponent } from '@/components/dashboard/LineChart';
import { parse } from "date-fns";
import Loading from '@/components/dashboard/ChartLoading';

interface ChartFlowProps {
  filter: {
    gender?: string;
    age?: string;
    dateRange?: { from: string; to: string };
  };
  selectedProduct: string | null;
  title: string;
}

const ChartFlow = ({ filter, selectedProduct, title }: ChartFlowProps) => {
  const [data, setData] = useState<any[]>([]);   // Use ChartData[] instead of any[]
  const [lineChartData, setLineChartData] = useState<any[]>([]);

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/get-data');
      const json = await res.json();
      setData(json.data.slice(1));

    };
    fetchData();
  }, []);

  // Memoized data filtering to avoid re-calculations on each render
  const filteredData = useMemo(() => {
    if (!data.length) return [];

    return data.filter(row => {
      const matchesGender = !filter.gender || row[2] === filter.gender;
      const matchesAge = !filter.age || row[1] === filter.age;

      let matchesDate = true;
      if (filter.dateRange) {
        const from = parse(filter.dateRange.from, "dd/MM/yyyy", new Date());
        const to = parse(filter.dateRange.to, "dd/MM/yyyy", new Date());
        const rowDate = parse(row[0], "d/M/yyyy", new Date());
        matchesDate = rowDate >= from && rowDate <= to;
      }

      return matchesGender && matchesAge && matchesDate;
    });
  }, [filter, data]);

  // Memoized calculation of total sales
  const chartData = useMemo(() => {
    const products = ["A", "B", "C", "D", "E", "F"];
    return products.map((product, idx) => ({
      product,
      total: filteredData.reduce((acc, row) => acc + parseInt(row[3 + idx]), 0),
      fill: product === selectedProduct ? "var(--color-product)" : "#10b981",
    }));
  }, [filteredData, selectedProduct]);

  // Calculate line chart data for the selected product
  const calculateTotalSalesLineChart = useCallback(() => {
    if (!selectedProduct) return [];

    const productIndex = ["A", "B", "C", "D", "E", "F"].indexOf(selectedProduct);
    if (productIndex === -1) return [];

    const totalsByDate: { [key: string]: number } = {};
    filteredData.forEach(row => {
      const date = row[0];
      const totalSellAmount = parseInt(row[3 + productIndex]);
      totalsByDate[date] = (totalsByDate[date] || 0) + totalSellAmount;
    });

    return Object.entries(totalsByDate).map(([date, total]) => ({ date, total: total.toString() }));
  }, [filteredData, selectedProduct]);

  // Update line chart data whenever filtered data or selectedProduct changes
  useEffect(() => {
    setLineChartData(calculateTotalSalesLineChart());
  }, [calculateTotalSalesLineChart]);

  if (!data.length) return <Loading />;

  return (
    <>
      <h1 className='text-2xl text-center'>{title}</h1>
      <section className="w-full p-5 flex flex-col xl:flex-row gap-3">
        <div className="w-full xl:flex-1">
          <ChartComponent chartData={chartData} />
        </div>
        <div className="w-full xl:flex-1">
          {lineChartData.length > 0 && <LineChartComponent chartData={lineChartData} />}
        </div>
      </section>
    </>
  );
};

export default React.memo(ChartFlow);