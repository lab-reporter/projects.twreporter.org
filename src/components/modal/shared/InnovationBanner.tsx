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
        className="w-full h-[calc(92vh-5rem)] object-contain"
      />
      <div className="absolute bottom-8 w-full flex flex-col justify-center items-center">
        <h3 className="mb-2">{title}</h3>
        <h5>{subtitle}</h5>
      </div>
    </div>
  );
}