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
      <main className="pl-16 pr-72 transition-all duration-300">
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              {/* Header */}
              <div className="flex items-center gap-4">
                <span className="border-[1px] border-solid border-gray py-1 px-2">
                  ID: 345287, Max Mustermann,
                  <span className="text-[18px] ">♂</span>
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-2">
                {inspections.map((inspection) => (
                  <div
                    key={inspection.number}
                    className="group bg-gray-50 rounded-lg p-4 relative hover:shadow-md transition-all duration-300 h-[300px] hover:border-color hover:bg-[rgb(168,230,243,.19)]"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="font-semibold">
                        Inspection {inspection.number}
                      </h2>
                      <span className="text-sm text-gray-500">
                        {inspection.date}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 mb-4">
                      {inspection.age}, {inspection.height}
                    </div>
                    <D3InspectionGraph data={inspection.data} />

                    {/* Show Details Button - appears on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex justify-center">
                      <button className="bg-blue-50 text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-100 transition-colors">
                        Show Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-6 flex gap-6 justify-center">
                {[
                  { color: "bg-red-500", label: "Abnormal ASP > Refenc ASP" },
                  { color: "bg-blue-500", label: "Abnormal ADP > Refenc ADP" },
                  {
                    color: "bg-green-500",
                    label: "Refence ASP/ADP > Abnormal ASP/ADP",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${item.color}`} />
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
