"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type BloodPressureData = {
  normalASP: number[];
  normalADP: number[];
  abnormalASP: number[];
  abnormalADP: number[];
};

interface BloodPressureChartProps {
  number: number;
}

export default function BloodPressureChart({
  number,
}: BloodPressureChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [data, setData] = useState<BloodPressureData>({
    normalASP: Array(10).fill(120),
    normalADP: Array(10).fill(80),
    abnormalASP: Array(10).fill(0),
    abnormalADP: Array(10).fill(0),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://germany-medical.vercel.app/all-radars"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const newData = await response.json();
        const apiData = newData[number - 1];

        setData({
          normalASP: apiData.normalASP || [],
          normalADP: apiData.normalADP || [],
          abnormalASP: apiData.abnormalASP || [],
          abnormalADP: apiData.abnormalADP || [],
        });
      } catch (err) {
        console.log("Error fetching data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    // Get the number of data points
    const numPoints = data.normalASP.length;
    if (numPoints === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    // Generate angles based on number of data points
    const angles = Array(numPoints)
      .fill(0)
      .map((_, i) => (i * 360) / numPoints);

    // Setup dimensions
    const width = 200;
    const height = 200;
    const margin = 0;
    const radius = Math.min(width, height) / 2 - margin;

    // Create SVG
    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    // Create scales
    const angleScale = d3
      .scaleLinear()
      .domain([0, 360])
      .range([0, 2 * Math.PI]);

    const radiusScale = d3.scaleLinear().domain([0, 200]).range([50, radius]);

    // Create line generator
    const lineGenerator = d3
      .lineRadial<[number, number]>()
      .angle((d) => angleScale(d[0]))
      .radius((d) => radiusScale(d[1]));

    // Create data points
    const normalASPPoints = angles.map(
      (angle, i) => [angle, data.normalASP[i]] as [number, number]
    );
    const normalADPPoints = angles.map(
      (angle, i) => [angle, data.normalADP[i]] as [number, number]
    );
    const abnormalASPPoints = angles.map(
      (angle, i) => [angle, data.abnormalASP[i]] as [number, number]
    );
    const abnormalADPPoints = angles.map(
      (angle, i) => [angle, data.abnormalADP[i]] as [number, number]
    );

    // Draw grid circles and labels
    const gridValues = [0, 180];
    gridValues.forEach((value) => {
      svg
        .append("circle")
        .attr("r", radiusScale(value))
        .attr("fill", "none")
        .attr("font-weight", "bold")
        .attr("stroke", "#D3D3D3");

      svg
        .append("text")
        .attr("y", -radiusScale(value))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("font-weight", "bold")
        .text(value.toString());

      svg
        .append("text")
        .attr("y", radiusScale(value))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .attr("font-weight", "bold")
        .text(value.toString());
    });

    // Calculate and draw angle lines based on number of points
    const angless = [0, 90, 180, 270];

    angless.forEach((angle, index) => {
      const radians = (angle * Math.PI) / 180;
      const x1 = index % 2 === 0 ? 0 : angle === 90 ? 50 : -50;
      const y1 = index % 2 === 0 ? (angle === 0 ? -50 : 50) : 0;
      const x2 = radius * 0.95 * Math.cos(radians - Math.PI / 2);
      const y2 = radius * 0.95 * Math.sin(radians - Math.PI / 2);

      svg
        .append("line")
        .attr("x1", x1)
        .attr("y1", y1)
        .attr("x2", x2)
        .attr("y2", y2)
        .attr("stroke", "#D3D3D3");
    });

    const anglesss = [20, 110, 200, 290];
    const labels = ["00", "06", "12", "18"];

    anglesss.forEach((angle, index) => {
      const radians = (angle * Math.PI) / 180;
      const x = 40 * Math.cos(radians - Math.PI / 2);
      const y = 40 * Math.sin(radians - Math.PI / 2);

      svg
        .append("text")
        .attr("x", x)
        .attr("y", y)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("transform", `rotate(${angle}, ${x}, ${y})`)
        .attr("font-size", "12px")
        .attr("font-weight", "bold")
        .attr("fill", "black")
        .text(labels[index]);
    });

    // Create area generators
    const areaHighASP = d3
      .areaRadial<[number, number]>()
      .angle((d) => angleScale(d[0]))
      .innerRadius((d, i) => radiusScale(data.normalASP[i]))
      .outerRadius((d, i) =>
        data.abnormalASP[i] > data.normalASP[i]
          ? radiusScale(data.abnormalASP[i])
          : radiusScale(data.normalASP[i])
      );

    const areaLowASP = d3
      .areaRadial<[number, number]>()
      .angle((d) => angleScale(d[0]))
      .innerRadius((d, i) =>
        data.abnormalASP[i] < data.normalASP[i]
          ? radiusScale(data.abnormalASP[i])
          : radiusScale(data.normalASP[i])
      )
      .outerRadius((d, i) => radiusScale(data.normalASP[i]));

    const areaHighADP = d3
      .areaRadial<[number, number]>()
      .angle((d) => angleScale(d[0]))
      .innerRadius((d, i) => radiusScale(data.normalADP[i]))
      .outerRadius((d, i) =>
        data.abnormalADP[i] > data.normalADP[i]
          ? radiusScale(data.abnormalADP[i])
          : radiusScale(data.normalADP[i])
      );

    const areaLowADP = d3
      .areaRadial<[number, number]>()
      .angle((d) => angleScale(d[0]))
      .innerRadius((d, i) =>
        data.abnormalADP[i] < data.normalADP[i]
          ? radiusScale(data.abnormalADP[i])
          : radiusScale(data.normalADP[i])
      )
      .outerRadius((d, i) => radiusScale(data.normalADP[i]));

    // Draw the areas
    svg
      .append("path")
      .datum(angles.map((angle) => [angle, 0] as [number, number]))
      .attr("fill", "rgba(0, 255, 0, 0.3)")
      .attr("d", areaLowASP);

    svg
      .append("path")
      .datum(angles.map((angle) => [angle, 0] as [number, number]))
      .attr("fill", "rgba(0, 255, 0, 0.3)")
      .attr("d", areaLowADP);

    svg
      .append("path")
      .datum(angles.map((angle) => [angle, 0] as [number, number]))
      .attr("fill", "rgba(255, 0, 0, 0.3)")
      .attr("d", areaHighASP);

    svg
      .append("path")
      .datum(angles.map((angle) => [angle, 0] as [number, number]))
      .attr("fill", "rgba(0, 0, 255, 0.3)")
      .attr("d", areaHighADP);

    // Draw lines
    svg
      .append("path")
      .datum(normalASPPoints)
      .attr("fill", "none")
      .attr("stroke", "green")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator);

    svg
      .append("path")
      .datum(normalADPPoints)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator);

    svg
      .append("path")
      .datum(abnormalASPPoints)
      .attr("fill", "none")
      .attr("stroke", "red")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator);

    svg
      .append("path")
      .datum(abnormalADPPoints)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 1)
      .attr("d", lineGenerator);
  }, [data]);

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto ">
      <svg ref={svgRef} />
    </div>
  );
}
