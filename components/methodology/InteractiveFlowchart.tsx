"use client";
import React from 'react';

// --- ICONS ---
const PillarIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.5 21H20.5" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/><path d="M5 21V10.7C5 10.2 5.4 9.8 5.9 9.8H8.1C8.6 9.8 9 10.2 9 10.7V21" stroke="#4A5568" strokeWidth="1.5"/><path d="M10.5 21V10.7C10.5 10.2 10.9 9.8 11.4 9.8H12.6C13.1 9.8 13.5 10.2 13.5 10.7V21" stroke="#4A5568" strokeWidth="1.5"/><path d="M15 21V10.7C15 10.2 15.4 9.8 15.9 9.8H18.1C18.6 9.8 19 10.2 19 10.7V21" stroke="#4A5568" strokeWidth="1.5"/><path d="M2 10L12 3L22 10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/></svg> );
const ScreenIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 3H6C5.44772 3 5 3.44772 5 4V20C5 20.5523 5.44772 21 6 21H18C18.5523 21 19 20.5523 19 20V8L15 3Z" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/><path d="M14 4V9H19" stroke="#4A5568" strokeWidth="1.5" strokeLinejoin="round"/><path d="M9 14H15" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 17H13" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/><path d="M9 11H10" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/></svg> );
const RatingIcon = () => ( <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" fill="#F6E05E" fillOpacity="0.3"/><path d="M12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2Z" stroke="#D69E2E" strokeWidth="1.5"/><path d="M9.5 12.5L11.5 14.5L14.5 10.5" stroke="#D69E2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );
const ThickArrow = () => ( <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5 12H19" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 5L19 12L12 19" stroke="#A0AEC0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> );


// --- NEW ICONS FOR SUB-NODES ---
const EnvIcon = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#38A169" strokeWidth="1.5" fill="#C6F6D5"/></svg>);
const SocialIcon = () => ( 	<svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#2B6CB0" strokeWidth="1.5" xmlns="http://www.w3.org/2000/svg">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>); 
const GovIcon = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 11c-1.657 0-3-1.343-3-3s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3zM12 13c3.866 0 7 1.79 7 4v1H5v-1c0-2.21 3.134-4 7-4z" stroke="#D69E2E" strokeWidth="1.5" fill="#FEFCBF"/></svg>);
const PositiveIcon = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3" stroke="#38A169" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const NegativeIcon = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="10" stroke="#E53E3E" strokeWidth="2.5"/><path d="M15 9l-6 6M9 9l6 6" stroke="#E53E3E" strokeWidth="2.5" strokeLinecap="round"/></svg>);
const ControversyIcon = () => (<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="#DD6B20" strokeWidth="2.5" fill="#FEEBC8"/><line x1="12" y1="9" x2="12" y2="13" stroke="#DD6B20" strokeWidth="2.5" strokeLinecap="round"/><line x1="12" y1="17" x2="12.01" y2="17" stroke="#DD6B20" strokeWidth="2.5" strokeLinecap="round"/></svg>);

const InfoItem = ({ icon, text, color, onClick }: { icon: React.ReactNode, text: string, color: string, onClick: () => void }) => (
  <button onClick={onClick} className="flex flex-col items-center text-center group">
    <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center group-hover:shadow-xl transition-shadow">
      {icon}
    </div>
    <p className={`mt-2 font-semibold ${color}`}>{text}</p>
  </button>
);

const NodeButton = ({ children, onClick }: { children: React.ReactNode, onClick: () => void }) => (
    <button onClick={onClick} className="flex-1 flex flex-col items-center relative group p-2 rounded-lg hover:bg-gray-50 transition-colors">
        {children}
    </button>
);

interface DiagramProps {
    onNodeClick: (sectionId: string) => void;
}

export default function InteractiveMethodologyDiagram({ onNodeClick }: DiagramProps) {
  return (
    <div className="bg-white rounded-large p-6 sm:p-8 border border-gray-200 shadow-sm font-sans">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-around gap-8 md:gap-4 text-center">
        <NodeButton onClick={() => onNodeClick('pillarScore')}>
            <div className="w-24 h-24 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-shadow flex items-center justify-center"> <PillarIcon /> </div>
            <h3 className="mt-4 text-lg font-bold text-brand-dark">Pillar Score</h3>
            <p className="text-sm text-gray-500">Environmental, Social, Governance</p>
        </NodeButton>
        <ThickArrow />
        <NodeButton onClick={() => onNodeClick('screen')}>
            <div className="w-24 h-24 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-shadow flex items-center justify-center"> <ScreenIcon /> </div>
            <h3 className="mt-4 text-lg font-bold text-brand-dark">Screen</h3>
            <p className="text-sm text-gray-500">Positive, Negative, Controversy</p>
        </NodeButton>
        <ThickArrow />
        <NodeButton onClick={() => onNodeClick('compositeRating')}>
            <div className="w-24 h-24 rounded-full bg-white shadow-lg group-hover:shadow-xl transition-shadow flex items-center justify-center"> <RatingIcon /> </div>
            <h3 className="mt-4 text-lg font-bold text-teal-600">Composite Rating</h3>
            <p className="text-sm text-gray-500">ESG grade form A+ to D</p>
        </NodeButton>
      </div>

      <div className="relative mt-8 pt-8 border-t-2 border-dashed">
        <div className="hidden md:block absolute top-0 left-[16.66%] -translate-x-1/2 w-px h-8 border-l-2 border-dashed border-gray-300"></div>
        <div className="hidden md:block absolute top-0 left-[50%] -translate-x-1/2 w-px h-8 border-l-2 border-dashed border-gray-300"></div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl p-1 bg-gradient-to-r from-green-200 via-blue-200 to-yellow-200">
                <div className="bg-white rounded-xl p-6">
                    <div className="flex justify-around">
                        <InfoItem onClick={() => onNodeClick('environmental')} icon={<EnvIcon/>} text="Environmental" color="text-green-600" />
                        <InfoItem onClick={() => onNodeClick('social')} icon={<SocialIcon/>} text="Social" color="text-blue-600" />
                        <InfoItem onClick={() => onNodeClick('governance')} icon={<GovIcon/>} text="Governance" color="text-yellow-700" />
                    </div>
                </div>
            </div>
            <div className="rounded-2xl p-1 bg-gradient-to-r from-green-300 to-red-300">
                <div className="bg-white rounded-xl p-6">
                    <div className="flex justify-around">
                                    <InfoItem onClick={() => onNodeClick('positive')} icon={<PositiveIcon/>} text="Positive" color="text-green-600" />
                        <InfoItem onClick={() => onNodeClick('negative')} icon={<NegativeIcon/>} text="Negative" color="text-red-600" />
                        <InfoItem onClick={() => onNodeClick('controversy')} icon={<ControversyIcon/>} text="Controversy" color="text-yellow-700" />
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}