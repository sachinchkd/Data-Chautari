import {
  BarController,
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import React, { useEffect, useRef } from "react";
import { useData } from "../hooks/useData";

ChartJS.register(
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

interface HistogramData {
  range: string;
  count: number;
}

interface HistogramChartProps {
  selectedLanguage: string | null;
}

const HistogramChart: React.FC<HistogramChartProps> = ({
  selectedLanguage,
}) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<ChartJS | null>(null);
  const { data, isLoading, error } = useData();

  useEffect(() => {
    if (isLoading || error || !data || !chartRef.current) return;

    const bins = [
      { range: "1-3", min: 1, max: 3, count: 0 },
      { range: "4-6", min: 4, max: 6, count: 0 },
      { range: "7-9", min: 7, max: 9, count: 0 },
      { range: "10-12", min: 10, max: 12, count: 0 },
      { range: "13-15", min: 13, max: 15, count: 0 },
      { range: "16-18", min: 16, max: 18, count: 0 },
      { range: "19-21", min: 19, max: 21, count: 0 },
      { range: "22-24", min: 22, max: 24, count: 0 },
      { range: "25-27", min: 25, max: 27, count: 0 },
      { range: "28-30", min: 28, max: 30, count: 0 },
    ].reverse();

    const filteredData = selectedLanguage
      ? data.filter(
          (user: any) => user["Most Used Language"] === selectedLanguage
        )
      : data;

    filteredData.forEach((user: any) => {
      const repoCount = user["Repositories Count"];
      const bin = bins.find((b) => repoCount >= b.min && repoCount <= b.max);
      if (bin) {
        bin.count += 1;
      }
    });

    const transformedData: HistogramData[] = bins.map((bin) => ({
      range: bin.range,
      count: bin.count,
    }));

    const chartData: ChartData<"bar"> = {
      labels: transformedData.map((d) => d.range),
      datasets: [
        {
          label: "Followers Count",
          data: transformedData.map((d) => d.count),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderRadius: 4,
          borderSkipped: false,
          barThickness: 30, // Increased bar height
        },
      ],
    };

    const chartOptions: ChartOptions<"bar"> = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          color:'#ffffff'
        },
        legend: {
          display: false,
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context) => {
              const value = context.raw as number;
              return `Followers: ${value}`;
            },
          },
          backgroundColor: 'rgba(17, 24, 39, 0.9)',
          titleColor: '#e5e7eb',
          bodyColor: '#e5e7eb',
          padding: 20,
          cornerRadius: 4,
        },
      },
      scales: {
        x: {
          position: 'top', // Move x-axis to top
          title: {
            display: true,
            text: "Followers Count",
            color: "#e5e7eb",
            font: {
              size: 12,
              weight: '500',
            },
            padding: { bottom: 20 },
          },
          ticks: {
            color: "#e5e7eb",
            font: {
              size: 11,
            },
          },
          grid: {
            color: "rgba(229, 231, 235, 0.1)",
          },
        },
        y: {
          position: 'left',
          title: {
            display: true,
            text: "Repo Count Range",
            color: "#e5e7eb",
            font: {
              size: 12,
              weight: '500',
            },
            padding: { bottom: 10 },
          },
          ticks: {
            color: "#e5e7eb",
            font: {
              size: 11,
            },
            padding: 8,
          },
          grid: {
            display: false,
          },
        },
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 0, // Increased top padding for the repositioned x-axis
          bottom: 0,
        },
      },
    };

    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    chartInstanceRef.current = new ChartJS(chartRef.current, {
      type: "bar",
      data: chartData,
      options: chartOptions,
    });

    return () => {
      chartInstanceRef.current?.destroy();
    };
  }, [data, isLoading, error, selectedLanguage]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading data: {error.message}</p>;

  return (
    <div className="w-full h-[500px]"> {/* Increased container height */}
      <canvas ref={chartRef} />
    </div>
  );
};

export default HistogramChart;