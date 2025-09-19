"use client";
import React, { useState } from 'react';
import { clsx } from '@/lib/utils';

// New interface for individual theme details
interface Theme {
  title: string;
  content: React.ReactNode;
}

interface PillarDetailCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  summary: string;
  themes: Theme[];
}

// A sub-component for the expandable theme details
const ThemeAccordion = ({ title, children }: { title: string, children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-t">
      <button 
        className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span className="font-semibold text-gray-800">{title}</span>
        <span className={clsx("transform transition-transform text-gray-500", isOpen ? "rotate-180" : "rotate-0")}>▼</span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 prose prose-sm max-w-none text-gray-700">
          {children}
        </div>
      )}
    </div>
  )
}

export default function PillarDetailCard({ id, title, icon, color, summary, themes }: PillarDetailCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const colorClasses = {
    border: `border-${color}-500`,
    text: `text-${color}-600`,
    bg: `bg-${color}-100`,
  };

  return (
    <div id={id} className={`rounded-lg border-2 ${isOpen ? colorClasses.border : 'border-gray-200'} transition-all scroll-mt-20`}>
      <button 
        className={clsx("w-full p-4 flex items-center justify-between text-left", isOpen && colorClasses.bg)}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full ${colorClasses.bg}`}>
            {icon}
          </div>
          <div>
            <h3 className={`text-xl font-bold ${colorClasses.text}`}>{title}</h3>
            <p className="text-sm text-gray-600 hidden sm:block">{summary}</p>
          </div>
        </div>
        <span className={clsx("transform transition-transform text-2xl text-gray-500", isOpen ? 'rotate-45' : 'rotate-0')}>+</span>
      </button>
      
      {isOpen && (
        <div className="p-6 border-t border-gray-200">
           <div className="border rounded-md bg-white">
            {themes.map(theme => (
              <ThemeAccordion key={theme.title} title={theme.title}>
                {theme.content}
              </ThemeAccordion>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}