/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Sidebar } from "@/components/sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { D3InspectionGraph } from "@/components/d3-inspection-graph";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import Link from "next/link";
import BloodPressureChart from "@/components/radar-chart";

export default function Home() {
  const [inspections, setInspections] = useState<any[]>([]);
  const [activeInspection, setActiveInspection] = useState<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch data from API
    const fetchInspections = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          "https://germany-medical.vercel.app/first-page-data"
        );
        const data = await response.json();
        setInspections(data);
        if (data.length > 0) {
          setActiveInspection(data[0]); // Set the first inspection as active
        }
      } catch (error) {
        console.error("Error fetching inspections:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInspections();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-12 sm:pl-16 lg:pr-[340px] transition-all duration-300">
        <div className="p-1 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              {isLoading ? (
                <LoadingSkeleton />
              ) : (
                <>
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

                          <BloodPressureChart number={inspection.number} />
                        </div>

                        {
                          <Link
                            href={`/inspection/${inspection.number}`}
                            className={cn(
                              "border-color bg-[rgb(168,230,243,.19)] px-6 py-2 text-center rounded-lg font-normal text-[16px] sm:text-[19px]",
                              activeInspection.number === inspection.number
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          >
                            Show Details
                          </Link>
                        }
                      </div>
                    ))}
                  </div>
                </>
              )}

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
