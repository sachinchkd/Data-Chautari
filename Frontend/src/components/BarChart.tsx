import {
  BarElement,
  CategoryScale,
  ChartData,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useData } from "../hooks/useData";

interface BarChartProps {
  selectedCountry: string | null;
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC<BarChartProps> = ({ selectedCountry }) => {
  const { data } = useData();
  // Check if data is valid
  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-red-500">No data available for the chart.</p>;
  }

  // Filter data by selected country
  const filteredData = selectedCountry
    ? data.filter((d) => d.Country === selectedCountry)
    : data;

  // Calculate hireable and non-hireable counts
  const hireableCount = filteredData.reduce(
    (acc: Record<string, number>, curr) => {
      const hireableKey = curr.Hireable ? "Hireable" : "Non-Hireable";
      acc[hireableKey] = (acc[hireableKey] || 0) + 1;
      return acc;
    },
    { Hireable: 0, "Non-Hireable": 0 }
  );

  // Prepare chart data
  const chartData: ChartData<"bar"> = {
    labels: Object.keys(hireableCount), // ['Hireable', 'Non-Hireable']
    datasets: [
      {
        label: `Hireable Status ${
          selectedCountry ? `in ${selectedCountry}` : "(All Countries)"
        }`,
        data: Object.values(hireableCount), // [countHireable, countNonHireable]
        backgroundColor: ["rgba(75, 192, 192, 0.6)", "rgba(255, 99, 132, 0.6)"],
        borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options: ChartOptions<"bar"> = {
    responsive: true,
    plugins: {
      datalabels: {
        color:'#ffffff'
      },
      legend: { position: "top", align: "end" },
      title: {
        display: true,
        align: "start" as const,
        text: `Hireable Distribution ${
          selectedCountry ? `- ${selectedCountry}` : "(Global)"
        }`,
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
  };

  // Render bar chart
  return (
    <div className="w-full h-full mx-auto">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
