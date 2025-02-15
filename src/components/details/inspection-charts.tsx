"use client";

import { useEffect, useState } from "react";
import { D3InspectionGraph } from "./inspection-graph";
import Loader from "../loader";

interface InspectionData {
  hour: number;
  asp: number;
  adp: number;
  map: number;
}

export default function InspectionCharts({ id }: { id: string }) {
  const [data1, setData1] = useState<InspectionData[]>([]);
  const [data2, setData2] = useState<InspectionData[]>([]);
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

        if (inspectionData.length > 0) {
          setData1(
            inspectionData[0].data.map((item: any) => ({
              ...item,
              hour: item.hour % 24, // Normalize hours to 0-24 range
            }))
          );

          if (inspectionData.length > 1) {
            setData2(
              inspectionData[1].data.map((item: any) => ({
                ...item,
                hour: item.hour % 24,
              }))
            );
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-2 md:p-4">
      <div className="flex gap-1 items-center  sm:flex-row flex-col">
        {/* First Dataset */}
        {data1.length > 0 ? (
          <div className="mb-6">
            <h3 className="text-[18px] text-center font-bold  ">
              Inspection {id}
            </h3>
            <D3InspectionGraph data={data1} />
          </div>
        ) : (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center mb-6">
            <p>No data found for Inspection</p>
          </div>
        )}

        {/* Second Dataset */}
        {data2.length > 0 ? (
          <div>
            <h3 className="text-[18px] font-bold">
              Difference to Inspection {+id - 1}
            </h3>
            <D3InspectionGraph data={data2} />
          </div>
        ) : (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            <p>No data found for Inspection</p>
          </div>
        )}
      </div>
    </div>
  );
}
