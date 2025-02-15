// "use client";

// import { useEffect, useRef } from "react";
// import * as d3 from "d3";

// const NORMAL_ASP = 120;
// const NORMAL_ADP = 80;
// const DATA_POINTS = 40;

// // Utility functions
// function generateConstantValues(value: number, count: number) {
//   return Array(count).fill(value);
// }

// function generateRandomValuesWithMean(mean: number, count: number) {
//   return Array(count)
//     .fill(0)
//     .map(() => mean + (Math.random() - 0.5) * 30);
// }

// function generateAngles(count: number) {
//   return Array(count)
//     .fill(0)
//     .map((_, i) => (i * 360) / count);
// }

// export default function BloodPressureChart() {
//   const svgRef = useRef<SVGSVGElement>(null);

//   useEffect(() => {
//     if (!svgRef.current) return;

//     // Clear previous content
//     d3.select(svgRef.current).selectAll("*").remove();

//     // Generate data
//     const angles = generateAngles(DATA_POINTS);
//     const normalASP = generateConstantValues(NORMAL_ASP, DATA_POINTS);
//     const normalADP = generateConstantValues(NORMAL_ADP, DATA_POINTS);
//     const anormalASP = generateRandomValuesWithMean(NORMAL_ASP, DATA_POINTS);
//     const anormalADP = generateRandomValuesWithMean(NORMAL_ADP, DATA_POINTS);

//     // Setup dimensions
//     const width = 600;
//     const height = 600;
//     const margin = 50;
//     const radius = Math.min(width, height) / 2 - margin;

//     // Create SVG
//     const svg = d3
//       .select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .append("g")
//       .attr("transform", `translate(${width / 2},${height / 2})`);

//     // Create scales
//     const angleScale = d3
//       .scaleLinear()
//       .domain([0, 360])
//       .range([0, 2 * Math.PI]);

//     const radiusScale = d3.scaleLinear().domain([0, 200]).range([0, radius]);

//     // Create line generator
//     const lineGenerator = d3
//       .lineRadial<[number, number]>()
//       .angle((d) => angleScale(d[0]))
//       .radius((d) => radiusScale(d[1]));

//     // Create data points
//     const normalASPPoints = angles.map(
//       (angle, i) => [angle, normalASP[i]] as [number, number]
//     );
//     const normalADPPoints = angles.map(
//       (angle, i) => [angle, normalADP[i]] as [number, number]
//     );
//     const anormalASPPoints = angles.map(
//       (angle, i) => [angle, anormalASP[i]] as [number, number]
//     );
//     const anormalADPPoints = angles.map(
//       (angle, i) => [angle, anormalADP[i]] as [number, number]
//     );

//     // Draw grid circles and labels
//     const gridValues = [0, 40, 80, 120, 160, 200];
//     gridValues.forEach((value) => {
//       svg
//         .append("circle")
//         .attr("r", radiusScale(value))
//         .attr("fill", "none")
//         .attr("stroke", "#ddd")
//         .attr("stroke-dasharray", "2,2");

//       svg
//         .append("text")
//         .attr("y", -radiusScale(value))
//         .attr("dy", "0.35em")
//         .attr("text-anchor", "middle")
//         .style("font-size", "10px")
//         .text(value.toString());
//     });

//     // Draw angle lines
//     const angleLines = [0, 45, 90, 135, 180, 225, 270, 315];
//     angleLines.forEach((angle) => {
//       const radians = (angle * Math.PI) / 180;
//       svg
//         .append("line")
//         .attr("x1", 0)
//         .attr("y1", 0)
//         .attr("x2", radius * Math.cos(radians - Math.PI / 2))
//         .attr("y2", radius * Math.sin(radians - Math.PI / 2))
//         .attr("stroke", "#ddd")
//         .attr("stroke-dasharray", "2,2");

//       if (angle % 90 === 0) {
//         svg
//           .append("text")
//           .attr("x", (radius + 20) * Math.cos(radians - Math.PI / 2))
//           .attr("y", (radius + 20) * Math.sin(radians - Math.PI / 2))
//           .attr("text-anchor", "middle")
//           .attr("dominant-baseline", "middle")
//           .style("font-size", "12px")
//           .text(angle.toString());
//       }
//     });

//     // Create area generators for variations
//     // Red area: When abnormal ASP > normal ASP
//     const areaHighASP = d3
//       .areaRadial<[number, number]>()
//       .angle((d) => angleScale(d[0]))
//       .innerRadius((d, i) => radiusScale(normalASP[i]))
//       .outerRadius((d, i) =>
//         anormalASP[i] > normalASP[i]
//           ? radiusScale(anormalASP[i])
//           : radiusScale(normalASP[i])
//       );

