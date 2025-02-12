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
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;

    svg.selectAll("*").remove(); // Clear previous render

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3
      .scaleLinear()
      .domain([0, 200]) // Assuming max blood pressure value of 200
      .range([0, radius]);

    // Draw background circles
    const bgCircles = [40, 80, 120, 160];
    bgCircles.forEach((value) => {
      g.append("circle")
        .attr("r", radiusScale(value))
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 1);
    });

    // Draw axis lines
    const axisLines = [0, 6, 12, 18];
    axisLines.forEach((hour) => {
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
    const lineAsp = d3
      .lineRadial<DataPoint>()
      .angle((d) => angleScale(d.hour))
      .radius((d) => radiusScale(d.asp));

    const lineAdp = d3
      .lineRadial<DataPoint>()
      .angle((d) => angleScale(d.hour))
      .radius((d) => radiusScale(d.adp));

    const lineMap = d3
      .lineRadial<DataPoint>()
      .angle((d) => angleScale(d.hour))
      .radius((d) => radiusScale(d.map));

    // Draw lines
    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ef4444")
      .attr("stroke-width", 2)
      .attr("d", lineAsp);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#3b82f6")
      .attr("stroke-width", 2)
      .attr("d", lineAdp);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#22c55e")
      .attr("stroke-width", 2)
      .attr("d", lineMap);

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
      .style("border-radius", "3px");

    g.selectAll("circle.datapoint")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "datapoint")
      .attr(
        "cx",
        (d) => radiusScale(d.asp) * Math.cos(angleScale(d.hour) - Math.PI / 2)
      )
      .attr(
        "cy",
        (d) => radiusScale(d.asp) * Math.sin(angleScale(d.hour) - Math.PI / 2)
      )
      .attr("r", 3)
      .attr("fill", "#ef4444")
      .on("mouseover", (event, d) => {
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
  }, [data]);

  return (
    <div className="relative aspect-square">
      <svg ref={svgRef} viewBox="0 0 200 200" className="w-full h-full"></svg>
    </div>
  );
}
