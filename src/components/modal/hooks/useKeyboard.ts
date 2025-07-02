import { useEffect } from 'react';
import { useStore } from '@/stores';

export const useKeyboard = () => {
    const { modal, closeModal } = useStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && modal.isOpen) {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [modal.isOpen, closeModal]);
}; 