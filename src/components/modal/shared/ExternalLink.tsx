'use client';

interface ExternalLinkProps {
  href?: string;
  children?: React.ReactNode;
  target?: '_blank' | '_self' | '_parent' | '_top';
  className?: string;
}

export default function ExternalLink({ 
  href = '#',
  children = '閱讀完整專題',
  target = '_blank',
  className = ''
}: ExternalLinkProps) {
  return (
    <div className="w-full flex justify-center">
      <a
        href={href}
        target={target}
        className={`inline-block px-4 py-2 bg-gray-400 text-white rounded-md mt-8 hover:bg-red-70 transition-colors duration-300 ${className}`}
      >
        {children}
      </a>
    </div>
  );
}