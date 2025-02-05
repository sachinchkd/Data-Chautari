import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Legend,
  LinearScale,
  Title,
  Tooltip
} from "chart.js";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { useData } from "../hooks/useData";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface RankingChartProps {
  selectedYear: number | null;
  onLanguageSelect: (language: string | null) => void;
}

const RankingChart: React.FC<RankingChartProps> = ({
  selectedYear,
  onLanguageSelect,
}) => {
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

    const filteredData = selectedYear
      ? data.filter(
          (item) =>
            new Date(item["Account Created At"]).getFullYear() === selectedYear
        )
      : data;

    const languageCounts = filteredData.reduce((acc: Record<string, number>, item) => {
      const language = item["Most Used Language"];
      if (language) {
        acc[language] = (acc[language] || 0) + 1;
      }
      return acc;
    }, {});

    const sortedLanguages = Object.entries(languageCounts).sort(
      (a, b) => b[1] - a[1]
    );

    const labels = sortedLanguages.slice(0, 5).map(([language]) => language);
    const values = sortedLanguages.slice(0, 5).map(([_, count]) => count);

    return {
      labels,
      datasets: [
        {
          label: "Top 5 Languages",
          data: values,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [data, selectedYear]);

  const options: ChartOptions<"bar"> = {
    responsive: true,
    onClick: (event, elements, chart) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const selectedLanguage = chart.data.labels?.[index] as string;
        onLanguageSelect(selectedLanguage); // Pass selected language to the parent
      }
    },
    plugins: {
      datalabels: {
      color: '#ffffff'
      },
      legend: { 
      display: false,
      labels: {
        color: "#ffffff",
        font: {
        size: 14
        }
      }
      },
      title: {
      display: true,
      text: selectedYear
        ? `Ranking Chart for ${selectedYear}`
        : "Ranking Chart (All Years)",
      color: "#ffffff",
      font: {
        size: 16
      }
      },
    },
    scales: {
      x: {
      grid: { display: false },
      ticks: {
        color: "#ffffff"
      }
      },
      y: {
      beginAtZero: true,
      grid: {
        color: "rgba(1, 1, 1, 1)",
      },
      ticks: {
        color: "#ffffff"
      }
      },
    },
    };

  return (
    <div className="w-full h-full">
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default RankingChart;
