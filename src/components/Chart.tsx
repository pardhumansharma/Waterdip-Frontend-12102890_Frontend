import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
import './Chart.css';

interface ChartProps {
    data: any[]; // Define the structure of your data
}

export const Chart: React.FC<ChartProps> = ({ data }) => {
    // Prepare chart data based on the filtered data
    const totalVisitorsPerDay = data.map(row => ({
        date: `${row.arrival_date_year}-${row.arrival_date_month}-${row.arrival_date_day_of_month}`,
        totalVisitors: Number(row.adults) + Number(row.children) + Number(row.babies),
        totalAdults: Number(row.adults),
        totalChildren: Number(row.children),
    }));

    // Count visitors by country
    const visitorsByCountry: Record<string, number> = {};
    data.forEach(row => {
        const country = row.country; // Assuming 'country' is the column name
        const visitors = Number(row.adults) + Number(row.children) + Number(row.babies);
        visitorsByCountry[country] = (visitorsByCountry[country] || 0) + visitors;
    });

    // Extract country names in the order they first appear in the dataset
    const countryOrder: string[] = [];
    data.forEach(row => {
        if (!countryOrder.includes(row.country)) {
            countryOrder.push(row.country);
        }
    });

    // Prepare series data for the column chart without sorting
    const columnSeries = countryOrder.map(country => ({
        name: country,
        data: [visitorsByCountry[country] || 0], // Default to 0 if no visitors
    }));

    // Chart options for the line chart
    const lineChartOptions: ApexOptions = {
        chart: {
            id: 'line-chart',
            type: 'line',
            background: '#fff', // Set background color to white
        },
        xaxis: {
            categories: totalVisitorsPerDay.map(item => item.date),
        },
    };

    // Chart options for the column chart
    const columnChartOptions: ApexOptions = {
        chart: {
            id: 'column-chart',
            type: 'bar',
            background: '#fff', // Set background color to white
        },
        plotOptions: {
            bar: {
                borderRadius: 5,
                horizontal: false,
                columnWidth: '60%', // Adjusted for better spacing
            },
        },
        xaxis: {
            categories: countryOrder.map(country => `${country} (${visitorsByCountry[country]})`), // Display country and visitor count
            labels: {
                style: {
                    fontSize: '12px',
                    colors: ['#000'], // Change x-axis label color for contrast
                },
            },
        },
        yaxis: {
            title: {
                text: 'Number of Visitors',
                style: {
                    color: '#000', // Set y-axis title color to black (string instead of array)
                },
            },
            min: 0, // Ensure the y-axis starts at 0
            max: Math.max(...Object.values(visitorsByCountry)) * 1.1, // Increase the max value with a 10% buffer for clearer display
            tickAmount: 10, // Define the number of ticks on the y-axis for better visibility
            labels: {
                formatter: (value: number) => value !== undefined ? value.toString() : '0',
                style: {
                    colors: ['#000'], // Set y-axis label color to black
                },
            },
        },
        dataLabels: {
            enabled: true,
            formatter: (val: number) => (val !== undefined ? val.toString() : '0'), // Ensure value exists before formatting
            offsetY: -5, // Adjust vertical position of labels above the column
            style: {
                colors: ['#000'], // Set label colors for better visibility
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
        },
       
        grid: {
            padding: {
                left: 0,
                right: 0,
            },
        },
    };

    // Sort the series based on the visitor count before rendering
    const sortedColumnSeries = columnSeries.sort((a, b) => b.data[0] - a.data[0]);

    const sparklineOptions: ApexOptions = {
        chart: {
            id: 'sparkline-chart',
            type: 'line',
            sparkline: {
                enabled: true,
            },
            background: '#fff', // Set sparkline background color to white
        },
        stroke: {
            curve: 'smooth',
            width: 2,
        },
        tooltip: {
            enabled: true,
        },
    };

    return (
        <div className="charts">
            <h2 className="chart-title">Number of Visitors Per Day</h2>
            <ReactApexChart
                options={lineChartOptions}
                series={[{ name: 'Total Visitors', data: totalVisitorsPerDay.map(item => item.totalVisitors) }]}
                type="line"
                height={350}
            />

            <h2 className="chart-title">Number of Visitors by Country</h2>
            <ReactApexChart
                options={columnChartOptions}
                series={sortedColumnSeries}
                type="bar"
                height={500} // Increased height for better visualization
            />

            <h2 className="chart-title">Total Number of Adult Visitors</h2>
            <ReactApexChart
                options={sparklineOptions}
                series={[{ name: 'Adults', data: totalVisitorsPerDay.map(item => item.totalAdults) }]}
                type="line"
                height={100}
            />

            <h2 className="chart-title">Total Number of Children Visitors</h2>
            <ReactApexChart
                options={sparklineOptions}
                series={[{ name: 'Children', data: totalVisitorsPerDay.map(item => item.totalChildren) }]}
                type="line"
                height={100}
            />
        </div>
    );
};
