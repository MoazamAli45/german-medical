import { Loader2 } from "lucide-react";
import React from "react";

const Loader = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-1 ">
      <Loader2 className="animate-spin size-6" />
      <span className="text-[14px] font-semibold">Loading....</span>
    </div>
  );
};

export default Loader;
