"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function DoughnutChart({ labels, chartType = "full", colors, data, spacing = 0 }) {
	const chartRef = useRef(null);

	const dataSets = [
		{
			data: data,
			spacing: spacing,
			backgroundColor: (context) => {
				const chart = context.chart;
				const { chartArea } = chart;
				if (!chartArea) {
					return null;
				}

				return getColor(
					chart,
					typeof colors[context.dataIndex] == "undefined" ? [] : colors[context.dataIndex]
				);
			},
		},
	];

	if (chartType == "full") {
		dataSets[0].borderWidth = 0;
		dataSets[0].cutout = "60%";
	} else {
		dataSets[0].borderWidth = 0;
		dataSets[0].circumference = 180;
		dataSets[0].rotation = 270;
		dataSets[0].cutout = "60%";
	}

	const getColor = (chart, colorCode) => {
		// Default grey color
		if (!colorCode || colorCode.length == 0) colorCode = ["#d0d0dc"];

		const {
			ctx,
			chartArea: { left, right },
		} = chart;

		const gradientSegment = ctx.createLinearGradient(left, 0, right, 0);
		gradientSegment.addColorStop(0, colorCode[0]);
		gradientSegment.addColorStop(0.5, colorCode[1] ?? colorCode[0]);
		gradientSegment.addColorStop(1, colorCode[2] ?? colorCode[0]);
		return gradientSegment;
	};

	useEffect(() => {
		const ctx = chartRef.current.getContext("2d");
		const chartInstance = new Chart(ctx, {
			type: "doughnut",
			data: { datasets: dataSets, labels },
			hoverOffset: 100,
			options: {
				responsive: true,
				plugins: { legend: { display: true, position: "bottom" } },
			},
		});

		// Cleanup function to destroy the chart instance on component unmount
		return () => {
			chartInstance.destroy();
		};
	}, []);

	return (
		<canvas
			ref={chartRef}
			style={{ position: "relative", zIndex: "5" }}
		></canvas>
	);
}
