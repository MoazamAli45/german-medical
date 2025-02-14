/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Sidebar } from "@/components/sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { D3InspectionGraph } from "@/components/d3-inspection-graph";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Sample data for the graphs
const generateSampleData = () => {
  const data = [];
  for (let i = 0; i < 24; i++) {
    data.push({
      hour: i,
      asp: Math.random() * 60 + 100, // Random ASP between 100 and 160
      adp: Math.random() * 40 + 60, // Random ADP between 60 and 100
      map: Math.random() * 50 + 70, // Random MAP between 70 and 120
    });
  }
  return data;
};

// Generate random AP Mean and AP Load data
const generateRandomAPData = () => {
  return {
    apMean: {
      asp: {
        day: Math.floor(Math.random() * 20 + 100),
        night: Math.floor(Math.random() * 20 + 95),
        overall: Math.floor(Math.random() * 20 + 105),
      },
      adp: {
        day: Math.floor(Math.random() * 15 + 50),
        night: Math.floor(Math.random() * 15 + 45),
        overall: Math.floor(Math.random() * 15 + 55),
      },
    },
    apLoad: {
      asp: {
        day: `${Math.floor(Math.random() * 20 + 80)}%`,
        night: `${Math.floor(Math.random() * 20 + 75)}%`,
        overall: `${Math.floor(Math.random() * 10 + 90)}%`,
      },
      adp: {
        day: `${Math.floor(Math.random() * 20 + 80)}%`,
        night: `${Math.floor(Math.random() * 20 + 75)}%`,
        overall: `${Math.floor(Math.random() * 10 + 90)}%`,
      },
    },
  };
};

const inspections = [
  {
    number: 5,
    date: "01.02.2011",
    age: "14y",
    height: "159cm",
    data: generateSampleData(),
    ...generateRandomAPData(),
    medications: [
      { name: "Amlodipine", dose: "1x10mg" },
      { name: "Metoprolol", dose: "1x100mg" },
      { name: "Hydrochlor", dose: "1x25mg" },
      { name: "Ramipril", dose: "1x5mg" },
    ],
  },
  {
    number: 4,
    date: "11.12.2010",
    age: "11y",
    height: "129cm",
    data: generateSampleData(),
    ...generateRandomAPData(),
    medications: [
      { name: "Amlodipine", dose: "1x5mg" },
      { name: "Metoprolol", dose: "1x50mg" },
    ],
  },
  {
    number: 3,
    date: "05.01.2010",
    age: "11y",
    height: "128cm",
    data: generateSampleData(),
    ...generateRandomAPData(),
    medications: [{ name: "Amlodipine", dose: "1x5mg" }],
  },
  {
    number: 1,
    date: "19.11.2009",
    age: "10.9y",
    height: "158cm",
    data: generateSampleData(),
    ...generateRandomAPData(),
    medications: [
      { name: "Amlodipine", dose: "1x10mg" },
      { name: "Metoprolol", dose: "1x100mg" },
      { name: "Hydrochlor", dose: "1x25mg" },
    ],
  },
];

export default function Home() {
  const [activeInspection, setActiveInspection] = useState(inspections[0]);

  useEffect(() => {
    // Set the first inspection as active by default
    setActiveInspection(inspections[0]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-12 sm:pl-16 lg:pr-[340px] transition-all duration-300">
        <div className="p-1 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <span className="border-[1px] border-solid border-gray py-1 px-2 text-[16px] sm:text-[19px]">
                  ID: 345287, Max Mustermann,
                  <span className="text-[18px] ">♂</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 py-2 max-w-5xl">
                {inspections.map((inspection) => (
                  <div
                    key={inspection.number}
                    className=" flex flex-col gap-2 group"
                  >
                    <div
                      className={`bg-gray-50 rounded-lg p-4 relative transition-all duration-300  border-[1px] border-solid cursor-pointer ${
                        activeInspection.number === inspection.number
                          ? "border-[#88B1EF] bg-[rgb(168,230,243,.19)] shadow-md"
                          : "border-[rgb(168,230,243,.19)] hover:border-[#88B1EF] hover:bg-[rgb(168,230,243,.19)] hover:shadow-md"
                      }`}
                      onClick={() => setActiveInspection(inspection)}
                    >
                      <div className="flex flex-col items-center ">
                        <h2 className="font-bold text-[18px] sm:text-[24px]">
                          Inspection {inspection.number}
                        </h2>
                        <span className="text-[16px] sm:text-[19px] text-black">
                          {inspection.date}
                        </span>
                      </div>
                      <div className="text-[16px] sm:text-[19px] text-black mb-4 text-center">
                        {inspection.age}, {inspection.height}
                      </div>
                      <D3InspectionGraph data={inspection.data} />
                    </div>
                    {
                      <button
                        className={cn(
                          "border-color bg-[rgb(168,230,243,.19)] px-6 py-2 rounded-lg font-normal text-[16px] sm:text-[19px]",
                          activeInspection.number === inspection.number
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      >
                        Show Details
                      </button>
                    }
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex flex-col items-start sm:flex-row sm:items-center  gap-6 justify-center">
                {[
                  { color: "bg-red-500", label: "Abnormal ASP > Refenc ASP" },
                  { color: "bg-blue-500", label: "Abnormal ADP > Refenc ADP" },
                  {
                    color: "bg-green-500",
                    label: "Refence ASP/ADP > Abnormal ASP/ADP",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex  justify-center  items-center gap-2"
                  >
                    <div
                      className={`w-3 h-3 lg:w-4 lg:h-4 rounded-full ${item.color} shrink-0`}
                    />
                    <span className="text-[14px] text-gray-600">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <RightSidebar inspection={activeInspection} />
    </div>
  );
}
