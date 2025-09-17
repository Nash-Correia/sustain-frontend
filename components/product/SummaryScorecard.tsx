import RatingLegend from './RatingLegend';

interface SummaryProps {
  esgScore: number;
  aumCovered: number;
}

export default function SummaryScorecard({ esgScore, aumCovered }: SummaryProps) {
    return (
        <div className="bg-white border border-gray-200 rounded-large p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-16">
                <div className="text-center">
                    <p className="text-lg text-gray-600">ESG Score</p>
                    <p className="text-7xl font-bold text-brand-dark">{esgScore}</p>
                </div>
                <div className="text-center">
                    <p className="text-lg text-gray-600">AUM Covered</p>
                    <p className="text-7xl font-bold text-brand-dark">{aumCovered}%</p>
                </div>
            </div>
            <div className="mt-8">
                <RatingLegend />
            </div>
        </div>
    );
}