import { DifferenceChart } from "@/components/details/difference-chart";
import BloodPressureChart from "@/components/radar-chart";
import React from "react";

function page() {
  return (
    <div>
      <DifferenceChart id={4} />
    </div>
  );
}

export default page;
