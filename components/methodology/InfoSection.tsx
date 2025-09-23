import React from 'react';

interface InfoSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function InfoSection({ id, title, children }: InfoSectionProps) {
  return (
    <section id={id} className="pt-20 -mt-20"> {/* pt-20 is for scroll offset */}
        <div className="bg-white rounded-large border border-gray-200 shadow-sm overflow-hidden">
            <div className="sticky top-16 z-30 bg-white border-b border-gray-200 px-6 sm:px-8 py-4">
                <h2 className="text-3xl font-bold text-brand-dark">{title}</h2>
            </div>
            <div className="p-6 sm:p-8">
            <div className="prose prose-lg max-w-none text-gray-700">
                {children}
            </div>
            </div>
        </div>
    </section>
  );
}