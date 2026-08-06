import React from "react"

const BreakingTicker = () => (
  <div className="w-full bg-[#E1261C] flex items-center h-9 overflow-hidden shadow-sm">
    <div className="bg-black text-white text-xs font-black uppercase px-4 h-full flex items-center select-none tracking-widest border-r border-[#E1261C] z-10 shrink-0">
      Breaking
    </div>
    <div className="w-full overflow-hidden bg-[#E1261C] text-white text-xs font-bold py-1 select-none">
      <marquee scrollamount="5" className="cursor-pointer">
        🔴 INDIA CRICKET: India wins historic Cricket Test Series in Australia by 3-1! &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        🔴 CLIMATE NEWS: UN Climate Conference proposes strict industrial emission limits by 2030. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        🔴 INFRASTRUCTURE: New Metro Line project approved for Capital City Expansion with 4,500 Cr budget. &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        🔴 GLOBAL TECH: Global Tech Summit 2026 kicks off in New Delhi highlighting AI advancements.
      </marquee>
    </div>
  </div>
)

export default BreakingTicker
