<script lang="ts">
    import { useQuery } from 'convex-svelte'
    import { api } from '~convex/api'
    import { formatDateTime } from '../lib/utils/date'
    import { p } from '../router'

    const graphList = useQuery(api.graphs.listGraphs, {})
</script>

<div class="home">
    <div class="card">
        <div class="header">
            <h1>Graphs</h1>
            <p>選擇一張圖譜進入編輯器。</p>
        </div>

        {#if graphList.error}
            <div class="message">
                無法載入圖譜列表：{graphList.error.message}
            </div>
        {:else if graphList.isLoading}
            <div class="message">載入圖譜列表中…</div>
        {:else if !graphList.data?.length}
            <div class="message">
                目前沒有圖譜。請先手動建立 Convex 圖譜資料。
            </div>
        {:else}
            <div class="graph-list">
                {#each graphList.data as graph}
                    <a
                        class="item"
                        href={p('/graphs/:graphId', {
                            params: { graphId: graph._id },
                        })}
                    >
                        <div class="main">
                            <h2>{graph.name}</h2>
                            {#if graph.description}
                                <p>{graph.description}</p>
                            {/if}
                        </div>

                        <div class="meta">
                            更新於 {formatDateTime(graph.updatedAt)}
                        </div>
                    </a>
                {/each}
            </div>
        {/if}
    </div>
</div>

<style>
    .home {
        display: flex;
        grid-column: 1 / -1;
        grid-row: 1 / -1;
        min-height: 100dvh;
        width: 100%;
        align-items: center;
        justify-content: center;
        padding: 24px;
        background:
            radial-gradient(
                circle at top,
                rgba(244, 198, 198, 0.3),
                transparent 30%
            ),
            linear-gradient(
                180deg,
                var(--neutral-gray-50),
                var(--neutral-gray-200)
            );
    }

    .home .card {
        width: min(820px, 100%);
        padding: 32px;
        border: 1px solid var(--neutral-gray-300);
        border-radius: 18px;
        background: rgba(255, 255, 255, 0.78);
        box-shadow: 0 18px 40px rgba(64, 64, 64, 0.08);
    }

    .home .header {
        margin-bottom: 18px;
    }

    h1 {
        margin: 0;
        font-family: 'Noto Serif TC', serif;
        font-size: 28px;
        font-weight: 700;
        line-height: 1.1;
    }

    p {
        margin: 10px 0 0;
        color: var(--neutral-gray-700);
        font-size: 14px;
        line-height: 1.5;
    }

    .home .message {
        padding: 16px 18px;
        border: 1px solid var(--neutral-gray-200);
        border-radius: 12px;
        background: rgba(250, 250, 250, 0.9);
        color: var(--neutral-gray-700);
        font-size: 14px;
        line-height: 1.5;
    }

    .graph-list {
        display: grid;
        gap: 12px;
    }

    .graph-list .item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 18px;
        padding: 18px 20px;
        border: 1px solid var(--neutral-gray-200);
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.82);
        color: inherit;
        text-decoration: none;
        transition:
            transform 140ms ease,
            border-color 140ms ease,
            box-shadow 140ms ease;
    }

    .graph-list .item:hover {
        transform: translateY(-1px);
        border-color: var(--neutral-gray-400);
        box-shadow: 0 12px 28px rgba(64, 64, 64, 0.08);
    }

    .graph-list .main {
        min-width: 0;
    }

    h2 {
        margin: 0;
        color: var(--neutral-gray-900);
        font-size: 18px;
        font-weight: 700;
        line-height: 1.3;
    }

    .graph-list .main p {
        margin-top: 6px;
    }

    .graph-list .meta {
        flex: 0 0 auto;
        color: var(--neutral-gray-500);
        font-size: 12px;
        line-height: 1.4;
        white-space: nowrap;
    }
</style>
