interface ReportsSwiperItemProps {
  id: string;
  path: string;
  title: string;
  subtitle: string;
  bgColor?: string;
}

export default function ReportsSwiperItem({ id, path, title, subtitle, bgColor }: ReportsSwiperItemProps) {
  const isVideo = path.endsWith('.mp4');

  return (
    <div 
      className="relative w-full h-full rounded-lg overflow-hidden shadow-lg cursor-pointer group"
      style={{ backgroundColor: bgColor || '#F1F1F1' }}
    >
      {/* 媒體內容 */}
      <div className="w-full h-60 overflow-hidden">
        {isVideo ? (
          <video 
            src={path}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            muted
            loop
            playsInline
            onMouseEnter={(e) => e.currentTarget.play()}
            onMouseLeave={(e) => e.currentTarget.pause()}
          />
        ) : (
          <img 
            src={path}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
      </div>

      {/* 文字內容 */}
      <div className="p-4 bg-white">
        <h3 className="text-lg font-bold mb-2 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-600 line-clamp-2">
          {subtitle}
        </p>
      </div>

      {/* Hover 效果 */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 pointer-events-none" />
    </div>
  );
}