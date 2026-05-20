<script lang="ts">
    const { name, table }: { name?: string; table: string[][] } = $props();
</script>

<table>
    {#if name}
        <caption>{name}</caption>
    {/if}
    <thead
        ><tr
            >{#each table[0] as title}
                <th>{title}</th>
            {/each}</tr
        ></thead
    >
    <tbody>
        {#each table.slice(1) as row}
            <tr>
                {#each row as cell}
                    <td>{cell}</td>
                {/each}
            </tr>
        {/each}
    </tbody>
</table>

<style>
    * {
        --text-size: var(--text-s);
    }

    @media (max-width: 400px) {
        * {
            --text-size: var(--text-xs);
        }
    }

    caption {
        font-size: var(--text-size);
        font-weight: 700;
        color: var(--neutral-gray-800);
        text-align: center;
        padding: 6px;
        border: 1px solid var(--neutral-gray-200);
        background-color: var(--neutral-gray-200);
        border-radius: 2px 2px 0 0;
    }

    table {
        width: 100%;
        border-collapse: collapse;
        font-size: var(--text-size);
        border-radius: 2px;
        border: 1px solid var(--neutral-gray-200);
    }

    thead tr {
        border-bottom: 1px solid var(--neutral-gray-200);
        background-color: var(--neutral-gray-100);
    }

    tbody tr {
        border-bottom: 1px solid var(--neutral-gray-200);
    }

    tbody tr:last-child {
        border-bottom: none;
    }

    th,
    td {
        padding: 8px 12px;
        vertical-align: middle;
        text-align: center;
        border-right: 1px solid var(--neutral-gray-200);
    }

    @media (max-width: 400px) {
        th,
        td {
            padding: 2px 0;
        }

        caption {
            padding: 3px;
        }
    }

    th:last-child,
    td:last-child {
        border-right: none;
    }

    th {
        font-weight: 700;
        color: var(--neutral-gray-800);
        white-space: nowrap;
    }

    td {
        color: var(--neutral-gray-700);
    }

    tbody tr:hover td {
        background-color: var(--neutral-gray-50);
    }
</style>
