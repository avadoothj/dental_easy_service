"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export default function MultiBarChart({ labels, dataSets }) {
	const chartRef = useRef(null);

	useEffect(() => {
		const ctx = chartRef.current.getContext("2d");
		const chartInstance = new Chart(ctx, {
			type: "bar",
			data: { labels, datasets: dataSets },
			options: {
				responsive: true,
				maintainAspectRatio: false,
				plugins: {
					legend: { display: true, position: "bottom" },
					tooltip: { enabled: true },
				},
				scales: {
					x: {
						grid: { offset: true },
						ticks: {
							maxRotation: 0, // Angle in degrees
							minRotation: 0, // Angle in degrees
							// autoSkip: false, // Show all labels if needed
							callback: function (value) {
								const label = this.getLabelForValue(value);
								const maxLineLength = 12;
								const words = label.split(" ");
								let lines = [];
								let currentLine = "";

								words.forEach((word) => {
									if ((currentLine + word).length <= maxLineLength) {
										currentLine += (currentLine ? " " : "") + word;
									} else {
										if (currentLine) lines.push(currentLine);
										currentLine = word;
									}
								});
								if (currentLine) lines.push(currentLine);

								return lines; // Return array to render multiline with wrapping on spaces
							},
						},
					},
					y: {
						beginAtZero: true,
						suggestedMax: 80,
					},
				},
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
