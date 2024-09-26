import React, { useEffect, useRef } from "react";
import { Chart, registerables } from "chart.js";

// Register Chart.js components
Chart.register(...registerables);

const NewsletterBarChart = ({ categoriesWithCount }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        const ctx = chartRef.current.getContext("2d");

        // Extract category names and article counts
        const labels = categoriesWithCount.map((category) => {
            // Capitalize the first letter of the category name
            return (
                category.category_name.charAt(0).toUpperCase() +
                category.category_name.slice(1).toLowerCase()
            );
        });
        const data = categoriesWithCount.map(
            (category) => category.is_newsletter
        );

        // Create the bar chart
        const myChart = new Chart(ctx, {
            type: "bar",
            data: {
                labels: labels,
                datasets: [
                    {
                        label: "Article Count",
                        data: data,
                    },
                ],
            },
            options: {
                responsive: true,
            },
        });

        // Clean up the chart instance on component unmount
        return () => {
            myChart.destroy();
        };
    }, [categoriesWithCount]);

    return <canvas ref={chartRef} />;
};

export default NewsletterBarChart;
