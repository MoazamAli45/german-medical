"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import Loader from "../loader";

const xLabels = [
  "ASP 24h",
  "ADP 24h",
  "ASP Day",
  "ADP Day",
  "ASP Night",
  "ADP Night",
];
const yLabels = ["5", "4", "3", "2", "1"];

export default function Heatmap({ id }: { id: number }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://germany-medical.vercel.app/heatmap"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const jsonData = await response.json();
        setData(jsonData[id - 1]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!svgRef.current || !data.length || isLoading) return;

    const margin = { top: 20, right: 70, bottom: 70, left: 40 };
    const width = 400;
    const height = 300;

    d3.select(svgRef.current).selectAll("*").remove();

    const flatData = data.flat();
    const minValue = Math.min(...flatData);
    const maxValue = Math.max(...flatData);

    const colorScale = d3
      .scaleSequential()
      .domain([minValue, maxValue])
      .interpolator(d3.interpolateYlGnBu);

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", `0 0 ${width} ${height}`);

    const cellWidth = (width - margin.left - margin.right) / xLabels.length;
    const cellHeight = (height - margin.top - margin.bottom) / yLabels.length;

    const cells = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Create row groups for click handling
    const rows = cells
      .selectAll(".row")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "row")
      .attr("transform", (d, i) => `translate(0,${i * cellHeight})`)
      .style("cursor", "pointer")
      .on("click", (event, d) => {
        const rowIndex = data.length - data.indexOf(d);
        router.push(`/inspection/${rowIndex}`);
      });

    // Add cells to each row
    rows.each(function (rowData, rowIndex) {
      const row = d3.select(this);

      row
        .selectAll("rect")
        .data(rowData)
        .enter()
        .append("rect")
        .attr("x", (d, j) => j * cellWidth)
        .attr("width", cellWidth)
        .attr("height", cellHeight)
        .attr("fill", (d) => colorScale(d))
        .append("title")
        .text((d) => d);

      // Add a border to the specific row
      if (rowIndex === 5 - id) {
        row
          .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", cellWidth * xLabels.length)
          .attr("height", cellHeight)
          .attr("fill", "none")
          .attr("stroke", "#773D76")
          .attr("stroke-width", 3);
      }
    });

    // Add X axis labels
    svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${height - margin.bottom + 10})`
      )
      .selectAll("text")
      .data(xLabels)
      .enter()
      .append("text")
      .attr("x", (d, i) => i * cellWidth + cellWidth / 2)
      .attr("y", 0)
      .attr("text-anchor", "end")
      .attr(
        "transform",
        (d, i) => `rotate(-45, ${i * cellWidth + cellWidth / 2}, 0)`
      )
      .style("font-size", "12px")
      .text((d) => d);

    // Add Y axis labels
    svg
      .append("g")
      .attr("transform", `translate(${margin.left - 10},${margin.top})`)
      .selectAll("text")
      .data(yLabels)
      .enter()
      .append("text")
      .attr("x", 0)
      .attr("y", (d, i) => i * cellHeight + cellHeight / 2)
      .attr("text-anchor", "end")
      .attr("dominant-baseline", "middle")
      .style("font-size", "12px")
      .text((d) => d);

    // Add color bar
    const legendWidth = 15;
    const legendHeight = height - margin.top - margin.bottom;

    const legend = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - margin.right + 20},${margin.top})`
      );

    const defs = legend.append("defs");
    const gradient = defs
      .append("linearGradient")
      .attr("id", "legend-gradient")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "0%")
      .attr("y2", "100%");

    const stops = d3.range(0, 1.1, 0.1);
    stops.forEach((stop) => {
      gradient
        .append("stop")
        .attr("offset", `${stop * 100}%`)
        .attr(
          "stop-color",
          colorScale(maxValue - (maxValue - minValue) * stop)
        );
    });

    legend
      .append("rect")
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#legend-gradient)")
      .style("stroke", "black")
      .style("stroke-width", 0);

    legend
      .append("text")
      .attr("x", legendWidth + 5)
      .attr("y", 0)
      .attr("dominant-baseline", "hanging")
      .style("font-size", "12px")
      .text("High");

    legend
      .append("text")
      .attr("x", legendWidth + 2)
      .attr("y", legendHeight)
      .attr("dominant-baseline", "baseline")
      .style("font-size", "12px")
      .text("Low");
  }, [data, isLoading, id, router]);

  if (error) {
    return (
      <div className="p-4">
        <div className="text-center text-red-500">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4 flex items-center w-full h-full justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="p-2">
      <div className="relative">
        <div className="flex items-center justify-center gap-1">
          <h2 className="text-base sm:text-[19px] font-bold text-center md:max-w-[70%]">
            Mean Deviation from Reference Values Over Time
          </h2>
          <InfoIcon className="h-6 w-6 text-black" />
        </div>
        <svg
          ref={svgRef}
          className="w-full h-auto"
          style={{ maxHeight: "600px" }}
        />
        <div className="flex gap-4 items-center flex-col">
          <div className="flex items-center justify-center gap-2">
            <span className="bg-[#D3D3D3] w-[23px] h-[20px] flex items-center justify-center text-xs">
              X
            </span>
            <span className="text-[14px] text-black w-[100px]">
              local scaling
            </span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-[#D3D3D3] w-[23px] h-[20px]"></span>
            <span className="text-[14px] text-black w-[100px]">
              global scaling
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
