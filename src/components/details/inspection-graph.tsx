"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";

interface DataPoint {
  hour: number;
  asp: number;
  adp: number;
  map: number;
}

interface InspectionGraphProps {
  data: DataPoint[];
}

export function D3InspectionGraph({ data }: InspectionGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const width = 300; // Increased size for better visibility
    const height = 300;
    const radius = Math.min(width, height) / 2 - 30; // Increased padding

    svg.selectAll("*").remove(); // Clear previous render

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear().domain([0, 200]).range([0, radius]);

    // Draw background circles with labels
    const bgCircles = [50, 100, 150, 200];
    bgCircles.forEach((value) => {
      g.append("circle")
        .attr("r", radiusScale(value))
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1);

      // Add value labels
      g.append("text")
        .attr("y", -radiusScale(value))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#6b7280")
        .attr("font-size", "8px")
        .text(value.toString());
    });

    // Draw hour labels
    const hours = [0, 6, 12, 18];
    hours.forEach((hour) => {
      const angle = angleScale(hour) - Math.PI / 2;
      const x = (radius + 20) * Math.cos(angle);
      const y = (radius + 20) * Math.sin(angle);

      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#6b7280")
        .attr("font-size", "10px")
        .text(hour.toString());
    });

    // Draw axis lines
    hours.forEach((hour) => {
      const angle = angleScale(hour);
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", radius * Math.cos(angle - Math.PI / 2))
        .attr("y2", radius * Math.sin(angle - Math.PI / 2))
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1);
    });

    // Line generators
    const lineGenerator = (key: keyof DataPoint) =>
      d3
        .lineRadial<DataPoint>()
        .angle((d) => angleScale(d.hour) - Math.PI / 2)
        .radius((d) => radiusScale(d[key]));

    // Draw lines
    const lines = [
      { key: "asp", color: "#ef4444" },
      { key: "adp", color: "#3b82f6" },
      { key: "map", color: "#22c55e" },
    ] as const;

    lines.forEach(({ key, color }) => {
      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", color)
        .attr("stroke-width", 2)
        .attr("d", lineGenerator(key));
    });

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "5px")
      .style("border-radius", "3px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Add interactive points
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (!isMobile) {
      data.forEach((d) => {
        g.append("circle")
          .attr("class", "datapoint")
          .attr(
            "cx",
            radiusScale(d.asp) * Math.cos(angleScale(d.hour) - Math.PI / 2)
          )
          .attr(
            "cy",
            radiusScale(d.asp) * Math.sin(angleScale(d.hour) - Math.PI / 2)
          )
          .attr("r", 3)
          .attr("fill", "#ef4444")
          .on("mouseover", (event) => {
            tooltip
              .style("visibility", "visible")
              .html(
                `Hour: ${d.hour}<br>ASP: ${d.asp}<br>ADP: ${d.adp}<br>MAP: ${d.map}`
              )
              .style("top", event.pageY - 10 + "px")
              .style("left", event.pageX + 10 + "px");
          })
          .on("mouseout", () => {
            tooltip.style("visibility", "hidden");
          });
      });
    }

    return () => {
      // Cleanup tooltip when component unmounts
      tooltip.remove();
    };
  }, [data]);

  return (
    <div className="relative aspect-square">
      <svg ref={svgRef} viewBox="0 0 300 300" className="w-full h-full"></svg>
    </div>
  );
}
