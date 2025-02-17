"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ArrowDown, ArrowUp } from "lucide-react";
import Sun from "@/icons/icon-1.svg";
import Moon from "@/icons/icon-2.svg";
import Star from "@/icons/icon-3.svg";
import Loader from "../loader";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface InspectionData {
  number: number;
  age: string;
  height: string;
  apMean: {
    asp: { day: number; night: number; overall: number };
    adp: { day: number; night: number; overall: number };
  };
  apLoad: {
    asp: { day: number; night: number; overall: number };
    adp: { day: number; night: number; overall: number };
  };
  medications: Array<{ name: string; dose: string }>;
  date: string;
}

export function RightSidebar({ id }: { id: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [inspectionData, setInspectionData] = useState<InspectionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://germany-medical.vercel.app/second-page-data/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setInspectionData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed right-0 top-0 flex h-full w-[300px] items-center justify-center bg-white p-4 sm:w-[360px]">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed right-0 top-0 flex h-full w-[300px] items-center justify-center bg-white p-4 sm:w-[360px]">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  const currentInspection = inspectionData[0];
  const previousInspection = inspectionData[1];

  if (!currentInspection) {
    return (
      <div className="fixed right-0 top-0 flex h-full w-[300px] items-center justify-center bg-white p-4 sm:w-[360px]">
        <p className="text-center">No inspection data found</p>
      </div>
    );
  }

  const getComparisonIndicator = (current: number, previous?: number) => {
    if (!previous) return null;
    const diff = current - previous;
    if (diff > 0) {
      return <ArrowUp className="h-4 w-4 text-black" />;
    } else if (diff < 0) {
      return <ArrowDown className="h-4 w-4 text-black" />;
    }
    return null;
  };

  return (
    <>
      <button
        className="fixed right-4 top-4 z-50 rounded-full bg-black p-2 text-white shadow-lg lg:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        )}
      </button>
      {isLoading ? (
        <div
          className={`absolute right-0 top-0 h-full w-[300px] sm:w-[360px] bg-white p-4 overflow-y-auto border-gray-200 scrollbar-hide transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
        >
          <Loader />
        </div>
      ) : (
        <div
          className={`fixed lg:absolute right-0 top-0 h-full w-[300px] sm:w-[360px] bg-white p-4  border-gray-200 overflow-auto lg:overflow-visible scrollbar-hide transition-transform duration-300 ease-in-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          } lg:translate-x-0`}
        >
          {/* Inspection Header */}
          <div className="mb-6 px-3 py-[4px] text-center !rounded-full bg-[rgba(168,230,243,0.19)] border border-[rgb(82,86,231,.5)]">
            <h2 className="text-[20px] sm:text-[24px] font-bold leading-tight">
              Inspection {currentInspection.number}
            </h2>
            <p className="text-[16px] sm:text-[19px] text-black font-normal leading-tight">
              {currentInspection.age}
              {"->"}{" "}
              {previousInspection ? (
                previousInspection.age
              ) : (
                <span className="text-red-500">NaN</span>
              )}
              | {currentInspection.height}
              {"->"}{" "}
              {previousInspection ? (
                previousInspection?.height
              ) : (
                <span className="text-red-500">NaN</span>
              )}
            </p>
          </div>
          {/* AP Mean Section */}
          <div className="mb-6 !rounded-xl py-1  border-[1px] border-solid border-[#AEADAD]">
            <h2 className="text-[20px] sm:text-[24px] font-bold text-center mb-4">
              BP Mean
            </h2>
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[16px] sm:text-[19px] font-bold">
                Inspection {+id - 1 === 0 ? "NaN" : +id - 1}
              </h4>

              <h4 className="text-[16px] sm:text-[19px] font-bold">
                Inspection {id}
              </h4>
            </div>
            <div className="space-y-3 pt-2  pb-6">
              {[
                {
                  time: "ASP",
                  value: currentInspection.apMean.asp.overall,
                  prevValue: previousInspection?.apMean.asp.overall,
                  icon: Sun,
                  iconAlt: "Sun",
                  adp: currentInspection.apMean.adp.overall,
                  prevAdp: previousInspection?.apMean.adp.overall,
                },
                {
                  time: "ASP",
                  value: currentInspection.apMean.asp.day,
                  prevValue: previousInspection?.apMean.asp.day,
                  icon: Moon,
                  iconAlt: "Star",
                  adp: currentInspection.apMean.adp.day,
                  prevAdp: previousInspection?.apMean.adp.day,
                },
                {
                  time: "ASP",
                  value: currentInspection.apMean.asp.night,
                  prevValue: previousInspection?.apMean.asp.night,
                  icon: Star,
                  iconAlt: "Moon",
                  adp: currentInspection.apMean.adp.night,
                  prevAdp: previousInspection?.apMean.adp.night,
                },
              ].map((reading, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-1 px-1"
                >
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <div className="flex flex-col items-center justify-center p-1 w-[100px]  sm:w-[110px]  rounded-[25px]  border-[1px] border-solid border-gray">
                        <div className="flex gap-1 items-center">
                          <span className="text-[16px] sm:text-[19px] font-bold">
                            {reading.prevValue !== undefined ? (
                              reading.prevValue.toFixed(1)
                            ) : (
                              <span className="text-red-500 text-[14px]">
                                NaN
                              </span>
                            )}
                          </span>
                          <span className="text-[14px]">mmHg</span>
                        </div>
                        <span className="text-[16px] sm:text-[19px]  font-bold">
                          {reading.time}
                        </span>
                      </div>
                      <div className="flex flex-col items-center justify-center p-1 w-[100px]  sm:w-[110px]  rounded-[25px]  border-[1px] border-solid border-gray">
                        <div className="flex gap-1 items-center">
                          <span className="text-[16px] sm:text-[19px] font-bold">
                            {reading.prevAdp !== undefined ? (
                              reading.prevAdp.toFixed(1)
                            ) : (
                              <span className="text-red-500 text-[14px]">
                                NaN
                              </span>
                            )}
                          </span>
                          <span className="text-[14px]">mmHg</span>
                        </div>
                        <span className="text-[16px] sm:text-[19px]  font-bold">
                          ADP
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-[75px] flex items-center justify-center">
                    <Image
                      src={reading.icon}
                      alt={reading.iconAlt}
                      width={reading.iconAlt === "Sun" ? 70 : 25}
                      height={25}
                      className="h-[20px] w-auto sm:h-[25px] sm:w-auto"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1">
                    <div className="flex flex-col items-center justify-center shrink-0 p-1 rounded-[25px] w-[100px] sm:w-[110px] border-[1px] border-solid border-gray">
                      <div className="flex gap-1 items-center">
                        <span className="text-[16px] sm:text-[19px] font-bold">
                          {reading?.value !== undefined ? (
                            reading.value.toFixed(1)
                          ) : (
                            <span className="text-red-500 text-[14px]">
                              NaN
                            </span>
                          )}
                        </span>
                        <span className="text-[14px]">mmHg</span>
                      </div>
                      <span className="text-[16px] sm:text-[19px] font-bold flex items-center justify-center gap-1">
                        {reading.time}{" "}
                        {reading?.prevValue &&
                          getComparisonIndicator(
                            reading.value,
                            reading.prevValue
                          )}
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center shrink-0 p-1 rounded-[25px] w-[100px] sm:w-[110px] border-[1px] border-solid border-gray">
                      <div className="flex gap-1 items-center">
                        <span className="text-[16px] sm:text-[19px] font-bold">
                          {reading?.adp !== undefined ? (
                            reading.adp.toFixed(1)
                          ) : (
                            <span className="text-red-500 text-[14px]">
                              NaN
                            </span>
                          )}
                        </span>
                        <span className="text-[14px]">mmHg</span>
                      </div>
                      <span className="text-[16px] sm:text-[19px] font-bold flex items-center justify-center gap-1">
                        ADP{" "}
                        {reading?.prevAdp &&
                          getComparisonIndicator(reading.adp, reading.prevAdp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* AP Load Section */}
          <div className="w-full max-w-2xl px-6 pb-4 py-1 rounded-3xl border border-[#AEADAD] bg-white">
            <h2 className="text-[20px] sm:text-[24px] font-bold mb-3 text-center">
              BP Load
            </h2>
            <div className="flex items-center justify-between px-[6px] pb-4">
              <h4 className="text-[16px] sm:text-[19px] font-bold">
                Inspection {+id - 1 === 0 ? "NaN" : +id - 1}
              </h4>

              <h4 className="text-[16px] sm:text-[19px] font-bold">
                Inspection {id}
              </h4>
            </div>

            <div className="space-y-6">
              {[
                {
                  asp: currentInspection.apLoad.asp.overall,
                  prevAsp: previousInspection?.apLoad.asp.overall,
                  adp: currentInspection.apLoad.adp.overall,
                  prevAdp: previousInspection?.apLoad.adp.overall,
                  icon: Sun,
                  iconAlt: "Sun",
                },
                {
                  asp: currentInspection.apLoad.asp.day,
                  prevAsp: previousInspection?.apLoad.asp.day,
                  adp: currentInspection.apLoad.adp.day,
                  prevAdp: previousInspection?.apLoad.adp.day,
                  icon: Moon,
                  iconAlt: "Star",
                },
                {
                  asp: currentInspection.apLoad.asp.night,
                  prevAsp: previousInspection?.apLoad.asp.night,
                  adp: currentInspection.apLoad.adp.night,
                  prevAdp: previousInspection?.apLoad.adp.night,
                  icon: Star,
                  iconAlt: "Moon",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_1fr_1fr] gap-2  items-center"
                >
                  {/* Previous Bar */}
                  <div className="flex items-center  gap-1 shrink-0">
                    <div className="flex flex-col gap-1 items-center shrink-0">
                      <span className="text-[12px]  font-bold">ASP</span>
                      <span className="text-[12px] font-bold">ADP</span>
                    </div>
                    <div className="flex items-center flex-1 basis-[80%] flex-col gap-1 shrink-0">
                      <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 relative ${
                            item.prevAsp !== undefined
                              ? "bg-[#B0D5BC]"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${
                              item.prevAsp !== undefined
                                ? Math.abs(item.prevAsp).toFixed(1)
                                : 100
                            }%`,
                          }}
                        >
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-bold text-black text-[12px] sm:text-[14px]">
                            {item.prevAsp !== undefined
                              ? Math.abs(item.prevAsp).toFixed(1)
                              : "0"}
                          </span>
                        </div>
                      </div>
                      <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 relative ${
                            item.prevAdp !== undefined
                              ? "bg-[#B0D5BC]"
                              : "bg-red-500"
                          }`}
                          style={{
                            width: `${
                              item.prevAdp !== undefined
                                ? Math.abs(item.prevAdp).toFixed(1)
                                : 100
                            }%`,
                          }}
                        >
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-bold text-black text-[12px] sm:text-[14px]">
                            {item.prevAdp !== undefined
                              ? Math.abs(item.prevAdp).toFixed(1)
                              : "0"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Icon */}
                  <div className="flex items-center justify-center bg-gray-100 rounded-md">
                    <Image
                      src={item.icon || "/placeholder.svg"}
                      alt={item.iconAlt}
                      width={item.iconAlt === "Sun" ? 57 : 20}
                      height={20}
                      className="h-[18px] w-auto sm:h-[20px] sm:w-auto"
                    />
                  </div>
                  {/* Current Bar */}
                  <div className="flex items-center  gap-1 shrink-0">
                    <div className="flex flex-col gap-1 items-center shrink-0">
                      <span className="text-[12px]  font-bold">ASP</span>
                      <span className="text-[12px] font-bold">ADP</span>
                    </div>
                    <div className="flex flex-col flex-1 basis-[80%] gap-1 items-center shrink-0">
                      <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                        <div
                          className="h-full bg-[#B0D5BC] transition-all duration-500 relative"
                          style={{ width: `${Math.abs(item.asp).toFixed(1)}%` }}
                        >
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-bold text-black text-[12px] sm:text-[14px]">
                            {Math.abs(item.asp).toFixed(1)}
                          </span>
                        </div>
                      </div>

                      <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                        <div
                          className="h-full bg-[#B0D5BC] transition-all duration-500 relative"
                          style={{ width: `${Math.abs(item.adp).toFixed(1)}%` }}
                        >
                          <span className="absolute left-1 top-1/2 -translate-y-1/2 font-bold text-black text-[12px] sm:text-[14px]">
                            {Math.abs(item.adp).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Medications Section */}
          <div className="rounded-3xl border border-[#AEADAD] py-4 px-6 my-4 bg-white w-fit mx-auto">
            <h2 className="text-2xl font-bold text-center mb-4">Medications</h2>

            <div className="grid grid-cols-3 gap-4 text-center font-bold">
              <span className="text-lg"></span>
              <span className="text-[16px] sm:text-[19px]">
                Insp {+id - 1 === 0 ? "NaN" : +id - 1}
              </span>
              <span className="text-[16px] sm:text-[19px]">Insp {id}</span>
            </div>

            <div className="mt-2">
              {(() => {
                const currentMedications = currentInspection.medications || [];
                const previousMedications =
                  previousInspection?.medications || [];

                // Get all unique medication names
                const allMedicationNames = [
                  ...new Set([
                    ...currentMedications.map((med) => med.name),
                    ...previousMedications.map((med) => med.name),
                  ]),
                ];

                return allMedicationNames.map((medName) => {
                  const currentMed = currentMedications.find(
                    (med) => med.name === medName
                  );
                  const previousMed = previousMedications.find(
                    (med) => med.name === medName
                  );

                  return (
                    <div
                      key={medName}
                      className="grid grid-cols-3 gap-4 py-2  text-center"
                    >
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-bold text-[14px] cursor-pointer">
                              {medName.length > 15
                                ? `${medName.slice(0, 10)}...`
                                : medName}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>{medName}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>

                      <span className="text-[14px] font-semibold">
                        {previousMed?.dose || "NaN"}
                      </span>
                      <span className="text-[14px] font-semibold">
                        {currentMed?.dose || "NaN"}
                      </span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
