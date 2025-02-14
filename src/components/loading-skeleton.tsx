import { Loader2 } from "lucide-react";

export function LoadingSkeleton() {
  return (
    <div className="w-full h-full min-h-[80vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      <div className="text-lg font-medium text-gray-700">
        Loading inspections...
      </div>
      <div className="w-full max-w-md space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
          </div>
        ))}
      </div>
    </div>
  );
}