//     // Green area: When normal ASP > abnormal ASP
//     const areaLowASP = d3
//       .areaRadial<[number, number]>()
//       .angle((d) => angleScale(d[0]))
//       .innerRadius((d, i) =>
//         anormalASP[i] < normalASP[i]
//           ? radiusScale(anormalASP[i])
//           : radiusScale(normalASP[i])
//       )
//       .outerRadius((d, i) => radiusScale(normalASP[i]));

//     // Blue area: When abnormal ADP > normal ADP
//     const areaHighADP = d3
//       .areaRadial<[number, number]>()
//       .angle((d) => angleScale(d[0]))
//       .innerRadius((d, i) => radiusScale(normalADP[i]))
//       .outerRadius((d, i) =>
//         anormalADP[i] > normalADP[i]
//           ? radiusScale(anormalADP[i])
//           : radiusScale(normalADP[i])
//       );

//     // Green area: When normal ADP > abnormal ADP
//     const areaLowADP = d3
//       .areaRadial<[number, number]>()
//       .angle((d) => angleScale(d[0]))
//       .innerRadius((d, i) =>
//         anormalADP[i] < normalADP[i]
//           ? radiusScale(anormalADP[i])
//           : radiusScale(normalADP[i])
//       )
//       .outerRadius((d, i) => radiusScale(normalADP[i]));

//     // Draw the areas
//     // Green areas
//     svg
//       .append("path")
//       .datum(angles.map((angle) => [angle, 0] as [number, number]))
//       .attr("fill", "rgba(0, 255, 0, 0.3)")
//       .attr("d", areaLowASP);

//     svg
//       .append("path")
//       .datum(angles.map((angle) => [angle, 0] as [number, number]))
//       .attr("fill", "rgba(0, 255, 0, 0.3)")
//       .attr("d", areaLowADP);

//     // Red area for high ASP
//     svg
//       .append("path")
//       .datum(angles.map((angle) => [angle, 0] as [number, number]))
//       .attr("fill", "rgba(255, 0, 0, 0.3)")
//       .attr("d", areaHighASP);

//     // Blue area for high ADP
//     svg
//       .append("path")
//       .datum(angles.map((angle) => [angle, 0] as [number, number]))
//       .attr("fill", "rgba(0, 0, 255, 0.3)")
//       .attr("d", areaHighADP);

//     // Draw lines
//     svg
//       .append("path")
//       .datum(normalASPPoints)
//       .attr("fill", "none")
//       .attr("stroke", "green")
//       .attr("stroke-width", 2)
//       .attr("d", lineGenerator);

//     svg
//       .append("path")
//       .datum(normalADPPoints)
//       .attr("fill", "none")
//       .attr("stroke", "blue")
//       .attr("stroke-width", 2)
//       .attr("d", lineGenerator);

//     svg
//       .append("path")
//       .datum(anormalASPPoints)
//       .attr("fill", "none")
//       .attr("stroke", "red")
//       .attr("stroke-width", 2)
//       .attr("d", lineGenerator);

//     svg
//       .append("path")
//       .datum(anormalADPPoints)
//       .attr("fill", "none")
//       .attr("stroke", "lightblue")
//       .attr("stroke-width", 2)
//       .attr("d", lineGenerator);
//   }, []);

//   return (
//     <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
//       <svg ref={svgRef} className="w-full h-auto" />
//     </div>
//   );
// }

"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

type BloodPressureData = {
  normalASP: number[];
  normalADP: number[];
  abnormalASP: number[];
  abnormalADP: number[];
};

export default function BloodPressureChart() {
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
          "https://germany-medical.vercel.app/compare-radar/2"
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const newData = await response.json();
        const apiData = newData;

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
    const width = 600;
    const height = 600;
    const margin = 50;
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

    const radiusScale = d3.scaleLinear().domain([0, 500]).range([0, radius]);

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
        .attr("stroke", "#D3D3D3");

      svg
        .append("text")
        .attr("y", -radiusScale(value))
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(value.toString());
    });

    // Calculate and draw angle lines based on number of points
    [0, 90, 180, 270].forEach((angle) => {
      const radians = (angle * Math.PI) / 180;
      svg
        .append("line")
        .attr("x1", 0)
        .attr("y1", 0)
        .attr("x2", radius * 0.36 * Math.cos(radians - Math.PI / 2))
        .attr("y2", radius * 0.36 * Math.sin(radians - Math.PI / 2))
        .attr("stroke", "#D3D3D3");

      // Add labels for cardinal points
      if (angle % 90 === 0) {
        svg
          .append("text")
          .attr("x", (radius * 0.36 + 20) * Math.cos(radians - Math.PI / 2))
          .attr("y", (radius * 0.36 + 20) * Math.sin(radians - Math.PI / 2))
          .attr("text-anchor", "middle")
          .attr("dominant-baseline", "middle")
          .style("font-size", "12px")
          .text(angle.toString());
      }
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
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4">
      <svg ref={svgRef} className="w-full h-auto" />
    </div>
  );
}
