'use client';

import ShareLink from './ShareLink';
import ModalDonate from './ModalDonate';

interface ModalCTAProps {
    onClose?: () => void;
}

export function ModalCTA({ onClose }: ModalCTAProps) {
    return (
        <div className="flex flex-col items-center justify-center py-12 gap-8">
            <ModalDonate onClose={onClose || (() => { })} />
            <ShareLink />
        </div>
    );
}
