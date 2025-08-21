'use client';

import ShareLink from './ShareLink';
import ModalDonate from './ModalDonate';

interface ModalCTAProps {
    onClose?: () => void;
}

export function ModalCTA({ onClose }: ModalCTAProps) {
    return (
        <div className="flex flex-col items-center justify-center space-y-8">
            <ShareLink />
            <ModalDonate onClose={onClose} />
        </div>
    );
}
