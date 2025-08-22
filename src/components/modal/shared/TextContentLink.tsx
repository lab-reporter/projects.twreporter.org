'use client';

interface TextContentLinkProps {
    href: string;
    children: React.ReactNode;
    target?: '_blank' | '_self' | '_parent' | '_top';
    className?: string;
}

export default function TextContentLink({
    href,
    children,
    target = '_blank',
    className = ''
}: TextContentLinkProps) {
    return (
        <a
            href={href}
            target={target}
            className={`underline-offset-4 decoration-red-70 hover:text-red-70 ${className}`}
        >
            {children}
        </a>
    );
}
