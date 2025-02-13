/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Sun from "@/icons/icon-1.svg";
import Moon from "@/icons/icon-2.svg";
import Star from "@/icons/icon-3.svg";

export function RightSidebar({ inspection }: any) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 990) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call once to set initial state

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!inspection) {
    return null;
  }

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
      <div
        className={`fixed right-0 top-0 h-full w-[300px] bg-white p-4 overflow-y-auto border-gray-200 scrollbar-hide transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Inspection Header */}
        <div className="mb-6 px-3 py-[4px] text-center !rounded-full bg-[rgb(168,230,243,.19)] border-[1px] border-solid border-[#88B1EF]">
          <h2 className="text-[24px] font-bold leading-tight">
            Inspection {inspection.number}
          </h2>
          <p className="text-[19px] text-black font-normal leading-tight">
            {inspection.age}, {inspection.height}
          </p>
        </div>

        {/* AP Mean Section */}
        <div className="mb-6 !rounded-xl  border-[1px] border-solid border-[#AEADAD]">
          <h2 className="text-[24px] font-bold text-center mb-4">AP Mean</h2>
          <div className="space-y-3">
            {[
              {
                time: "Mean ASP",
                value: inspection.apMean.asp.day,
                icon: (
                  <Image
                    src={Sun || "/placeholder.svg"}
                    alt="Sun"
                    className="h-7 w-12"
                  />
                ),
                adp: inspection.apMean.adp.day,
              },
              {
                time: "Mean ASP",
                value: inspection.apMean.asp.overall,
                icon: (
                  <Image
                    src={Star || "/placeholder.svg"}
                    alt="Star"
                    className="h-[18px] w-[18px]"
                  />
                ),
                adp: inspection.apMean.adp.overall,
              },
              {
                time: "Mean ASP",
                value: inspection.apMean.asp.night,
                icon: (
                  <Image
                    src={Moon || "/placeholder.svg"}
                    alt="Moon"
                    className="h-[18px] w-[18px]"
                  />
                ),
                adp: inspection.apMean.adp.night,
              },
            ].map((reading, index) => (
              <div
                key={index}
                className="flex justify-between gap-1 items-center bg-gray-50 rounded-[25px] p-3"
              >
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex flex-col items-center justify-center p-2 w-[90px] !rounded-xl  border-[1px] border-solid border-gray">
                    <div className="flex gap-1 items-center">
                      <span className="text-lg font-semibold">
                        {reading.value}
                      </span>
                      <span className="text-xs text-gray-500">mmHg</span>
                    </div>

                    <span className="text-sm text-gray-600">
                      {reading.time}
                    </span>
                  </div>
                </div>
                <div>{reading.icon}</div>
                <div className="flex flex-col items-center shrink-0 p-2 !rounded-xl border-[1px] border-solid border-gray">
                  <span className="text-sm text-gray-600">Mean ADP</span>
                  <span className="text-lg font-semibold">{reading.adp}</span>
                  <span className="text-xs text-gray-500">mmHg</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AP Load Section */}
        <div className="w-full max-w-2xl px-6 pb-4 rounded-3xl border border-[#AEADAD] bg-white">
          <h2 className="text-lg font-semibold mb-3 text-center">AP Load</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
              <div className="text-sm font-bold text-center">ASP</div>
              <div className="text-sm font-bold text-center"></div>
              <div className="text-sm font-bold text-center">ADP</div>
            </div>

            {[
              {
                asp: inspection.apLoad.asp.day,
                adp: inspection.apLoad.adp.day,
                icon: (
                  <Image
                    src={Sun || "/placeholder.svg"}
                    alt="Sun"
                    className="h-8 w-12"
                  />
                ),
              },
              {
                asp: inspection.apLoad.asp.overall,
                adp: inspection.apLoad.adp.overall,
                icon: (
                  <Image
                    src={Star || "/placeholder.svg"}
                    alt="Star"
                    className="h-[18px] w-[18px]"
                  />
                ),
              },
              {
                asp: inspection.apLoad.asp.night,
                adp: inspection.apLoad.adp.night,
                icon: (
                  <Image
                    src={Moon || "/placeholder.svg"}
                    alt="Moon"
                    className="h-[18px] w-[18px]"
                  />
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr] gap-4 items-center"
              >
                {/* ASP Bar */}
                <div className="flex items-center shrink-0">
                  <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                    <div
                      className="h-full bg-[#B0D5BC] transition-all duration-500 relative"
                      style={{ width: item.asp }}
                    >
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 font-semibold text-black text-sm">
                        {item.asp}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Icon */}
                <div className="flex items-center justify-center bg-gray-100 rounded-md">
                  {item.icon}
                </div>

                {/* ADP Bar */}
                <div className="flex items-center shrink-0">
                  <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                    <div
                      className="h-full bg-[#B0D5BC] transition-all duration-500 relative"
                      style={{ width: item.adp }}
                    >
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 font-semibold text-black text-sm">
                        {item.adp}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medications Section */}
        <div className="rounded-3xl border border-[#AEADAD] my-4 bg-white">
          <h2 className="text-lg font-semibold text-center">Medications</h2>
          <div className="space-y-2">
            {inspection.medications.map((med: any) => (
              <div
                key={med.name}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
              >
                <span className="font-medium">{med.name}</span>
                <span className="text-sm text-gray-600">{med.dose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
