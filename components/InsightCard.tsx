interface InsightCardProps {
  title: string;
  imageUrl?: string;
  onReadMore?: () => void;
}

export default function InsightCard({ 
  title, 
  imageUrl, 
  onReadMore 
}: InsightCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm h-full flex flex-col">
      {/* Image section */}
      <div className="aspect-video bg-gray-200">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span>No image available</span>
          </div>
        )} 
      </div>
      
      {/* Content section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <h3 className="text-lg font-semibold text-brand-dark mb-4">{title}</h3>
        
        {/* Read More button */}
        <div className="text-left">
          <button
            className="text-[14px] font-medium text-[#1D7AEA] hover:underline"
            onClick={onReadMore}
          >
            Read More
          </button>
        </div>
      </div>
    </article>
  );
}