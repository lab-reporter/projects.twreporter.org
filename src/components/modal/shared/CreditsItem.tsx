'use client';

interface CreditsItemProps {
  role?: string;
  name: string;
  className?: string;
  showDivider?: boolean;
}

export default function CreditsItem({ 
  role, 
  name, 
  className = '',
  showDivider = true 
}: CreditsItemProps) {
  return (
    <div className={`inline-flex items-center ${className}`}>
      <div className="text-center">
        {role && (
          <div className="text-xs text-gray-500 mb-1 font-medium">
            {role}
          </div>
        )}
        <div className="text-sm md:text-base font-medium text-gray-700">
          {name}
        </div>
      </div>
      
      {/* 分隔符 */}
      {showDivider && (
        <div className="mx-4 w-px h-8 bg-gray-300"></div>
      )}
    </div>
  );
}