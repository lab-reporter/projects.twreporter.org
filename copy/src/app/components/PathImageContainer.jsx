"use client";

import { forwardRef } from 'react';

const PathImageContainer = forwardRef((props, ref) => {
    return (
        <div
            ref={ref}
            style={{ transformStyle: 'preserve-3d', perspective: '2000px' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] -z-10"
        />
    );
});

PathImageContainer.displayName = 'PathImageContainer';

export default PathImageContainer; 