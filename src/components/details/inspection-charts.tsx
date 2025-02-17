"use client";

import { useEffect, useState } from "react";
import Loader from "../loader";
import { D3InspectionGraph } from "../d3-inspection-graph";
import BloodPressureChart from "../radar-chart";
import ComparisonRadar from "./comparison-radar";

interface InspectionData {
  age: string;
  height: string;
  date: string;
  data: Array<{
    hour: number;
    asp: number;
    adp: number;
    map: number;
  }>;
}

export default function InspectionCharts({ id }: { id: string }) {
  const [data1, setData1] = useState<any>();
  const [data2, setData2] = useState<any>();
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
          setData1(inspectionData[0]);
          if (inspectionData.length > 1) {
            setData2(inspectionData[1]);
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
    <div className="flex flex-col sm:flex-row gap-4 p-4">
      {/* First Inspection */}
      {data1 && (
        <div className="flex-1 bg-white rounded-lg  p-4">
          <div className="text-center mb-4">
            <h3 className="text-[24px] font-bold mb-1">Inspection {id}</h3>
            <p className="text-[19px] text-black mb-1">{data1.date}</p>
            <p className="text-[19px] text-black">
              {data1.age}, {data1.height}
            </p>
          </div>

          <div className="flex flex-col justify-center gap-1 text-center text-sm mb-4">
            <div className="flex  justify-center align-middle gap-2">
              <div className="w-2 h-2 mt-[5px] rounded-full bg-[#FF4D4D]"></div>
              <span className="text-[14px]">ASP {">"} Healthy ASP</span>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 mt-[5px] rounded-full bg-[#ADD8E6]"></div>
              <span className="text-[14px]">DBP {">"} Healthy ADP</span>
            </div>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 mt-[5px] rounded-full bg-[#90EE90]"></div>
              <span className="text-[14px]">Healthy ASP/ADP {">"} ASP/SDP</span>
            </div>
          </div>

          <BloodPressureChart number={Number(id)} />
        </div>
      )}
      {!data1 && (
        <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-center mb-6 h-[100px]">
          <p>No data found for Inspection</p>
        </div>
      )}
      {/* Difference Chart */}
      {data2 && (
        <div className="flex-1 bg-white rounded-lg p-4">
          <div className="text-center mb-4">
            <h3 className="text-[24px] font-bold mb-1">
              Difference to Inspection {+id - 1}
            </h3>
            <p className="text-[19px] text-black">
              {data2.date} | {data1.date}
            </p>
            <p className="text-[19px] text-black">
              {data1.age} | {data2.age}, {data1.height} | {data2.height}
            </p>
          </div>

          <div className="flex flex-col gap-1 justify-center items-center text-sm mb-4">
            <div className="flex justify-center gap-2">
              <span className="text-[14px]">
                <div className="w-2 h-2 rounded-full bg-[#FF4D4D] inline-block "></div>{" "}
                ASP/{" "}
                <div className="w-2 h-2 rounded-full bg-[#4343FF] inline-block "></div>{" "}
                ADP Visit 5 {">"} Visit 4 ASP/ADP
              </span>
            </div>
            <div className="flex justify-center gap-2">
              <span className="text-[14px]">
                <div className="w-2 h-2 rounded-full bg-[#FF8A8A] inline-block "></div>{" "}
                ASP/{" "}
                <div className="w-2 h-2 rounded-full bg-[#CCCCFF] inline-block "></div>{" "}
                ADP Visit 4 {">"} Visit 5 ASP/ADP
              </span>
            </div>
          </div>

          <ComparisonRadar number={Number(id)} />
        </div>
      )}{" "}
      {!data2 && (
        <div className="p-2 bg-red-100  text-red-700 rounded-md text-center mb-6 h-[100px]  ">
          <p>No data found for this Inspection</p>
        </div>
      )}
    </div>
  );
}
