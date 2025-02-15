// Sample data for the circular chart (24-hour cycle)
export const circularChartData = [
  { hour: 0, asp: 120, adp: 80, map: 93 },
  { hour: 1, asp: 118, adp: 78, map: 91 },
  { hour: 2, asp: 115, adp: 75, map: 88 },
  { hour: 3, asp: 112, adp: 72, map: 85 },
  { hour: 4, asp: 110, adp: 70, map: 83 },
  { hour: 5, asp: 115, adp: 75, map: 88 },
  { hour: 6, asp: 120, adp: 80, map: 93 },
  { hour: 7, asp: 125, adp: 85, map: 98 },
  { hour: 8, asp: 130, adp: 88, map: 102 },
  { hour: 9, asp: 128, adp: 86, map: 100 },
  { hour: 10, asp: 126, adp: 84, map: 98 },
  { hour: 11, asp: 125, adp: 83, map: 97 },
  { hour: 12, asp: 124, adp: 82, map: 96 },
  { hour: 13, asp: 126, adp: 84, map: 98 },
  { hour: 14, asp: 128, adp: 86, map: 100 },
  { hour: 15, asp: 127, adp: 85, map: 99 },
  { hour: 16, asp: 126, adp: 84, map: 98 },
  { hour: 17, asp: 128, adp: 86, map: 100 },
  { hour: 18, asp: 130, adp: 88, map: 102 },
  { hour: 19, asp: 128, adp: 86, map: 100 },
  { hour: 20, asp: 125, adp: 83, map: 97 },
  { hour: 21, asp: 122, adp: 80, map: 94 },
  { hour: 22, asp: 120, adp: 78, map: 92 },
  { hour: 23, asp: 118, adp: 76, map: 90 },
];
// Sample data for the heatmap
export const heatmapData = [
  { x: "ASP 2h", y: 5, value: 0.8 },
  { x: "ASP 2h", y: 4, value: 0.6 },
  { x: "ASP 2h", y: 3, value: 0.4 },
  { x: "ASP 2h", y: 2, value: 0.2 },
  { x: "ASP 2h", y: 1, value: 0.1 },
  { x: "ADP 24h", y: 5, value: -0.8 },
  { x: "ADP 24h", y: 4, value: -0.6 },
  // ... add more data points for each combination
];

// Sample data for the difference chart
export const differenceData = Array.from({ length: 100 }, (_, i) => ({
  timestamp: i,
  abnormalInspection5ASP: Math.sin(i / 10) * 0.5 + Math.random() * 0.1,
  abnormalInspection4ASP: Math.sin(i / 10) * 0.4 + Math.random() * 0.1,
  abnormalInspection5ADP: Math.cos(i / 10) * 0.5 + Math.random() * 0.1,
  abnormalInspection4ADP: Math.cos(i / 10) * 0.4 + Math.random() * 0.1,
  referenceVisit5ASP: 0.7 + Math.sin(i / 15) * 0.1,
  referenceVisit4ASP: 0.7 + Math.sin(i / 15) * 0.1,
  referenceVisit5ADP: 0.6 + Math.cos(i / 15) * 0.1,
  referenceVisit4ADP: 0.6 + Math.cos(i / 15) * 0.1,
}));
