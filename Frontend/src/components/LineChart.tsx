import {
  CategoryScale,
  ChartEvent,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from "chart.js";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useData } from "../hooks/useData";
import { DataRow } from "../types/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface LineChartProps {
  onYearSelect?: (year: number | null, totalUsers: number) => void; // Modify this line
  selectedYear: number | null;
}

const options = (
  onClick: (year: number | null, totalUsers: number) => void, // Modify this line
  selectedYear: number | null
): ChartOptions<"line"> => ({
  responsive: true,
  color: "#e5e7eb",
  animation: {
    duration: 2000,
    easing: "easeInOutQuart",
  },
  interaction: {
    intersect: false,
    mode: "index",
  },
  onClick: (event: ChartEvent, elements, chart) => {
    // Cast the event to MouseEvent for type safety
    const mouseEvent = event.native as MouseEvent;
    if (elements && elements.length > 0) {
      const dataIndex = elements[0].index;
      const year = parseInt(chart.data.labels?.[dataIndex] as string);
      const totalUsers = chart.data.datasets[0].data[dataIndex] as number; // Get total users for the selected year
      onClick(year, totalUsers); // Pass total users to the callback
    }
  },
  plugins: {
    datalabels:{
      display: false
    },
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
      position: "nearest",
      backgroundColor: "rgba(0, 0, 0, 0.8)",
      padding: 12,
      titleSpacing: 8,
      titleMarginBottom: 8,
      callbacks: {
        title: function (tooltipItems) {
          return `Year: ${tooltipItems[0].label}`;
        },
        label: function (context) {
          const value = context.parsed.y;
          const year = context.label;
          const formattedValue =
            value >= 1000000
              ? `${(value / 1000000).toFixed(1)}M`
              : value >= 1000
              ? `${(value / 1000).toFixed(1)}K`
              : value;
          return `Year: ${year}, Total Users: ${formattedValue}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: "#e5e7eb", // Off-white color for x-axis labels
      },
    },
    y: {
      type: "linear",
      display: true,
      position: "left",
      beginAtZero: true,
      grid: {
        color: "rgba(1, 1, 1, 1)",
      },
      ticks: {
        color: "#e5e7eb", // Off-white color for y-axis labels
        maxTicksLimit: 6,
        callback: function (value) {
          const numValue = value as number;
          if (numValue >= 1000000) {
            return `${(numValue / 1000000).toFixed(1)}M`;
          } else if (numValue >= 1000) {
            return `${(numValue / 1000).toFixed(1)}K`;
          }
          return numValue;
        },
      },
    },
  },
  elements: {
    point: {
      radius: (context) => {
        const index = context.dataIndex;
        const year = parseInt(context.chart.data.labels?.[index] as string);
        return year === selectedYear ? 6 : 0;
      },
      hoverRadius: 6,
      pointStyle: "circle",
      backgroundColor: "#e5e7eb", // Off-white color for point labels
    },
    line: {
      tension: 0.4,
      borderColor: "#e5e7eb", // Off-white color for the line
    },
  },
});

const LineChart: React.FC<LineChartProps> = ({
  onYearSelect = () => {},
  selectedYear,
}) => {
  const { data } = useData();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "Total Users",
            data: [],
            borderColor: "#e5e7eb",
          },
        ],
      };
    }

    const yearlyData = data.reduce((acc, item: DataRow) => {
      const dateStr = item["Account Created At"];
      const date = new Date(dateStr);

      if (!isNaN(date.getTime())) {
        const year = date.getFullYear();
        acc[year] = (acc[year] || 0) + 1;
      }
      return acc;
    }, {} as Record<number, number>);

    const years = Object.keys(yearlyData)
      .map(Number)
      .sort((a, b) => a - b);

    const cumulativeCounts = years.reduce((acc, year) => {
      const previousCount = acc.length > 0 ? acc[acc.length - 1] : 0;
      acc.push(previousCount + yearlyData[year]);
      return acc;
    }, [] as number[]);

    return {
      labels: years,
      datasets: [
        {
          label: "Total Users",
          data: cumulativeCounts,
          fill: false,
          borderColor: "#e5e7eb", // Off-white color for the line
          tension: 0.4,
        },
      ],
    };
  }, [data]);

  return (
    <div className="w-full h-full">
      <h2 className="text-gray-500 text-xs mb-5">Users Growth Over Time</h2>
      <Line data={chartData} options={options(onYearSelect, selectedYear)} />
    </div>
  );
};

export default LineChart;
