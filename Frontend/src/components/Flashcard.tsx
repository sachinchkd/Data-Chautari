import React from "react";

interface FlashcardProps {
  title: string;

  bgColor: string;

  totalUsers: React.ReactNode;

  selectedCountry: React.ReactNode;

  selectedYear: React.ReactNode;
}

const Flashcard: React.FC<FlashcardProps> = ({
  title,
  bgColor,
  totalUsers,
  selectedCountry,
  selectedYear,
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
      <h2 className="text-2xl text-left font-bold font-mono mb-4 ">{title}</h2>
      <div className="text-8xl font-bold mb-2" style={{ fontFamily: 'Digital-7, monospace' }}>{totalUsers}</div>
      <div className="text-lg text-gray-300">
        <p className="text-2xl font-bold mb-2 font-mono">{selectedCountry || "World"}</p>
        <p className="text-2xl font-bold mb-1 font-mono">{selectedYear || "..."}</p>
      </div>
    </div>
  );
};

export default Flashcard;
