import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import React, { useMemo } from "react";
import { Line } from "react-chartjs-2";
import { useData } from "../hooks/useData";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface TrendChartProps {
  selectedLanguage: string | null;
}

const TrendChart: React.FC<TrendChartProps> = ({ selectedLanguage }) => {
  const { data } = useData();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [
          {
            label: "No Data Available",
            data: [],
          },
        ],
      };
    }

    let languageToShow = selectedLanguage;

    if (!selectedLanguage) {
      const languageCounts = data.reduce((acc: Record<string, number>, curr) => {
        const language = curr["Most Used Language"];
        if (language) {
          acc[language] = (acc[language] || 0) + 1;
        }
        return acc;
      }, {});

      languageToShow = Object.entries(languageCounts)
        .sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    }

    const yearlyData = data.reduce((acc: Record<number, any[]>, curr) => {
      const year = new Date(curr["Account Created At"]).getFullYear();
      if (!acc[year]) acc[year] = [];
      acc[year].push(curr);
      return acc;
    }, {});

    const yearlyNormalizedCounts = Object.entries(yearlyData).reduce(
      (acc: Record<number, number>, [year, yearUsers]) => {
        const totalUsersInYear = yearUsers.length;
        const languageUsersInYear = yearUsers.filter(
          user => user["Most Used Language"] === languageToShow
        ).length;
        
        acc[Number(year)] = languageUsersInYear / totalUsersInYear;
        return acc;
      },
      {}
    );

    const sortedYears = Object.keys(yearlyData)
      .map(Number)
      .sort((a, b) => a - b);

    const normalizedCounts = sortedYears.map(
      year => yearlyNormalizedCounts[year] || 0
    );

    return {
      labels: sortedYears,
      datasets: [
        {
          label: `${languageToShow} Adoption Rate`,
          data: normalizedCounts,
          borderColor: "rgba(75, 192, 192, 1)",
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          fill: false,
          tension: 0.4,
          pointRadius: 4,
          pointHoverRadius: 6,
          datalabels: {
            display: false
          }
        },
      ],
    };
  }, [data, selectedLanguage]);

  const options: ChartOptions<"line"> = {
    responsive: true,
    plugins: {
      datalabels: {
        display: false
      },
      legend: { 
        position: "top",
        labels: {
          color: "#e5e7eb",
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: selectedLanguage
          ? `${selectedLanguage} Adoption Rate Over Time`
          : "Language Adoption Rate Over Time",
        color: "#e5e7eb",
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const percentage = (context.parsed.y * 100).toFixed(0);
            return `Adoption Rate: ${percentage}%`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: { 
          display: false
        },
        ticks: { 
          color: "#e5e7eb",
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: "Year",
          color: "#e5e7eb",
          font: {
            size: 14
          }
        }
      },
      y: {
        grid: { 
          color: "#2d374850"
        },
        ticks: { 
          color: "#e5e7eb",
          callback: (value) => `${(Number(value) * 100)}%`,
          font: {
            size: 12
          }
        },
        min: 0,
        max: 1,
        title: {
          display: true,
          text: "Adoption Rate",
          color: "#e5e7eb",
          font: {
            size: 14
          }
        }
      },
    }
  };

  return (
    <div className="w-full h-full">
      <Line data={chartData} options={options} />
    </div>
  );
};

export default TrendChart;