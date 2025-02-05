import React, { useState } from "react";
import CountUp from "react-countup";
import Typewriter from "typewriter-effect";
import { useData } from "../hooks/useData";
import ArcProgressCard from "./ArcProgressCard";
import BarChart from "./BarChart";
import ChoroplethMap from "./ChoroplethMap";
import DonutChart from "./DonutChart";
import Flashcard from "./Flashcard";
import HistogramChart from "./HistogramChart";
import LineChart from "./LineChart";
import RankingChart from './RankingChart';
import SelectedFilters from "./SelectedFilters";
import TrendChart from "./TrendChart";
import WordCloud from "./WordCloud";

const Dashboard: React.FC = () => {
  const { data, isLoading, error } = useData();
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [totalUsers, setTotalUsers] = useState<number>(0);

  const handleYearSelect = (year: number | null, totalUsers: number) => {
    setSelectedYear(year);
    setTotalUsers(totalUsers);
  };

  const handleResetYear = () => {
    setSelectedYear(null);
    setTotalUsers(data ? data.length : 0);
  };

  const handleResetCountry = () => {
    setSelectedCountry(null);
    setTotalUsers(data ? data.length : 0);
  };

  const handleResetLanguage = () => {
    setSelectedLanguage(null);
    setTotalUsers(data ? data.length : 0);
  };

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-gray-200 text-lg font-inter">Loading dashboard...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-red-400 text-lg font-inter">
          Error loading data: {error.message}
        </div>
      </div>
    );

  if (!data)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <div className="text-gray-400 text-lg font-inter">No data available</div>
      </div>
    );

  return (
    <div className="p-6 bg-gradient-to-br from-gray-950 to-gray-900 min-h-screen font-inter">
      {/* Header and Toolbar */}
      <div className="mb-4 bg-gray-900 p-4 rounded-xl fixed top-0 left-0 right-0 z-10 shadow-2xl w-full border border-gray-800">
      <header className="mb-4 max-w-7xl mx-auto">
        <h1 className="font-mono text-5xl font-black text-gray-100 mb-3 flex items-center gap-3">
        GitHub Users Dashboard
        </h1>
        <p className="text-gray-400 font-light tracking-wide">
        Visualize GitHub user data over time, by country, and by various
        categories.
        </p>
      </header>

      <SelectedFilters
        selectedYear={selectedYear}
        selectedCountry={selectedCountry}
        selectedLanguage={selectedLanguage}
        onResetYear={handleResetYear}
        onResetCountry={handleResetCountry}
        onResetLanguage={handleResetLanguage}
      />
      </div>

      <div className="pt-32 max-w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        {/* Flashcard Section */}
        <div className="col-span-1 md:col-span-1 flex flex-col gap-4 font-inter">
        <Flashcard
          title="Users Count"
          bgColor="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90"
          totalUsers={<CountUp end={totalUsers} duration={2} />}
          selectedCountry={
          selectedCountry ? (
            <Typewriter
            options={{
              strings: [selectedCountry],
              autoStart: true,
              loop: false,
              deleteSpeed: 99999999,
              cursor: "",
            }}
            />
          ) : null
          }
          selectedYear={
          selectedYear ? (
            <Typewriter
            options={{
              strings: [selectedYear.toString()],
              autoStart: true,
              loop: false,
              deleteSpeed: 99999999,
              cursor: "",
            }}
            />
          ) : null
          }
        />
        <ArcProgressCard
          title="Github Users"
          percentage={(totalUsers / (data ? data.length : 1)) * 100}
          bgColor="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90"
        />
        </div>

        {/* Choropleth Map */}
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-gray-200 font-mono">
          Choropleth Map
        </h2>
        <p className="-mt-4 mb-2 text-gray-400 text-sm font-light font-mono tracking-wide">
          This map shows the distribution of GitHub users by country.
        </p>
        <ChoroplethMap
          onCountrySelect={setSelectedCountry}
          selectedYear={selectedYear}
          selectedCountry={selectedCountry}
          onTotalUsersChange={setTotalUsers}
        />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 -mt-8 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        {/* Line Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-gray-200 font-mono">
          Line Chart
        </h2>
        <p className="-mt-4 mb-2 text-gray-400 text-sm font-light font-mono tracking-wide">
          This chart shows the trend of GitHub users over the years.
        </p>
        <LineChart
          onYearSelect={handleYearSelect}
          selectedYear={selectedYear}
        />
        </div>

        {/* Bar Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-6 text-gray-200 font-mono">
          Bar Chart
        </h2>
        <p className="-mt-3 mb-2 text-gray-400 text-sm font-light  tracking-wide">
          This chart shows the distribution of GitHub users by country.
        </p>
        <div className="w-full h-full">
          <BarChart selectedCountry={selectedCountry} />
        </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-200 font-mono">
          Donut Chart
        </h2>
        <p className="-mt-3 mb-2 text-gray-400 text-sm font-light font-mono tracking-wide">
          This chart shows the distribution of GitHub users by programming language.
        </p>
        <div className="w-full h-full overflow-hidden transform scale-95">
          <DonutChart
          selectedCountry={selectedCountry}
          onLanguageSelect={setSelectedLanguage}
          />
        </div>
        </div>

        {/* Histogram Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
        <h2 className="text-xl font-semibold mb-4 text-gray-200 font-mono">
          Histogram Chart
        </h2>
        <p className="-mt-3 mb-16 text-gray-400 text-sm font-light font-mono tracking-wide">
          This chart shows the distribution of GitHub users by activity.
        </p>
        <HistogramChart selectedLanguage={selectedLanguage} />
        </div>
      </div>
      
      {/* Charts Grid 2*/}
      <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-2 gap-4 w-full">
        {/* Ranking Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-200 font-mono">
            Top Five Most Used Languages
          </h2>
          <p className="-mt-3 mb-2 text-gray-400 text-sm font-light font-mono tracking-wide">
            This chart shows the top five most used programming languages.
          </p>
          <RankingChart selectedYear={selectedYear} onLanguageSelect={setSelectedLanguage} />
        </div>

        {/* Trend Chart */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 rounded-xl p-8 shadow-2xl border border-gray-800">
          <h2 className="text-xl font-semibold mb-4 text-gray-200 font-mono">
            Trends over the Years
          </h2>
          <p className="-mt-3 mb-2 text-gray-400 text-sm font-light font-mono tracking-wide">
            This chart shows the trends of GitHub users over the years.
          </p>
          <TrendChart selectedLanguage={selectedLanguage} />
        </div>
      </div>

      {/* Word Cloud */}
      <div className="w-full h-[600px] mt-8 mb-8">
        
        <WordCloud country={selectedCountry ?? undefined} selectedYear={selectedYear ?? undefined} />
      </div>
      </div>
    </div>
  );
};

export default Dashboard;