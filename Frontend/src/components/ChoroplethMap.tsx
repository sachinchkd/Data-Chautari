import React, { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { geoPath, geoNaturalEarth1 } from "d3-geo";
import * as topojson from "topojson-client";
import { useData } from "../hooks/useData";

interface ChoroplethMapProps {
  onCountrySelect: (country: string | null) => void;
  selectedYear: number | null;
  selectedCountry: string | null;
  onTotalUsersChange: (totalUsers: number) => void; // Add this line
}

const ChoroplethMap: React.FC<ChoroplethMapProps> = ({
  onCountrySelect,
  selectedYear,
  selectedCountry,
  onTotalUsersChange,
}) => {
  const { data } = useData();
  const mapRef = useRef(null);

  const countryTotalUsers = useMemo(() => {
    if (!data) return new Map();

    return data.reduce((acc, row) => {
      // Filter by selected year if provided
      if (selectedYear) {
        const creationDate = new Date(row["Account Created At"]);
        if (creationDate.getFullYear() !== selectedYear) {
          return acc;
        }
      }

      const country =
        row.Country === "United States"
          ? "United States of America"
          : row.Country;
      acc.set(country, (acc.get(country) || 0) + 1);
      return acc;
    }, new Map());
  }, [data, selectedYear]);

  const totalUsers = React.useMemo(() => {
    if (!data) return 0;

    return data.reduce((acc, row) => {
      // Filter by selected year if provided
      if (selectedYear) {
        const creationDate = new Date(row["Account Created At"]);
        if (creationDate.getFullYear() !== selectedYear) {
          return acc;
        }
      }
      return acc + 1;
    }, 0);
  }, [data, selectedYear]);

  useEffect(() => {
    onTotalUsersChange(totalUsers);
  }, [totalUsers, onTotalUsersChange]);

  React.useEffect(() => {
    if (!data) return;

    const width = 800;
    const height = 500;

    const svg = d3
      .select(mapRef.current)
      .style("display", "block")
      .style("margin", "0 auto")
      .attr("width", width)
      .attr("height", height);

    // Create tooltip
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "rgba(255, 255, 255, 0.9)")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow", "0 2px 4px rgba(0,0,0,0.1)")
      .style("font-size", "12px")
      .style("color", "black")
      .style("pointer-events", "none")
      .style("z-index", "1000");

    const projection = geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2]);
    const pathGenerator = geoPath().projection(projection);

    d3.json(
      "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"
    ).then((world: any) => {
      const countries = topojson.feature(
        world,
        world.objects.countries
      ).features;

      const maxUsers = d3.max(Array.from(countryTotalUsers.values())) || 1;
      const colorScale = d3
        .scaleSequential(d3.interpolateBlues)
        .domain([0, maxUsers]);

      svg.selectAll("*").remove();

      // Draw countries with click interaction
      svg
        .append("g")
        .selectAll("path")
        .data(countries)
        .join("path")
        .attr("d", pathGenerator)
        .attr("fill", (d) => {
          const countryName = d.properties?.name;
          const userCount = countryTotalUsers.get(countryName) || 0;
          return userCount ? colorScale(userCount) : "#c0c0c0";
        })
        .attr("stroke", "#333")
        .style("cursor", "pointer")
        .on("click", (event, d) => {
          const countryName = d.properties?.name;
          const userCount = countryTotalUsers.get(countryName) || 0;
          onCountrySelect(
            countryName === "United States of America"
              ? "United States"
              : countryName
          );
          onTotalUsersChange(userCount || 0); // Update total users state
        })
        .on("mouseover", function (event, d) {
          const countryName = d.properties?.name;
          const userCount = countryTotalUsers.get(countryName) || 0;

          // Highlight the country
          d3.select(this).style("opacity", 1).style("stroke-width", "2");

          // Show tooltip with year information if selected
          const yearInfo = selectedYear ? ` (${selectedYear})` : "";
          tooltip.style("visibility", "visible").html(`
            <strong>${countryName}${yearInfo}</strong><br/>
            Users: ${userCount}
          `);
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", event.pageY - 10 + "px")
            .style("left", event.pageX + 10 + "px");
        })
        .on("mouseout", function () {
          d3.select(this).style("opacity", 1).style("stroke-width", "1");
          tooltip.style("visibility", "hidden");
        });

      // Add legend
      const legendWidth = 300;
      const legendHeight = 10;
      const legend = svg
        .append("g")
        .attr(
          "transform",
          `translate(${width - legendWidth - 5}, ${height - 500})`
        );

      const legendScale = d3
        .scaleLinear()
        .domain([0, maxUsers])
        .range([0, legendWidth]);

      const legendGradient = legend
        .append("defs")
        .append("linearGradient")
        .attr("id", "legend-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      legendGradient
        .append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.interpolateBlues(0));
      legendGradient
        .append("stop")
        .attr("offset", "100%")
        .attr("stop-color", d3.interpolateBlues(1));

      legend
        .append("rect")
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#legend-gradient)");

      const titleText = selectedYear
        ? `Total Users (${selectedYear})`
        : "Total Users";

      legend
        .append("text")
        .attr("x", legendWidth / 2)
        .attr("y", -5)
        .attr("text-anchor", "middle")
        .style("fill", "#fff")
        .text(titleText);

      legend
        .append("text")
        .attr("x", 0)
        .attr("y", legendHeight + 15)
        .style("fill", "#fff")
        .text("0");

      legend
        .append("text")
        .attr("x", legendWidth)
        .attr("y", legendHeight + 15)
        .style("fill", "#fff")
        .attr("text-anchor", "end")
        .text(`${maxUsers}`);
    });

    return () => {
      svg.selectAll("*").remove();
      d3.selectAll(".tooltip").remove();
    };
  }, [data, countryTotalUsers, onCountrySelect, selectedYear, totalUsers]);

  return (
    <div className="relative w-full h-full">
      <svg ref={mapRef}></svg>
    </div>
  );
};

export default ChoroplethMap;
