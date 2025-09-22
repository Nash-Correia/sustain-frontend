"use client";
import React from 'react';

// Reusable component for section titles
const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-3xl font-bold text-center text-brand-dark mb-12">{children}</h2>
);

// --- SVG Icons ---
const IndependenceIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /></svg>;
const TransparencyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
const AccountabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const ReadPolicyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>;


// --- Components ---

const AboutHero = () => (
  <section className="bg-brand-surface">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
      <h1 className="text-4xl sm:text-5xl font-bold text-brand-dark">About</h1>
      <p className="mt-4 text-lg text-gray-700 max-w-3xl mx-auto">
        Institutional Investor Advisory Services India Limited (IiAS) is an advisory firm, dedicated to providing participants in the Indian market with independent opinions, research and data on corporate governance and ESG issues as well as voting recommendations on shareholder resolutions.
      </p>
    </div>
  </section>
);

const OurPurpose = () => (
  <section className="py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold text-brand-dark mb-6">Our Purpose</h2>
          <div className="space-y-4 text-gray-600">
            <p>
              IiAS provides bespoke research and assists institutions in their engagement with company managements and their boards. It runs two cloud-based platforms, SMART to help investors with reporting on their stewardship activities and ADRIAN, a repository of resolutions and institutional voting patterns.
            </p>
            <p>
              IiAS has worked with some of India's largest hedge funds, alternate investment funds and PE Funds to guide them in their ESG assessments and integrate ESG into their investment decisions.
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2">
           <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500"></span>
            </div>
        </div>
      </div>
    </div>
  </section>
);

const OurCommitment = () => {
    const commitments = [
        { icon: <IndependenceIcon />, title: "Independence", description: "Our research and recommendations are driven by data and an unbiased assessment of corporate governance practices." },
        { icon: <TransparencyIcon />, title: "Transparency", description: "We believe in clear, open communication and provide detailed insights into our methodologies and voting guidelines." },
        { icon: <AccountabilityIcon />, title: "Accountability", description: "We hold ourselves to the highest standards of integrity and are committed to promoting accountability in the Indian market." },
    ];

    return (
        <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionTitle>Our Commitment</SectionTitle>
                <div className="grid md:grid-cols-3 gap-8">
                    {commitments.map(item => (
                        <div key={item.title} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow text-center">
                            <div className="flex-shrink-0 w-20 h-20 mx-auto mb-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-bold text-brand-dark">{item.title}</h3>
                            <p className="mt-4 text-gray-600">{item.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const OurPeople = () => {
    const team = [
        { name: "Anil Singhvi", title: "Founder Director" },
        { name: "Amit Tandon", title: "Founder & Managing Director" },
        { name: "Hetal Dalal", title: "President & COO" },
        { name: "Deven Sharma", title: "Board Member" },
        { name: "Robert Pavrey", title: "Board Member" },
        { name: "Renuka Ramnath", title: "Board Member" },
    ];

    return (
        <section className="py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionTitle>Our People</SectionTitle>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {team.map(member => (
                        <div key={member.name} className="text-center group">
                            <div className="w-48 h-48 mx-auto rounded-full bg-gray-200 mb-4 overflow-hidden transform group-hover:scale-105 transition-transform">
                                {/* Placeholder for image */}
                            </div>
                            <h3 className="text-xl font-semibold text-brand-dark">{member.name}</h3>
                            <p className="text-gray-600">{member.title}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const Policies = () => {
    const policies = [
        { title: "IiAS Voting Recommendations' Methodology and Process", description: "A brief note outlining the method and process that IiAS' analysts follow in arriving at voting recommendations." },
        { title: "Securities Trading Policy", description: "Our voting advisory reports recommend how investors should vote on shareholder resolutions – these do not carry any buy or sell recommendations." },
        { title: "Anti-Money Laundering Policy", description: "IiAS has adopted this AML Policy, which is commensurate with the nature of its business, organizational structure and type of clients and transactions." },
        { title: "Website Privacy Policy", description: "In general, this Website may be visited without revealing information about yourself." },
        { title: "Policy on dealing with Complaints and Grievances received from Market Participants", description: "A brief note outlining the process that will be followed in dealing with complaints and grievances received from market participants." },
        { title: "Review and Oversight Committee", description: "The Review and Oversight Committee (ROC) has been constituted to oversee the voting recommendations published by IiAS." },
        { title: "Policy on Communication with Investors, Companies, Media and Regulators", description: "This policy lays down the basis of IiAS' communication with such stakeholders, with specific context to its voting advisory and engagement services." },
        { title: "Policy on Prevention of Sexual Harassment", description: "IiAS is an equal employment opportunity company and is committed to creating a healthy working environment." },
        { title: "Code of Conduct", description: "IiAS' employees and others performing work for IiAS or on its behalf are expected to act lawfully, honestly, ethically, and in the best interests of the company." },
    ];

    return (
        <section className="bg-gray-50 py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <SectionTitle>Policies</SectionTitle>
                <div className="max-w-4xl mx-auto">
                    <div className="space-y-4">
                        {policies.map(policy => (
                            <div key={policy.title} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-lg font-semibold text-brand-dark">{policy.title}</h3>
                                <p className="mt-2 text-gray-600">{policy.description}</p>
                                <a href="#" className="inline-flex items-center mt-4 text-teal-600 font-semibold hover:underline">
                                    Read Policy <ReadPolicyIcon />
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />
      <OurPurpose />
      <OurCommitment />
      <OurPeople />
      <Policies />
    </>
  );
}

