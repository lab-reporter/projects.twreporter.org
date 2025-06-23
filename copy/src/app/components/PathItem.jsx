"use client";

import PathItemTitle from './PathItemTitle';

const PathItem = ({ title, children, onTitleClick }) => {
    return (
        <div className="relative w-screen flex-1 flex flex-col justify-center items-center challenge">
            {title ? (
                <PathItemTitle title={title} onClick={() => onTitleClick(title)} />
            ) : children}
        </div>
    );
};

export default PathItem; 