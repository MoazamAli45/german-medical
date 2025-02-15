"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface TimeSeriesData {
  timestamp: number;
  abnormalInspection5ASP: number;
  abnormalInspection4ASP: number;
  abnormalInspection5ADP: number;
  abnormalInspection4ADP: number;
  referenceVisit5ASP: number;
  referenceVisit4ASP: number;
  referenceVisit5ADP: number;
  referenceVisit4ADP: number;
}

interface DifferenceChartProps {
  data: TimeSeriesData[];
  width?: number;
  height?: number;
}

export function DifferenceChart({
  data,
  width = 800,
  height = 300,
}: DifferenceChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

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

    const y = d3.scaleLinear().domain([-1, 1]).range([innerHeight, 0]);

    const g = svg
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

    // Create line generators
    const createLine = (key: keyof TimeSeriesData) => {
      return d3
        .line<TimeSeriesData>()
        .x((d) => x(data.indexOf(d)))
        .y((d) => y(d[key]));
    };

    // Draw lines
    const lines = [
      { key: "abnormalInspection5ASP", color: "#f97316", dash: "none" },
      { key: "abnormalInspection4ASP", color: "#f97316", dash: "4,4" },
      { key: "abnormalInspection5ADP", color: "#3b82f6", dash: "none" },
      { key: "abnormalInspection4ADP", color: "#3b82f6", dash: "4,4" },
      { key: "referenceVisit5ASP", color: "#22c55e", dash: "none" },
      { key: "referenceVisit4ASP", color: "#22c55e", dash: "4,4" },
    ];

    lines.forEach((line) => {
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", line.color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", line.dash)
        .attr("d", createLine(line.key as keyof TimeSeriesData));
    });

    // Add title
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 20)
      .attr("text-anchor", "middle")
      .attr("class", "text-base font-semibold")
      .text("Difference Inspection 4 and 5");

    // Add legend
    const legend = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${height - 20})`);

    const legendItems = [
      { label: "Anormal Inspection 5 ASP", color: "#f97316", dash: "none" },
      { label: "Anormal Inspection 4 ASP", color: "#f97316", dash: "4,4" },
      { label: "Reference Visit 5 ASP", color: "#22c55e", dash: "none" },
      { label: "Reference Visit 4 ASP", color: "#22c55e", dash: "4,4" },
    ];

    legendItems.forEach((item, i) => {
      const g = legend.append("g").attr("transform", `translate(${i * 200},0)`);

      g.append("line")
        .attr("x1", 0)
        .attr("x2", 20)
        .attr("stroke", item.color)
        .attr("stroke-width", 1.5)
        .attr("stroke-dasharray", item.dash);

      g.append("text")
        .attr("x", 25)
        .attr("y", 4)
        .text(item.label)
        .attr("font-size", "12px");
    });
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
