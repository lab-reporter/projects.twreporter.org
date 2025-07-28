'use client';

interface CreditsItemProps {
  role: string;
  names: string | string[];
  className?: string;
}

export default function CreditsItem({
  role,
  names,
  className = ''
}: CreditsItemProps) {
  // 將多個名字用頓號連接 - 完全匹配原始邏輯
  const namesText = Array.isArray(names) ? names.join('、') : names;

  return (
    <div className={`flex items-center text-gray-900 font-normal whitespace-nowrap ${className}`}>
      <span className="mr-2">{role} |</span>
      <span>{namesText}</span>
    </div>
  );
}