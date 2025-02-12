"use client";

import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import Image from "next/image";

export function Sidebar() {
  const [isHovered, setIsHovered] = useState(false);

  const navItems = [
    { icon: "/pic1.png", label: "Inspections", href: "/" },
    { icon: "/pic2.png", label: "Search", href: "/" },
    { icon: "/pic3.png", label: "Settings", href: "/" },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r transition-all duration-300 z-50",
        isHovered ? "w-48" : "w-16"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col items-center pt-6 gap-6">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center gap-4 px-2 py-2 text-gray-700 hover:text-primary hover:bg-gray-100  transition-colors w-full"
          >
            {
              <Image
                src={item.icon}
                alt={item.label}
                className={cn("w-11 h-11")}
                width={44}
                height={44}
              />
            }
            <span
              className={cn(
                "whitespace-nowrap transition-opacity",
                isHovered ? "opacity-100" : "opacity-0"
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
