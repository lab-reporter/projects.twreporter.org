import React from 'react';

const ProjectCreditsItem = ({ role, names }) => {
    // 將多個名字用頓號連接
    const namesText = Array.isArray(names) ? names.join('、') : names;

    return (
        <div className="flex items-center text-gray-400 font-noto-sans-tc font-normal whitespace-nowrap">
            <span className="mr-2">{role} |</span>
            <span>{namesText}</span>
        </div>
    );
};

export default ProjectCreditsItem; 