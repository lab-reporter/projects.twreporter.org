import React from 'react';

const BtnLink = ({ href, children = "閱讀完整專題", target = "_blank", className = "" }) => {
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
};

export default BtnLink; 