"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function LineGraph({ labels, dataSets }) {
	const chartRef = useRef(null);
	let chartInstance;

	useEffect(() => {
		initializeGraph();
		return () => {
			chartInstance.destroy();
		};
	}, []);

	const initializeGraph = async () => {
		const { default: zoomPlugin } = await import("chartjs-plugin-zoom");

		Chart.register(zoomPlugin);
		const ctx = chartRef.current.getContext("2d");

		chartInstance = new Chart(ctx, {
			type: "line",
			data: { labels, datasets: dataSets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: true, position: "bottom" },
					zoom: {
						zoom: {
							wheel: { enabled: true }, // Enable zoom with mouse wheel
							pinch: { enabled: true }, // Enable pinch zoom on touch devices
							mode: "x", // Zoom both axes, use 'x' or 'y' for single axis
						},
						pan: {
							enabled: true, // Enable panning
							mode: "x",
						},
					},
				},
				scales: {
					x: { grid: { offset: true }, ticks: { stepSize: 1 } },
					y: { beginAtZero: true, ticks: { stepSize: 1 } },
				},
			},
		});
	};

	return (
		<canvas
			ref={chartRef}
			style={{ position: "relative", zIndex: "5" }}
		></canvas>
	);
}
