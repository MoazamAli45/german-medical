"use client";

import { useEffect, useState } from "react";
import { D3InspectionGraph } from "./inspection-graph";

interface InspectionData {
  data: {
    hour: number;
    asp: number;
    adp: number;
    map: number;
  }[];
}

export default function InspectionCharts({ id }: { id: string }) {
  const [data, setData] = useState<InspectionData["data"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://germany-medical.vercel.app/second-page-data/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const inspectionData = await response.json();
        // Use the first inspection's data
        setData(
          inspectionData[0].data.map((item: any) => ({
            ...item,
            // Normalize hours to 0-24 range
            hour: item.hour % 24,
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-lg font-semibold mb-4">
        Blood Pressure Inspection Graph
      </h2>
      <D3InspectionGraph data={data} />
      <div className="mt-4 flex gap-4 justify-center text-sm">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span>ASP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          <span>ADP</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
          <span>MAP</span>
        </div>
      </div>
    </div>
  );
}
