const legendData = [
  { rating: 'A+', score: '>70', category: 'Leadership', color: 'bg-rating-a-plus' },
  { rating: 'A', score: '65-70', category: 'Advanced', color: 'bg-rating-a' },
  { rating: 'B+', score: '60-65', category: 'Good', color: 'bg-rating-b-plus' },
  { rating: 'B', score: '55-60', category: 'Progressing', color: 'bg-rating-b' },
  { rating: 'C+', score: '50-55', category: 'Average', color: 'bg-rating-c-plus' },
  { rating: 'C', score: '40-50', category: 'Basic', color: 'bg-rating-c' },
  { rating: 'D', score: '<40', category: 'Nascent', color: 'bg-rating-d' },
];

export default function RatingLegend() {
  return (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-[1.5fr_repeat(7,1fr)] min-w-[700px] text-center text-sm border border-gray-200">
        {/* Headers */}
        <div className="font-semibold p-2 border-b border-gray-200 bg-gray-50 text-left">ESG Rating</div>
        {legendData.map(item => <div key={item.rating} className={`p-2 font-bold text-white ${item.color}`}>{item.rating}</div>)}
        
        {/* Score Row */}
        <div className="font-semibold p-2 border-b border-gray-200 bg-gray-50 text-left">ESG Composition Score</div>
        {legendData.map(item => <div key={item.score} className="p-2 bg-gray-100 border-l border-gray-200">{item.score}</div>)}

        {/* Category Row */}
        <div className="font-semibold p-2 bg-gray-50 text-left">Category</div>
        {legendData.map(item => <div key={item.category} className="p-2 bg-gray-100 border-l border-gray-200">{item.category}</div>)}
      </div>
    </div>
  );
}