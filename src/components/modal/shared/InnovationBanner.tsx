'use client';

interface InnovationBannerProps {
  videoSrc: string;
  title: string;
  subtitle: string;
  className?: string;
}

export default function InnovationBanner({
  videoSrc,
  title,
  subtitle,
  className = ''
}: InnovationBannerProps) {
  return (
    <div className={`w-full h-[92vh] relative ${className}`}>
      <video 
        src={videoSrc} 
        autoPlay 
        muted 
        loop 
        className="w-full h-full object-contain" 
      />
      <div className="absolute bottom-8 w-full flex flex-col justify-center items-center text-white">
        <h3 className="text-2xl font-bold mb-2">{title}</h3>
        <h4 className="text-lg">{subtitle}</h4>
      </div>
    </div>
  );
}