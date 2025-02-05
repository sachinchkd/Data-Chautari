import React from "react";

interface SelectedFiltersProps {
  selectedYear: number | null;
  selectedCountry: string | null;
  selectedLanguage: string | null;
  onResetYear: () => void;
  onResetCountry: () => void;
  onResetLanguage: () => void;
}

const SelectedFilters: React.FC<SelectedFiltersProps> = ({
  selectedYear,
  selectedCountry,
  selectedLanguage,
  onResetYear,
  onResetCountry,
  onResetLanguage,
}) => {
  return (
    <div className="flex gap-4">
      {selectedYear && (
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={onResetYear}
        >
          Year: {selectedYear}{" "}
          <span className="ml-2" onClick={onResetYear}>
            ✕
          </span>
        </button>
      )}
      {selectedCountry && (
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={onResetCountry}
        >
          Country: {selectedCountry}{" "}
          <span className="ml-2" onClick={onResetCountry}>
            ✕
          </span>
        </button>
      )}
      {selectedLanguage && (
        <button
          className="bg-blue-700 text-white px-4 py-2 rounded"
          onClick={onResetLanguage}
        >
          Language: {selectedLanguage}{" "}
          <span className="ml-2" onClick={onResetLanguage}>
            ✕
          </span>
        </button>
      )}
    </div>
  );
};

export default SelectedFilters;
