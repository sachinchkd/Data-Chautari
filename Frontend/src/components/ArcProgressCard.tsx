import React from "react";
import {
  CircularProgressbarWithChildren,
  buildStyles,
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface ArcProgressCardProps {
  title: string;
  percentage: number;
  bgColor: string;
}

const ArcProgressCard: React.FC<ArcProgressCardProps> = ({
  title,
  percentage,
  bgColor,
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-lg ${bgColor} text-white`}>
      <div className="flex justify-left items-left">
        <div className="relative" style={{ width: 200, height: 180 }}>
          {/* Container with half the height for semi-circle */}
          <div className="absolute" style={{ width: 400, height: 300 }}>
            <CircularProgressbarWithChildren
              value={percentage}
              circleRatio={0.5} // Make it a semi-circle
              styles={buildStyles({
                rotation: 0.75, // Rotate to make the semi-circle face up
                strokeLinecap: 'round', // Rounded line endings
                pathColor: "rgb(62, 152, 199)", // Modern blue color
                trailColor: 'rgba(255, 255, 255, 0.1)', // Subtle trail
                pathTransitionDuration: 0.5, // Animation duration
              })}
            >
              <div className="relative "> {/* Adjust text position */}
                <div className="text-6xl font-bold text-gray-100 " style={{ fontFamily: 'Digital-7, monospace' }}>{`${Math.round(
                  percentage
                )} %`}</div>
                
              </div>
            </CircularProgressbarWithChildren>
          </div>
        </div>
      </div>
      <h2 className="text-2xl ml-28 mb-24 font-mono  -mt-14">{title}</h2>
    </div>
  );
};

export default ArcProgressCard;