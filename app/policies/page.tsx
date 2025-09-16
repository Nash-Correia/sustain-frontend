import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Policies - IiAS Sustain',
  description: 'Company policies and governance guidelines',
}

export default function PoliciesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Policies</h1>
        <div className="prose prose-lg max-w-none">
          <p className="text-xl text-gray-600 mb-8">
            Our comprehensive policies and governance guidelines ensure transparency, 
            accountability, and sustainable business practices.
          </p>
          
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">ESG Policy</h2>
              <p className="text-gray-600">
                Environmental, Social, and Governance principles that guide our 
                operations and investment decisions.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Research Ethics</h2>
              <p className="text-gray-600">
                Guidelines ensuring the integrity and objectivity of our research 
                and analysis processes.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Privacy</h2>
              <p className="text-gray-600">
                Protecting stakeholder information and maintaining the highest 
                standards of data security.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Code of Conduct</h2>
              <p className="text-gray-600">
                Professional standards and ethical guidelines for all team members 
                and stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
