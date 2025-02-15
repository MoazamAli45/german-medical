import { DifferenceChart } from "@/components/details/difference-chart";
import Heatmap from "@/components/details/heatmap-chart";
import InspectionCharts from "@/components/details/inspection-charts";
// import { RightSidebar } from "@/components/right-sidebar";
import { Sidebar } from "@/components/sidebar";
import { differenceData } from "@/lib/sample-data";

const page = ({ params }: any) => {
  console.log("Params", params?.id);
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="pl-12 sm:pl-16 lg:pr-[340px] transition-all duration-300 lg:col-span-9 space-y-6">
        <div className="flex flex-col gap-1 md:grid  md:grid-cols-5">
          <div className=" p-2 md:col-span-2 ">
            <Heatmap />
          </div>
          <div className=" md:col-span-3">
            <InspectionCharts id={params?.id} />
          </div>
          {/* Bottom Chart */}
          <div className=" rounded-lg p-4 md:col-span-3 md:col-start-3  ">
            <DifferenceChart data={differenceData} />
          </div>
        </div>
      </div>
      {/* <RightSidebar inspection={activeInspection} /> */}
    </div>
  );
};

export default page;
