"use client";

import { useRef, useEffect } from "react";
import * as d3 from "d3";

interface DataPoint {
  hour: number;
  asp: number;
  adp: number;
  map: number;
}

interface InspectionGraphProps {
  data: DataPoint[];
  isDifference?: boolean;
  comparisonData?: DataPoint[];
}

export function D3InspectionGraph({
  data,
  isDifference,
  comparisonData,
}: InspectionGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    const width = 300;
    const height = 300;
    const radius = Math.min(width, height) / 2 - 40;

    svg.selectAll("*").remove();

    const g = svg
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, 24])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear().domain([0, 200]).range([0, radius]);

    // Background circles
    const bgCircles = [50, 100, 150];
    bgCircles.forEach((value) => {
      g.append("circle")
        .attr("r", radiusScale(value))
        .attr("fill", "none")
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 0.5);

      // Add value labels
      g.append("text")
        .attr("y", -radiusScale(value))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .attr("fill", "#666")
        .attr("font-size", "10px")
        .text(value.toString());
    });

    // Draw hour markers
    const hours = [0, 6, 12, 18];
    hours.forEach((hour) => {
      const angle = angleScale(hour) - Math.PI / 2;
      const x = (radius + 15) * Math.cos(angle);
      const y = (radius + 15) * Math.sin(angle);

      // Draw lines
      g.append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", radius * Math.cos(angle))
        .attr("y2", radius * Math.sin(angle))
        .attr("stroke", "#e5e7eb")
        .attr("stroke-width", 0.5);

      // Add hour labels
      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#444")
        .attr("font-size", "12px")
        .text(hour);
    });

    // Draw 180° markers
    [-Math.PI / 2, Math.PI / 2].forEach((angle) => {
      const x = (radius + 15) * Math.cos(angle);
      const y = (radius + 15) * Math.sin(angle);
      g.append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dy", "0.35em")
        .attr("fill", "#444")
        .attr("font-size", "12px")
        .text("180");
    });

    // Line generators
    const lineGenerator = (key: keyof DataPoint) =>
      d3
        .lineRadial<DataPoint>()
        .angle((d) => angleScale(d.hour % 24) - Math.PI / 2)
        .radius((d) => radiusScale(d[key]))
        .curve(d3.curveCardinal);

    if (isDifference && comparisonData) {
      // Calculate and draw differences
      const differences = data.map((d, i) => {
        const comp =
          comparisonData.find((c) => c.hour % 24 === d.hour % 24) || d;
        return {
          hour: d.hour % 24,
          asp: d.asp - comp.asp,
          adp: d.adp - comp.adp,
          map: 0, // Not needed for difference view
        };
      });

      // Draw ASP difference
      g.append("path")
        .datum(differences)
        .attr("fill", "none")
        .attr("stroke", "#ef4444")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator("asp"));

      // Draw ADP difference
      g.append("path")
        .datum(differences)
        .attr("fill", "none")
        .attr("stroke", "#3b82f6")
        .attr("stroke-width", 2)
        .attr("d", lineGenerator("adp"));
    } else {
      // Draw regular view
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
    }

    // Add tooltips
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "1px solid #ddd")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("pointer-events", "none");

    // Add invisible overlay for better hover detection
    g.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("transform", `translate(${-width / 2},${-height / 2})`)
      .attr("fill", "transparent")
      .on("mousemove", (event) => {
        const [x, y] = d3.pointer(event);
        const angle = Math.atan2(y, x) + Math.PI / 2;
        const hour =
          Math.floor(
            ((angle < 0 ? angle + 2 * Math.PI : angle) * 12) / Math.PI
          ) % 24;

        const dataPoint = data.find((d) => d.hour % 24 === hour);
        if (dataPoint) {
          tooltip
            .style("visibility", "visible")
            .html(
              `Hour: ${hour}<br>ASP: ${dataPoint.asp}<br>ADP: ${dataPoint.adp}${
                !isDifference ? `<br>MAP: ${dataPoint.map}` : ""
              }`
            )
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 10}px`);
        }
      })
      .on("mouseout", () => {
        tooltip.style("visibility", "hidden");
      });

    return () => {
      tooltip.remove();
    };
  }, [data, isDifference, comparisonData]);

  return (
    <div className="relative aspect-square">
      <svg ref={svgRef} viewBox="0 0 300 300" className="w-full h-full"></svg>
    </div>
  );
}
