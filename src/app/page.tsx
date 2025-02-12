import { Sidebar } from "@/components/sidebar";
import { RightSidebar } from "@/components/right-sidebar";
import { D3InspectionGraph } from "@/components/d3-inspection-graph";

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

export default function Home() {
  const inspections = [
    {
      number: 5,
      date: "01.02.2011",
      age: "14y",
      height: "159cm",
      data: generateSampleData(),
    },
    {
      number: 4,
      date: "11.12.2010",
      age: "11y",
      height: "129cm",
      data: generateSampleData(),
    },
    {
      number: 3,
      date: "05.01.2010",
      age: "11y",
      height: "128cm",
      data: generateSampleData(),
    },
    {
      number: 1,
      date: "19.11.2009",
      age: "10.9y",
      height: "158cm",
      data: generateSampleData(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="pl-12 sm:pl-16 mlg:pr-72 transition-all duration-300">
        <div className="p-1 sm:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <span className="border-[1px] border-solid border-gray py-1 px-2">
                  ID: 345287, Max Mustermann,
                  <span className="text-[18px] ">♂</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-2 max-w-5xl">
                {inspections.map((inspection) => (
                  <div
                    key={inspection.number}
                    className="mlg:h-[370px] flex flex-col gap-2 group"
                  >
                    <div className="bg-gray-50 rounded-lg p-4 relative hover:shadow-md transition-all duration-300 mlg:h-[300px] hover:border-[#88B1EF] border-[1px] border-solid border-[rgb(168,230,243,.19)] hover:bg-[rgb(168,230,243,.19)]">
                      <div className="flex flex-col items-center ">
                        <h2 className="font-bold text-lg">
                          Inspection {inspection.number}
                        </h2>
                        <span className="text-sm text-gray-500">
                          {inspection.date}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500 mb-4 text-center">
                        {inspection.age}, {inspection.height}
                      </div>
                      <D3InspectionGraph data={inspection.data} />
                    </div>
                    <button className="group-hover:opacity-100 opacity-0 border-color  bg-[rgb(168,230,243,.19)]  px-6 py-2 rounded-lg font-normal  transition-opacity duration-300">
                      Show Details
                    </button>
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
                    <span className="text-sm text-gray-600">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <RightSidebar />
    </div>
  );
}
