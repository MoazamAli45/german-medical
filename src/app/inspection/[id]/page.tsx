import { DifferenceChart } from "@/components/details/difference-chart";
import Heatmap from "@/components/details/heatmap-chart";
import InspectionCharts from "@/components/details/inspection-charts";
import { RightSidebar } from "@/components/details/medical-sidebar";
import { Sidebar } from "@/components/sidebar";

const page = ({ params }: any) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="pl-12 sm:pl-16 lg:pr-[360px] transition-all duration-300 lg:col-span-9 space-y-6">
        <div className="flex flex-col gap-1   md:flex-row md:justify-center">
          <div className=" p-2 md:basis-[35%] ">
            <Heatmap id={params?.id} />
          </div>
          <div className="ml-12 mr-2 sm:mr-0 sm:ml-0 mb-2 h-full md:basis-[65%] border-[3px] border-solid border-[#743C79]  mt-10 pb-4">
            <div className="pb-5">
              <InspectionCharts id={params?.id} />
            </div>

            <div className=" flex flex-col">
              <DifferenceChart id={params?.id} width={600} height={300} />
              <div className="flex flex-col self-end mr-20 items-center  p-4">
                <h2 className="text-lg font-semibold mb-2">AP Profile</h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px bg-orange-500"></span>
                    <span>Anormal Inspection {params?.id} ASP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px bg-green-500"></span>
                    <span>Reference Visit {params?.id} ASP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px border-dotted border-2 border-orange-500"></span>
                    <span>Anormal Inspection {params?.id - 1} ASP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px border-dotted border-2 border-green-500"></span>
                    <span>Reference Visit {params?.id - 1} ASP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px bg-blue-500"></span>
                    <span>Anormal Inspection {params?.id} ADP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px bg-green-500"></span>
                    <span>Reference Visit {params?.id} ADP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px border-dotted border-2 border-blue-500"></span>
                    <span>Anormal Inspection {params?.id - 1} ADP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-px border-dotted border-2 border-green-500"></span>
                    <span>Reference Visit {params?.id - 1} ADP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <RightSidebar id={params?.id} />
    </div>
  );
};

export default page;
