import React from 'react';

const Description = ({ children }) => {
    return (
        <div className="project-description font-noto-serif-tc [&>*>p]:mb-6 [&>*>p]:leading-relaxed [&>*>p:last-child]:mb-0 [&>*>p]:text-[1.125rem]">
            {children}
        </div>
    );
};

export default Description; 