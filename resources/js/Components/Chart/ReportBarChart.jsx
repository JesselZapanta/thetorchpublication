import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const ReportBarChart = ({ categoriesWithViewsCount }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        // Extract category names and article counts
        const labels = categoriesWithViewsCount.map((category) => {
            // Capitalize the first letter of the category name
            return (
                category.category_name.charAt(0).toUpperCase() +
                category.category_name.slice(1).toLowerCase()
            );
        });
        const data = categoriesWithViewsCount.map(
            (category) => category.article_view_count
        );

        // Create the bar chart
        const myChart = new Chart(ctx, {
            // type: "pie",
            // type: "doughnut",
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Article Count",
                        data: data,
                        // backgroundColor: "rgb(79 70 229)",
                        // borderColor: "rgb(79 70 229)",
                        // borderWidth: 1,
                    },
                ],
            },
            options: {
                responsive: true,
            },
            // options: {
            //     scales: {
            //         y: {
            //             beginAtZero: true,
            //             title: {
            //                 display: true,
            //                 text: "View Count",
            //             },
            //         },
            //         x: {
            //             title: {
            //                 display: true,
            //                 text: "Categories",
            //             },
            //         },
            //     },
            //     responsive: true,
            //     plugins: {
            //         legend: {
            //             display: true,
            //         },
            //     },
            // },
        });

        // Clean up the chart instance on component unmount
        return () => {
            myChart.destroy();
        };
    }, [categoriesWithViewsCount]);

    return <canvas ref={chartRef} />;
};

export default ReportBarChart;
