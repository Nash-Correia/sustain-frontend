import React from 'react';

// --- NEW, MORE ACCURATE ICONS ---

const PillarIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 21H20.5" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M5 21V10.7C5 10.2 5.4 9.8 5.9 9.8H8.1C8.6 9.8 9 10.2 9 10.7V21" stroke="#4A5568" strokeWidth="1.5"/>
    <path d="M10.5 21V10.7C10.5 10.2 10.9 9.8 11.4 9.8H12.6C13.1 9.8 13.5 10.2 13.5 10.7V21" stroke="#4A5568" strokeWidth="1.5"/>
    <path d="M15 21V10.7C15 10.2 15.4 9.8 15.9 9.8H18.1C18.6 9.8 19 10.2 19 10.7V21" stroke="#4A5568" strokeWidth="1.5"/>
    <path d="M2 10L12 3L22 10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M7,12 L7,14" stroke="#F6AD55" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12,12 L12,16" stroke="#F6AD55" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M17,12 L17,14" stroke="#F6AD55" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ScreenIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3H6C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V8L15 3Z" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M14 4V9H19" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M9 14H15" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 17H13" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M9 11H10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const RatingIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="#F6E05E" fillOpacity="0.3"/>
    <path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="#D69E2E" strokeWidth="1.5"/>
    <path d="M8.5 12L11 14.5L15.5 10" stroke="#D69E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ThickArrow = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 5L19 12L12 19" stroke="#1C1C1C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const InfoItem = ({ icon, text, color }: { icon: React.ReactNode, text: string, color: string }) => (
  <div className="flex flex-col items-center text-center">
    <div className={`w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center`}>
      {icon}
    </div>
    <p className={`mt-2 font-semibold ${color}`}>{text}</p>
  </div>
);

// Main Diagram Component
export default function MethodologyDiagram() {
  return (
    <div className="bg-white rounded-large p-6 sm:p-8 border border-gray-200 shadow-sm font-sans">
      {/* Top Row */}
      <div className="flex flex-col md:flex-row items-center justify-around gap-4 text-center">
        {/* Step 1: Pillar Score */}
        <div className="flex flex-col items-center relative">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                <PillarIcon />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-dark">Pillar Score</h3>
            <p className="text-sm text-gray-500">Environmental, Social, Governance</p>
            {/* Dotted Connector */}
            <div className="hidden md:block absolute top-full left-1/2 w-px h-16 border-l-2 border-dashed border-gray-400 mt-2"></div>
        </div>

        <ThickArrow />

        {/* Step 2: Screen */}
        <div className="flex flex-col items-center relative">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                <ScreenIcon />
            </div>
            <h3 className="mt-4 text-lg font-bold text-brand-dark">Screen</h3>
            <p className="text-sm text-gray-500">Positive, Negative, Controversy</p>
            {/* Dotted Connector */}
            <div className="hidden md:block absolute top-full left-1/2 w-px h-16 border-l-2 border-dashed border-gray-400 mt-2"></div>
        </div>
        
        <ThickArrow />

        {/* Step 3: Composite Rating */}
        <div className="flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center">
                <RatingIcon />
            </div>
            <h3 className="mt-4 text-lg font-bold text-teal-600">Composite Rating</h3>
            <p className="text-sm text-gray-500">ESG grade form A+ to D</p>
        </div>
      </div>

      {/* Bottom Sections */}
      <div className="mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Environmental / Social / Governance Box with Gradient Border */}
            <div className="rounded-2xl p-1 bg-gradient-to-r from-green-200 via-blue-200 to-yellow-200">
                <div className="bg-white rounded-xl p-6">
                    <div className="flex justify-around">
                        <InfoItem icon={<img src="https://img.icons8.com/plasticine/100/plant-sapling.png" alt="Environmental"/>} text="Environmental" color="text-green-600" />
                        <InfoItem icon={<img src="https://img.icons8.com/plasticine/100/user-group-man-man.png" alt="Social"/>} text="Social" color="text-blue-600" />
                        <InfoItem icon={<img src="https://img.icons8.com/plasticine/100/conference-call.png" alt="Governance"/>} text="Governance" color="text-yellow-700" />
                    </div>
                </div>
            </div>
            {/* Positive / Negative / Controversy Box with Gradient Border */}
            <div className="rounded-2xl p-1 bg-gradient-to-r from-green-300 to-red-300">
                <div className="bg-white rounded-xl p-6">
                    <div className="flex justify-around">
                        <InfoItem icon={<img src="https://img.icons8.com/plasticine/100/ok.png" alt="Positive"/>} text="Positive" color="text-green-600" />
                        <InfoItem icon={<img src="https://img.icons8.com/plasticine/100/cancel.png" alt="Negative"/>} text="Negative" color="text-red-600" />
                        <InfoItem icon={<img src="https://img.icons8.com/plasticine/100/error.png" alt="Controversy"/>} text="Controversy" color="text-yellow-700" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}