import React from 'react';

interface InfoSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

export default function InfoSection({ id, title, children }: InfoSectionProps) {
  return (
    <section id={id} className="pt-20 -mt-20"> {/* pt-20 is for scroll offset */}
        <div className="bg-white rounded-large p-6 sm:p-8 border border-gray-200 shadow-sm">
            <h2 className="text-3xl font-bold text-brand-dark mb-6">{title}</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
                {children}
            </div>
        </div>
    </section>
  );
}