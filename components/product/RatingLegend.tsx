// Data for the legend, now including the specific Tailwind class for each rating.
// This is the most reliable way to ensure Tailwind's JIT compiler finds and generates these classes.
const legendData = [
  { rating: 'A+', score: '>75', category: 'Leadership', colorClass: 'bg-rating-a-plus' },
  { rating: 'A', score: '70-74', category: 'Advanced', colorClass: 'bg-rating-a' },
  { rating: 'B+', score: '65-69', category: 'Good', colorClass: 'bg-rating-b-plus' },
  { rating: 'B', score: '60-64', category: 'Progressing', colorClass: 'bg-rating-b' },
  { rating: 'C+', score: '55-59', category: 'Average', colorClass: 'bg-rating-c-plus' },
  { rating: 'C', score: '50-54', category: 'Basic', colorClass: 'bg-rating-c' },
  { rating: 'D', score: '<50', category: 'Nascent', colorClass: 'bg-rating-d' },
];

export default function RatingLegend() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-[1.5fr_repeat(7,1fr)] min-w-[700px] text-center text-sm border border-ui-border rounded-lg overflow-hidden shadow-sm">
        
        {/* Header Row */}
        <div className="font-semibold p-3 border-b border-ui-border bg-ui-fill text-left text-ui-text-primary">ESG Rating</div>
        {legendData.map(item => (
          <div key={item.rating} className={`p-3 font-bold text-white border-b border-l border-ui-border ${item.colorClass}`}>
            {item.rating}
          </div>
        ))}
        
        {/* Score Row */}
        <div className="font-semibold p-3 border-b border-ui-border bg-ui-fill text-left text-ui-text-primary">ESG Composite Score</div>
        {legendData.map(item => (
          <div key={item.score} className="p-3 bg-white border-b border-l border-ui-border text-ui-text-secondary">
            {item.score}
          </div>
        ))}

        {/* Category Row */}
        <div className="font-semibold p-3 bg-ui-fill text-left text-ui-text-primary">Category</div>
        {legendData.map(item => (
          <div key={item.category} className="p-3 bg-white border-l border-ui-border text-ui-text-secondary">
            {item.category}
          </div>
        ))}
      </div>
    </div>
  );
}

