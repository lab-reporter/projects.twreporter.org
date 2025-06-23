import React from 'react';
import BtnPrevious from './BtnPrevious';
import BtnNext from './BtnNext';

const BtnNavigation = ({
    currentProjectId,
    onNavigate,
    setSelectedProject,
    setSidePanelContent,
    className = ""
}) => {
    return (
        <div className={`w-full flex justify-between px-8 gap-4 my-8 ${className}`}>
            <BtnPrevious
                currentProjectId={currentProjectId}
                onNavigate={onNavigate}
                setSelectedProject={setSelectedProject}
                setSidePanelContent={setSidePanelContent}
            />
            <div className='px-8 py-2 bg-white border-[1px] border-gray-300 transition-colors duration-300 hover:bg-gray-700 hover:text-white'>回到首頁</div>
            <BtnNext
                currentProjectId={currentProjectId}
                onNavigate={onNavigate}
                setSelectedProject={setSelectedProject}
                setSidePanelContent={setSidePanelContent}
            />
        </div>
    );
};

export default BtnNavigation; 