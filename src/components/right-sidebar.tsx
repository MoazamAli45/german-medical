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
        className={`fixed right-0 top-0 h-full w-[300px] sm:w-[360px] bg-white p-4 overflow-y-auto border-gray-200 scrollbar-hide transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Inspection Header */}
        <div className="mb-6 px-3 py-[4px] text-center !rounded-full bg-[rgb(168,230,243,.19)] border-[1px] border-solid border-[#88B1EF]">
          <h2 className="text-[20px] sm:text-[24px] font-bold leading-tight">
            Inspection {inspection.number}
          </h2>
          <p className="text-[16px] sm:text-[19px] text-black font-normal leading-tight">
            {inspection.age}, {inspection.height}
          </p>
        </div>

        {/* AP Mean Section */}
        <div className="mb-6 !rounded-xl py-1  border-[1px] border-solid border-[#AEADAD]">
          <h2 className="text-[20px] sm:text-[24px] font-bold text-center mb-4">
            AP Mean
          </h2>
          <div className="space-y-3 pt-2  pb-6">
            {[
              {
                time: "Mean ASP",
                value: inspection.apMean.asp.day,
                icon: (
                  <Image
                    src={Sun || "/placeholder.svg"}
                    alt="Sun"
                    className="h-[20px] w-[60px] sm:h-[25px] sm:w-[70px]"
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
                    className="h-[20px] w-[20px] sm:h-[25px] sm:w-[25px]"
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
                    className="h-[20px] w-[20px] sm:h-[25px] sm:w-[25px]"
                  />
                ),
                adp: inspection.apMean.adp.night,
              },
            ].map((reading, index) => (
              <div
                key={index}
                className="flex items-center justify-center gap-1 px-1  "
              >
                <div className="flex items-center gap-3 shrink-0 ">
                  <div className="flex flex-col items-center justify-center p-1 w-[100px] h-[100px]  sm:w-[110px] sm:h-[101px] rounded-[25px]  border-[1px] border-solid border-gray">
                    <div className="flex gap-1 items-center">
                      <span className="text-[16px] sm:text-[19px] font-bold">
                        {reading.value.toFixed(1)}
                      </span>
                      <span className="text-[14px] ">mmHg</span>
                    </div>

                    <span className="text-[16px] sm:text-[19px]  font-bold">
                      {reading.time}
                    </span>
                  </div>
                </div>
                <div className="w-[75px] flex items-center justify-center">
                  {reading.icon}
                </div>
                <div className="flex flex-col items-center justify-center shrink-0 p-1 rounded-[25px] w-[100px] h-[100px]  sm:w-[110px] sm:h-[101px] border-[1px] border-solid border-gray">
                  <div className="flex gap-1 items-center ">
                    <span className="text-[16px] sm:text-[19px] font-bold">
                      {reading.adp.toFixed(1)}
                    </span>
                    <span className="text-[14px] ">mmHg</span>
                  </div>
                  <span className="text-[16px] sm:text-[19px]  font-bold">
                    Mean ADP
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AP Load Section */}
        <div className="w-full max-w-2xl px-6 pb-4 py-1 rounded-3xl border border-[#AEADAD] bg-white">
          <h2 className="text-[20px] sm:text-[24px] font-bold mb-3 text-center">
            AP Load
          </h2>

          <div className="grid grid-cols-[1fr_auto_1fr] gap-4 items-center">
            <div className="text-[16px] sm:text-[19px] font-bold text-center">
              ASP
            </div>
            <div className="text-[16px] sm:text-[19px] font-bold text-center"></div>
            <div className="text-[16px] sm:text-[19px] font-bold text-center">
              ADP
            </div>
          </div>
          <div className="space-y-6">
            {[
              {
                asp: inspection.apLoad.asp.day,
                adp: inspection.apLoad.adp.day,
                icon: (
                  <Image
                    src={Sun || "/placeholder.svg"}
                    alt="Sun"
                    className="h-[18px] w-[55px] sm:h-[20px] sm:w-[57px]"
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
                    className="w-[18px] h-[18px] sm:h-[20px] sm:w-[20px]"
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
                    className="w-[18px] h-[18px] sm:h-[20px] sm:w-[20px]"
                  />
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="grid grid-cols-[1fr_1fr_1fr] gap-4  items-center"
              >
                {/* ASP Bar */}
                <div className="flex items-center shrink-0">
                  <div className="h-4 w-full bg-[#AEADAD] overflow-hidden">
                    <div
                      className="h-full bg-[#B0D5BC] transition-all duration-500 relative"
                      style={{ width: `${Math.abs(item.asp).toFixed(1)}%` }}
                    >
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 font-bold text-black text-[14px]">
                        {Math.abs(item.asp).toFixed(1)}
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
                      style={{ width: `${Math.abs(item.adp).toFixed(1)}%` }}
                    >
                      <span className="absolute left-1 top-1/2 -translate-y-1/2 font-semibold text-black text-sm">
                        {Math.abs(item.asp).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Medications Section */}
        <div className="rounded-3xl border py-1 border-[#AEADAD] my-4 bg-white">
          <h2 className="text-[24px font-bold text-center">Medications</h2>
          <div className="space-y-2">
            {inspection.medications.map((med: any) => (
              <div
                key={med.name}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-xl"
              >
                <span className="font-bold text-[14px]">{med.name}</span>
                <span className="text-[14px] font-semibold">{med.dose}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
