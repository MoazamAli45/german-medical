export function RightSidebar() {
  return (
    <div className="fixed right-0 top-0 h-full w-72 bg-white  p-4 overflow-y-auto">
      {/* AP Mean Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">AP Mean</h2>
        <div className="space-y-4">
          {[
            { time: "Day", asp: "108", adp: "58" },
            { time: "Morning", asp: "111", adp: "60" },
            { time: "Night", asp: "103", adp: "51" },
          ].map((reading) => (
            <div
              key={reading.time}
              className="flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                {reading.time === "Day" && (
                  <span className="text-yellow-500">☀️</span>
                )}
                {reading.time === "Morning" && (
                  <span className="text-yellow-400">🌅</span>
                )}
                {reading.time === "Night" && (
                  <span className="text-blue-900">🌙</span>
                )}
                <div>
                  <div className="text-sm text-gray-600">{reading.time}</div>
                  <div className="font-medium">{reading.asp} mmHg</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-600">ADP</div>
                <div className="font-medium">{reading.adp} mmHg</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AP Load Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">AP Load</h2>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "ASP", values: ["92%", "100%", "83%"] },
            { label: "ADP", values: ["94%", "100%", "83%"] },
          ].map((column) => (
            <div key={column.label} className="space-y-2">
              <div className="font-medium text-sm">{column.label}</div>
              {column.values.map((value, index) => (
                <div
                  key={index}
                  className="h-8 bg-gray-100 rounded-full overflow-hidden"
                >
                  <div
                    className="h-full bg-green-200 rounded-full"
                    style={{ width: value }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Medications Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Medications</h2>
        <div className="space-y-3">
          {[
            { name: "Amlodipine", dose: "1x10mg" },
            { name: "Metoprolol", dose: "1x100mg" },
            { name: "Hydrochlor", dose: "1x25mg" },
            { name: "Ramipril", dose: "1x5mg" },
          ].map((med) => (
            <div
              key={med.name}
              className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
            >
              <span className="font-medium">{med.name}</span>
              <span className="text-sm text-gray-600">{med.dose}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
