"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Loader from "../loader";

interface DifferenceChartProps {
  id: number;
  width?: number;
  height?: number;
}

interface ApiResponse {
  data: number[][];
}

export function DifferenceChart({
  id,
  width = 800,
  height = 300, // Increased height to accommodate legends
}: DifferenceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://germany-medical.vercel.app/line-chart/${id}`
        );
        const result: ApiResponse = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    // Increased bottom margin to accommodate legends
    const margin = { top: 40, right: 20, bottom: 100, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create scales
    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const y = d3.scaleLinear().domain([0, 180]).range([innerHeight, 0]); // Set y-axis max to 180

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background sections
    const sections = [
      { color: "#F8E6AE", width: innerWidth * 0.35 },
      { color: "#AED0EE", width: innerWidth * 0.4 },
      { color: "#F8E6AE", width: innerWidth * 0.25 },
    ];

    let currentX = 0;
    sections.forEach((section) => {
      g.append("rect")
        .attr("x", currentX)
        .attr("y", 0)
        .attr("width", section.width)
        .attr("height", innerHeight)
        .attr("fill", section.color);
      currentX += section.width;
    });

    // Create line generator
    const createLine = (index: number) => {
      return d3
        .line<number[]>()
        .x((_, i) => x(i))
        .y((d) => y(d[index]));
    };

    // Generate colors for lines
    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    // Draw lines
    const numColumns = data[0].length;
    for (let i = 0; i < numColumns; i++) {
      const color = colorScale(i.toString());
      const dash = i % 2 === 0 ? "none" : "4,4";

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", dash)
        .attr("d", createLine(i));
    }

    // Add only x-axis (y-axis removed)
    const xAxis = d3.axisBottom(x);
    g.append("g").attr("transform", `translate(0,${innerHeight})`).call(xAxis);

    const mainTitle =
      id != 1 ? `Difference Inspection ${id - 1} and ${id}` : "Inspection 1";
    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "text-lg sm:text-[24px] font-normal hidden")
      .text(mainTitle);

    // Make responsive
    const resize = () => {
      const newWidth = svgRef.current?.parentElement?.clientWidth || width;
      const newHeight = (newWidth / width) * height;

      svg.attr("width", newWidth).attr("height", newHeight);
      svg
        .select("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [data, width, height]);

  if (isLoading) {
    return (
      <div className="flex  gap-1 w-1/2 h-[200px]  justify-center items-center sm:self-end  ">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1 items-center sm:self-end sm:mr-8">
      <span className="text-lg  sm:text-[24px] font-normal">
        {id != 1 ? `Difference Inspection ${id - 1} and ${id}` : "Inspection 1"}
      </span>
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="max-w-full w-full sm:w-[600px] height-auto"
        preserveAspectRatio="xMidYMid meet"
      />
    </div>
  );
}
