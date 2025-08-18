import { useEffect } from 'react';
import { useStore } from '@/stores';

/**
 * useSupporterData - 支持者數據載入 Hook
 * 
 * 模擬從 API 載入支持者數據並更新到 store
 * 在實際應用中，這裡會呼叫真實的 API
 */
export function useSupporterData() {
    const setSupporterCount = useStore((state) => state.setSupporterCount);
    const setDataLoading = useStore((state) => state.setDataLoading);
    const setDataError = useStore((state) => state.setDataError);

    useEffect(() => {
        const fetchSupporterData = async () => {
            try {
                setDataLoading(true);
                setDataError(null);

                // 模擬 API 呼叫延遲
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 模擬從 API 獲取的數據
                // 在實際應用中，這會是真實的 API 呼叫
                // const response = await fetch('/api/supporters');
                // const data = await response.json();
                // const count = data.supporterCount;

                // 模擬 API 回傳的支持者數量
                const mockApiResponse = {
                    supporterCount: 8165, // 這個數字會從真實 API 獲取
                    timestamp: new Date().toISOString()
                };

                // 更新 store 中的支持者數量
                setSupporterCount(mockApiResponse.supporterCount);

                if (process.env.NODE_ENV === 'development') {
                    console.log('支持者數據載入完成:', mockApiResponse);
                }

            } catch (error) {
                console.error('載入支持者數據時發生錯誤:', error);
                setDataError('無法載入支持者數據');
            } finally {
                setDataLoading(false);
            }
        };

        // 執行數據載入
        fetchSupporterData();
    }, [setSupporterCount, setDataLoading, setDataError]); // 移除 supporterCount 依賴

    return {
        // 可以回傳載入狀態供組件使用
        isLoading: useStore((state) => state.isDataLoading),
        error: useStore((state) => state.dataError),
    };
}
