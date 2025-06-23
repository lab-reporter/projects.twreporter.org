import React from 'react';

const Container = ({ children }) => {
    return (
        <div className="w-full min-h-full">
            {children}
        </div>
    );
};

export default Container; 