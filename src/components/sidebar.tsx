"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { icon: "/pic1.png", label: "SBPDXplore", href: "/" },
    { icon: "/pic2.png", label: "Summary", href: "/" },
    { icon: "/pic3.png", label: "Details", href: "/" },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white  transition-all duration-300 z-50",
        isHovered ? "w-40" : "w-14"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center pt-6 gap-6">
        {navItems.map((item, i) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-2 py-2 text-gray-700 hover:text-primary hover:bg-gray-100  transition-colors w-full"
          >
            <div className="h-8 w-8 sm:w-11 sm:h-11 flex items-center justify-center flex-shrink-0 relative">
              <Image
                src={item.icon}
                alt={item.label}
                className="object-contain"
                fill
              />
            </div>
            <span
              className={cn(
                "whitespace-nowrap transition-opacity text-[16px] sm:text-[22px]  text-black",
                isHovered ? "opacity-100" : "opacity-0",
                { "text-[#AEADAD] font-bold ": i === 0 }
              )}
            >
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
