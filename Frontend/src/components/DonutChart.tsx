import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useMemo, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useData } from "../hooks/useData";

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface DonutChartProps {
  selectedCountry: string | null;
  onLanguageSelect: (language: string | null) => void;
}

const fixedColors = [
  "#FF6384", // Red
  "#36A2EB", // Blue
  "#FFCE56", // Yellow
  "#4BC0C0", // Teal
  "#9966FF", // Purple
  "#FF9F40", // Orange
  "#E7E9ED", // Grey
];

const generateFixedColors = (
  labels: string[]
): { backgroundColor: string[]; borderColor: string[] } => {
  const backgroundColor = labels.map(
    (_, index) => fixedColors[index % fixedColors.length]
  );
  const borderColor = labels.map(
    (_, index) => fixedColors[index % fixedColors.length]
  );

  return { backgroundColor, borderColor };
};

const DonutChart: React.FC<DonutChartProps> = ({
  selectedCountry,
  onLanguageSelect,
}) => {
  const { data, isLoading, error } = useData();
  const [showOthersChart, setShowOthersChart] = useState(false);
  const [othersData, setOthersData] = useState<Record<string, number> | null>(
    null
  );

  const handleClick = (e: any, elements: any) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const label = chartData.labels[elementIndex];

      if (label === "Others") {
        // Generate data for "Others" and show the chart
        const othersSubset = filteredData?.reduce((acc, row) => {
          const language = row["Most Used Language"];
          if (language && !Object.keys(languageCount).includes(language)) {
            acc[language] = (acc[language] || 0) + 1;
          }
          return acc;
        }, {} as Record<string, number>);

        setOthersData(othersSubset || null);
        setShowOthersChart(true);
      } else {
        onLanguageSelect(label);
      }
    }
  };

  const handleOthersClick = (e: any, elements: any) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const label = Object.keys(othersData!)[elementIndex];
      onLanguageSelect(label);
    }
  };

  const filteredData = selectedCountry
    ? data?.filter((d) => d.Country === selectedCountry)
    : data;

  const languageCount: Record<string, number> = useMemo(() => {
    const count: Record<string, number> = {};
    filteredData?.forEach((row) => {
      const language = row["Most Used Language"];
      if (language) {
        count[language] = (count[language] || 0) + 1;
      }
    });

    const threshold = 50;
    let othersCount = 0;

    for (const [language, value] of Object.entries(count)) {
      if (value < threshold) {
        othersCount += value;
        delete count[language];
      }
    }

    if (othersCount > 0) {
      count["Others"] = othersCount;
    }

    return count;
  }, [filteredData]);

  const chartColors = useMemo(
    () => generateFixedColors(Object.keys(languageCount)),
    [languageCount]
  );

  const chartData = {
    labels: Object.keys(languageCount),
    datasets: [
      {
        data: Object.values(languageCount),
        backgroundColor: chartColors.backgroundColor,
        borderColor: chartColors.borderColor,
        borderWidth: 1,
      },
    ],
  };

  if (isLoading) return <p className="text-blue-500">Loading chart data...</p>;
  if (error)
    return <p className="text-red-500">Error loading data: {error.message}</p>;

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false, // Hide legend
        labels: {
          color: "#e5e7eb", // Off-white color for legend labels
        },
      },
      datalabels: {
        color: "#fff", // White text
        font: {
          size: 14,
          weight: "bold" as const, // Explicitly use a valid literal type
        },
        formatter: (value: number, context: any) => {
          // Show labels only if the segment is large enough
          const total = context.chart.data.datasets[0].data.reduce(
            (sum: number, val: number) => sum + val,
            0
          );
          const percentage = ((value / total) * 100).toFixed(1);
          return value > total * 0.05
            ? `${context.chart.data.labels[context.dataIndex]} (${percentage}%)`
            : ""; // Hide small labels
        },
        clip: true, // Ensure labels are clipped to fit inside the chart area
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="w-full h-full mx-auto">
      {!showOthersChart ? (
        <>
          <h2 className="text-center text-xs mb-5">
            {selectedCountry
              ? `Most Used Languages in ${selectedCountry}`
              : "Most Used Languages (Global)"}
          </h2>
          <Doughnut
            data={chartData}
            options={{
              ...options,
              onClick: handleClick,
            }}
          />
        </>
      ) : (
        <>
          <h2 className="text-center text-xs mb-5">Other Languages</h2>
          {othersData && (
            <Doughnut
              data={{
                labels: Object.keys(othersData),
                datasets: [
                  {
                    data: Object.values(othersData),
                    backgroundColor: generateFixedColors(
                      Object.keys(othersData)
                    ).backgroundColor,
                  },
                ],
              }}
              options={{
                ...options,
                onClick: handleOthersClick,
              }}
            />
          )}
          <button onClick={() => setShowOthersChart(false)}>Back</button>
        </>
      )}
    </div>
  );
};

export default DonutChart;
