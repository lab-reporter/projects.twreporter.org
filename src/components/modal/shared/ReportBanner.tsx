'use client';

interface ReportBannerProps {
  mediaSrc?: string;
  title: string;
  subtitle?: string;
  date?: string;
  className?: string;
}

export default function ReportBanner({
  mediaSrc,
  title,
  subtitle,
  date,
  className = ''
}: ReportBannerProps) {
  // 判斷媒體類型的函數 - 完全匹配原始邏輯
  const getMediaType = (src?: string) => {
    if (!src) return 'image';

    const videoExtensions = ['.mp4', '.webm', '.ogg', '.avi', '.mov', '.wmv', '.flv', '.mkv'];
    const lowerSrc = src.toLowerCase();

    return videoExtensions.some(ext => lowerSrc.includes(ext)) ? 'video' : 'image';
  };

  const mediaType = getMediaType(mediaSrc);

  return (
    <div className={`relative ${className}`}>
      <div className="w-full h-[92vh]">
        {mediaSrc ? (
          // 有媒體來源
          mediaType === 'video' ? (
            <video
              className="w-full h-full object-cover"
              src={mediaSrc}
              autoPlay
              loop
              muted
              playsInline
            >
              您的瀏覽器不支援影片播放。
            </video>
          ) : (
            <img
              className="w-full h-full object-cover"
              src={mediaSrc}
              alt={title}
            />
          )
        ) : (
          // 無媒體來源 - 預設漸層背景
          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800" />
        )}

        {/* 漸層遮罩 - 完全匹配原始設計 */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-blend-multiply"
          style={{
            background: 'linear-gradient(to bottom, rgba(0, 0, 0, 0) 40%, rgba(0, 0, 0, 0.9) 100%)'
          }}
        />
      </div>

      {/* 文字內容疊加 - 完全匹配原始位置和樣式 */}
      <div className="text-white absolute bottom-10 left-0 w-full flex flex-col items-center">
        {/* 日期 - 原始樣式 */}
        {date && (
          <h6 className="font-normal p-[0.25rem] leading-none bg-red-90 text-center mb-4">
            {date}
          </h6>
        )}

        {/* 主標題 - 原始樣式 */}
        <h2 className="mb-2">
          {title}
        </h2>

        {/* 副標題 - 原始樣式 */}
        {subtitle && (
          <h5 className="text-center">
            {subtitle}
          </h5>
        )}
      </div>
    </div>
  );
}