import { useEffect, useState } from 'react';
import { useStore, StoreState } from '@/stores';

/**
 * SSR 安全的 store hook
 * 避免 hydration mismatch 問題
 */
export function useStoreSSR<T>(selector: (state: StoreState) => T, defaultValue: T): T {
    const [isClient, setIsClient] = useState(false);
    const storeValue = useStore(selector);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // 在 SSR 期間回傳預設值，在客戶端回傳實際的 store 值
    return isClient ? storeValue : defaultValue;
}
