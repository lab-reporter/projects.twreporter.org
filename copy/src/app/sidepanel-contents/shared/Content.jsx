import React from 'react';

const Content = ({ children }) => {
    return (
        <div className="px-12 pt-8 max-w-[840px] mx-auto relative">
            {children}
        </div>
    );
};

export default Content; 