import React from 'react';

// --- ICONS ---
const PillarIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 21H20.5" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/><path d="M5 21V10.7C5 10.2 5.4 9.8 5.9 9.8H8.1C8.6 9.8 9 10.2 9 10.7V21" stroke="#4A5568" strokeWidth="1.5"/><path d="M10.5 21V10.7C10.5 10.2 10.9 9.8 11.4 9.8H12.6C13.1 9.8 13.5 10.2 13.5 10.7V21" stroke="#4A5568" strokeWidth="1.5"/><path d="M15 21V10.7C15 10.2 15.4 9.8 15.9 9.8H18.1C18.6 9.8 19 10.2 19 10.7V21" stroke="#4A5568" strokeWidth="1.5"/><path d="M2 10L12 3L22 10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/></svg> );
const ScreenIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3H6C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V8L15 3Z" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 4V9H19" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 14H15" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 17H13" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 11H10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/></svg> );
const RatingIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#F6E05E" fillOpacity="0.3"/><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="#D69E2E" strokeWidth="1.5"/><path d="M9.5 12.5L11.5 14.5L14.5 10.5" stroke="#D69E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const ThickArrow = () => ( <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5L19 12L12 19" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );

const Node = ({ children }: { children: React.ReactNode }) => (
    <div className="flex-1 flex flex-col items-center relative p-2">
        {children}
    </div>
);

export default function StaticMethodologyDiagram() {
  return (
    <div className="bg-white rounded-large p-4 my-4 border border-gray-200">
      <div className="flex items-center justify-around text-center">
        <Node>
            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center"> <PillarIcon /> </div>
            <h3 className="mt-2 text-base font-bold text-brand-dark">Pillar Score</h3>
            <p className="text-xs text-gray-500">E, S, G</p>
        </Node>
        <ThickArrow />
        <Node>
            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center"> <ScreenIcon /> </div>
            <h3 className="mt-2 text-base font-bold text-brand-dark">Screen</h3>
            <p className="text-xs text-gray-500">Positive, Negative</p>
        </Node>
        <ThickArrow />
        <Node>
            <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center"> <RatingIcon /> </div>
            <h3 className="mt-2 text-base font-bold text-teal-600">Composite Rating</h3>
            <p className="text-xs text-gray-500">A+ to D</p>
        </Node>
      </div>
    </div>
  );
}