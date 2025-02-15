"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

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
  height = 300,
}: DifferenceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<number[][]>([]);

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
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const margin = { top: 40, right: 20, bottom: 60, left: 40 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Clear previous content
    svg.selectAll("*").remove();

    // Create scales
    const x = d3
      .scaleLinear()
      .domain([0, data.length - 1])
      .range([0, innerWidth]);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data.flat()) as number])
      .range([innerHeight, 0]);

    const g = svg // tslint:disable-next-
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add background sections
    const sections = [
      { color: "#fef3c7", width: innerWidth * 0.4 }, // Yellow
      { color: "#dbeafe", width: innerWidth * 0.4 }, // Blue
      { color: "#e5e7eb", width: innerWidth * 0.2 }, // Gray
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

    // Add axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    g.append("g").attr("transform", `translate(0,${innerHeight})`).call(xAxis);
    g.append("g").call(yAxis);

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "text-base font-semibold")
      .text("Difference Inspection Chart");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height - 20})`);

    for (let i = 0; i < numColumns; i++) {
      const color = colorScale(i.toString());
      const dash = i % 2 === 0 ? "none" : "4,4";
      const label = `Series ${i + 1}`;

      const g = legend.append("g").attr("transform", `translate(${i * 100},0)`);

      g.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("stroke", color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", dash);

      g.append("text")
        .attr("x", 25)
        .attr("y", 4)
        .text(label)
        .attr("font-size", "12px");
    }
  }, [data, width, height]);

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="w-full"
      style={{ maxWidth: "100%", height: "auto" }}
    />
  );
}
