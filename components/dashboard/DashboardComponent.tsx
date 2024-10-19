"use client"
import React, { useEffect, useState, useMemo, useCallback } from 'react'
import Loading from './ChartLoading'
import { format, parse } from "date-fns"
import { DateRange } from "react-day-picker"
import { Button } from '../ui/button'
import { DatePickerWithRange } from '@/components/dashboard/DatePickRange'
import { ChartComponent } from '@/components/dashboard/Chart'
import { LineChartComponent } from '@/components/dashboard/LineChart'
import Cookies from 'js-cookie'
import { ShareChart } from './ShareChart'

interface dateRange {
    from: string;
    to: string;
}

interface LineChartData {
    date: string,
    total: string,
}

const DashboardComponent = () => {
    const [data, setData] = useState<any>([])
    const [selectedGender, setSelectedGender] = useState<string>(Cookies.get('selectedGender') || '');
    const [selectedAge, setSelectedAge] = useState<string>(Cookies.get('selectedAge') || '');
    const [selectedDate, setSelectedDate] = useState<dateRange | null>(
        Cookies.get('selectedDate') ? JSON.parse(Cookies.get('selectedDate') as string) : null
    );
    const [selectedProduct, setSelectedProduct] = useState<string | null>(Cookies.get('selectedProduct') || null);
    const [lineChartData, setLineChartData] = useState<LineChartData[]>([]);
    const [resetDatePicker, setResetDatePicker] = useState<boolean>(false);

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch('/api/get-data');
            const json = await res.json();
            setData(json.data.slice(1));
        };

        fetchData();
    }, []);

    const filteredData = useMemo(() => {
        if (!data) return []; // No data, return empty array

        return data.filter((row: any) => {
            // Filter by gender if selected
            const matchesGender = selectedGender ? row[2] === selectedGender : true;
            // Filter by age if selected
            const matchesAge = selectedAge ? row[1] === selectedAge : true;

            let matchesDate = true;
            if (selectedDate) {
                const from = parse(selectedDate.from, "dd/MM/yyyy", new Date());
                const to = parse(selectedDate.to, "dd/MM/yyyy", new Date());
                const rowDate = parse(row[0], "d/M/yyyy", new Date());
                matchesDate = rowDate >= from && rowDate <= to;
            }

            // Return rows that match gender, age, and date range
            return matchesGender && matchesAge && matchesDate;
        });
    }, [data, selectedGender, selectedAge, selectedDate]);

    const calculateTotalSales = useCallback((filteredData: any[]) => {
        const products = ["A", "B", "C", "D", "E", "F"];
        return products.map((product, idx) => ({
            product,
            total: filteredData.reduce((acc, row) => acc + parseInt(row[3 + idx]), 0),
        }));
    }, []);

    const chartData = useMemo(() => calculateTotalSales(filteredData).map(item => ({
        ...item,
        fill: item.product === selectedProduct ? "var(--color-product)" : "#10b981",
    })), [filteredData, selectedProduct, calculateTotalSales]);

    const calculateTotalSalesLineChart = useCallback((product: string) => {
        const productIndex = ["A", "B", "C", "D", "E", "F"].indexOf(product);
        if (productIndex === -1) return [];

        const totalsByDate: { [key: string]: number } = {};
        filteredData.forEach((row: any) => {
            const date = row[0];
            totalsByDate[date] = (totalsByDate[date] || 0) + parseInt(row[3 + productIndex]);
        });

        return Object.entries(totalsByDate).map(([date, total]) => ({ date, total: total.toString() }));
    }, [filteredData]);

    useEffect(() => {
        if (selectedProduct) {
            const lineChartData = calculateTotalSalesLineChart(selectedProduct);
            setLineChartData(lineChartData);
        }
    }, [selectedGender, selectedAge, selectedDate, selectedProduct, data, calculateTotalSalesLineChart]);

    const handleGenderChange = useCallback((value: 'Male' | 'Female') => {
        const newGender = selectedGender === value ? '' : value;
        setSelectedGender(newGender);
        Cookies.set('selectedGender', newGender, { expires: 7 }); // Set cookie
    }, [selectedGender]);

    // Function to handle age change
    const handleAgeChange = useCallback((value: '15-25' | '>25') => {
        const newAge = selectedAge === value ? '' : value;
        setSelectedAge(newAge);
        Cookies.set('selectedAge', newAge, { expires: 7 }); // Set cookie
    }, [selectedAge]);

    const handleDateChange = useCallback((range: DateRange | undefined) => {
        if (range?.from && range?.to) {
            const fromFormatted = format(range.from, "dd/MM/yyyy");
            const toFormatted = format(range.to, "dd/MM/yyyy");
            const newDate = { from: fromFormatted, to: toFormatted } as dateRange;
            setSelectedDate(newDate);
            Cookies.set('selectedDate', JSON.stringify(newDate), { expires: 7 }); // Set cookie
        } else {
            console.log('No date range selected');
        }
    }, []);

    const handleBarClick = useCallback((data: any) => {
        if (selectedProduct === data.product) {
            // Deselect the product if it's clicked again
            setSelectedProduct(null);
            setLineChartData([]);
            Cookies.remove('selectedProduct');
        } else {
            // Select the new product
            const lineChartData = calculateTotalSalesLineChart(data.product);
            setLineChartData(lineChartData);
            setSelectedProduct(data.product);
            Cookies.set('selectedProduct', data.product, { expires: 7 }); // Set cookie
        }
    }, [selectedProduct, calculateTotalSalesLineChart]);

    const handleClearFilter = useCallback(() => {
        setSelectedGender('');
        setSelectedAge('');
        setSelectedDate(null);
        Cookies.remove('selectedGender');
        Cookies.remove('selectedAge');
        Cookies.remove('selectedDate');
        setResetDatePicker(true);
      }, []);

    if (data.length === 0) return <Loading />

    return (
        <div className='w-full p-5 lg:p-10'>
            <div className="w-full bg-emerald-100 rounded-md min-h-screen p-2 lg:p-5">
                <h1 className='text-center text-3xl font-semibold text-amber-500 mt-3'>Product Sell Statics</h1>
                {/* Filter */}
                <div className="flex flex-col lg:flex-row gap-3 my-3">
                    {/* Gender Filter */}
                    <section className='flex items-center gap-2'>
                        <strong>Gender:</strong>
                        <Button onClick={() => handleGenderChange("Male")} className={`${selectedGender === 'Male' && 'bg-emerald-500 text-amber-100'} hover:bg-emerald-500`}>Male</Button>
                        <Button onClick={() => handleGenderChange("Female")} className={`${selectedGender === 'Female' && 'bg-emerald-500 text-amber-100'} hover:bg-emerald-500`}>Female</Button>
                    </section>
                    {/* Age Filter */}
                    <section className="flex items-center gap-2">
                        <strong>Age:</strong>
                        <Button onClick={() => handleAgeChange("15-25")} className={`${selectedAge === "15-25" && 'bg-emerald-500 text-amber-100'} hover:bg-emerald-500`}>15-25</Button>
                        <Button onClick={() => handleAgeChange(">25")} className={`${selectedAge === ">25" && 'bg-emerald-500 text-amber-100'} hover:bg-emerald-500`}>&#62;25</Button>
                    </section>
                    <DatePickerWithRange
                        onDateChange={handleDateChange}
                        reset={resetDatePicker} // Pass the reset state
                        onResetComplete={() => setResetDatePicker(false)} // Callback to clear reset state
                    />
                    <Button onClick={handleClearFilter}>Clear All Filter</Button>
                    <ShareChart filter={{ gender: selectedGender, age: selectedAge, dateRange: selectedDate }} selectedProduct={selectedProduct} />
                </div>
                {/* chart */}
                <article className="flex flex-col xl:flex-row gap-3">
                    <div className="w-full xl:flex-1">
                        <ChartComponent chartData={chartData} onSend={handleBarClick} />
                    </div>
                    <div className="w-full xl:flex-1">
                        {lineChartData.length > 0 && <LineChartComponent chartData={lineChartData} />}
                    </div>
                </article>
            </div>
        </div>
    )
}

export default DashboardComponent;