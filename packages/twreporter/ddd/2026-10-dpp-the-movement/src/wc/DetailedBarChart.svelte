<script lang="ts">
  import type { ComponentProps } from '@lab-reporter/ddd-shared/components/types.ts'
  import Shell from '@lab-reporter/ddd-shared/components/shared/Shell.svelte'
  import Tooltip from '@lab-reporter/ddd-shared/components/shared/Tooltip.svelte'
  import ChipSelector from '@lab-reporter/ddd-shared/components/shared/ChipSelector.svelte'
  import { createGraphic } from '@lab-reporter/ddd-shared/utils/graphic-data.svelte.ts'
  import { detailedBarChartConfigSchema } from '../lib/components/detailed-bar-chart/types.ts'
  import { buildDetailedBarChart } from '../lib/components/detailed-bar-chart/data.ts'

  const props: ComponentProps = $props()
  const graphic = createGraphic(
    'twreporter-detailed-bar-chart',
    detailedBarChartConfigSchema,
    () => props,
  )
  const config = $derived(graphic.config)
  const chart = $derived.by(() => {
    if (!graphic.csv || !config) return { data: undefined, error: undefined }
    try {
      return {
        data: buildDetailedBarChart(graphic.csv, config),
        error: undefined,
      }
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : '資料格式錯誤。',
      }
    }
  })
  let selectedFilter: string | undefined = $state()
  let selectedGroup: string | undefined = $state()
  const filters = $derived(
    chart.data?.filters
      .slice()
      .sort((a, b) => Number(b.value === '台中') - Number(a.value === '台中')),
  )
  const filter = $derived(
    filters?.find((filter) => filter.value === selectedFilter) ?? filters?.[0],
  )
  const group = $derived(
    filter?.groups.find((group) => group.value === selectedGroup) ??
      filter?.groups[0],
  )
  const donations = $derived(group?.donations ?? [])
  const visibleSections = $derived(
    (filter?.sections ?? [])
      .map((section) => ({
        ...section,
        candidates: section.candidates
          .filter((candidate) =>
            candidate.donations.some(
              (row) => row.highlighted || row.group === group?.value,
            ),
          )
          .sort(
            (a, b) =>
              Number(b.donations.some((row) => row.highlighted)) -
              Number(a.donations.some((row) => row.highlighted)),
          ),
      }))
      .filter((section) => section.candidates.length),
  )
  const total = $derived(donations.reduce((sum, row) => sum + row.amount, 0))
  const highlighted = $derived(
    donations
      .filter((row) => row.highlighted)
      .reduce((sum, row) => sum + row.amount, 0),
  )
  const percent = $derived(total ? (highlighted / total) * 100 : 0)
  const otherRows = $derived(donations.filter((row) => !row.highlighted))
  const breakdown = $derived(
    [...new Set(otherRows.map((row) => row.breakdown))]
      .map((label) => ({
        label,
        amount: otherRows
          .filter((row) => row.breakdown === label)
          .reduce((sum, row) => sum + row.amount, 0),
      }))
      .sort((a, b) => b.amount - a.amount),
  )
  const numberFormat = new Intl.NumberFormat('zh-TW', {
    maximumFractionDigits: 1,
  })
</script>

{#snippet amount(value: number)}{numberFormat.format(value / 10000)}
  萬元{/snippet}

{#snippet details(records: NonNullable<typeof group>['donations'])}
  <table class="detail-table">
    <thead><tr><th>企業／集團</th><th>明細</th><th>金額</th></tr></thead>
    <tbody>
      {#each records as record}
        <tr
          ><td
            >{filter?.groups.find((group) => group.value === record.group)
              ?.label ?? record.group}</td
          ><td>{record.detail}</td><td class="number"
            >{@render amount(record.amount)}</td
          ></tr
        >
      {/each}
    </tbody>
  </table>
{/snippet}

{#if config && chart.data && filter}
  <Shell
    bind:title={config.title}
    bind:subtitle={config.subtitle}
    bind:footnotes={config.footnotes}
    wide={config.wide}
    backdrop={config.backdrop}
    editable={graphic.editable}
    empty={!filter.groups.length}
    emptyMessage="此範圍沒有捐款資料。"
  >
    {#if filter.groups.length}
      {#if chart.data.filters.length > 1 || filter.groups.length > 1}<div
          class="selectors"
          style:--highlight={config.highlight.color}
        >
          {#if chart.data.filters.length > 1}<div
              class="filters"
              aria-label="資料篩選"
            >
              {#each filters ?? [] as item}
                <button
                  type="button"
                  class:active={filter.value === item.value}
                  aria-pressed={filter.value === item.value}
                  onclick={() => {
                    selectedFilter = item.value
                    selectedGroup = undefined
                  }}>{item.label}</button
                >
              {/each}
            </div>{/if}
          {#if filter.groups.length > 1}<ChipSelector
              options={filter.groups.map((item) => ({
                value: item.value,
                label: item.label,
                count: item.recipients.size,
              }))}
              value={group?.value}
              label="企業／集團"
              variant="selector"
              countUnit="位"
              countColor={config.highlight.color}
              onchange={(value) => {
                selectedGroup = value
              }}
            />{/if}
        </div>{/if}
      <div class="chart-group" aria-label="捐款圖表">
        <div
          class="bars"
          style:--highlight={config.highlight.color}
          style:--remainder={config.remainder.color}
        >
          <div class="bar-heading">
            <strong>{group?.label}</strong><span
              >{filter.label ? `在${filter.label}` : ''}捐款 {@render amount(
                total,
              )}</span
            >
          </div>
          <div
            class="stack"
            role="img"
            aria-label={`${config.highlight.label} ${Math.round(percent)}%，${config.remainder.label} ${Math.round(100 - percent)}%`}
          >
            {#if highlighted > 0}<div class="key" style:width={percent + '%'}>
                <span>{Math.round(percent)}%</span>
              </div>{/if}
            {#if total - highlighted > 0}<div
                class="other"
                style:width={100 - percent + '%'}
              >
                <span>{Math.round(100 - percent)}%</span>
              </div>{/if}
          </div>
          <div class="stack-labels">
            <span class="key-label"
              >{config.highlight.label}
              <b>{@render amount(highlighted)}</b></span
            >
            <Tooltip variant="light">
              {#snippet children()}<button type="button" class="breakdown-label"
                  >{config.remainder.label}
                  <b>{@render amount(total - highlighted)}</b></button
                >{/snippet}
              {#snippet content()}
                <div class="popup breakdown-popup">
                  <div class="popup-header">
                    <strong>{config.remainder.label}</strong>
                  </div>
                  <div class="popup-body breakdown-body">
                    {#if breakdown.length}{#each breakdown as item}<div
                          class="breakdown-row"
                        >
                          <span>{item.label}</span><b
                            >{@render amount(item.amount)}</b
                          >
                        </div>{/each}{:else}<p>
                        目前資料沒有此類別的紀錄。
                      </p>{/if}
                  </div>
                </div>
              {/snippet}
            </Tooltip>
          </div>
          {#each config.descriptions.filter((note) => note.group === group?.value && note.filter === filter.value) as note}
            <p class="bar-description">{note.text}</p>
          {/each}
        </div>
        <div
          class="roster-sections"
          class:compact={['台中', '高雄'].includes(filter.value ?? '')}
          class:split={config['layout-direction'] === 'horizontal' &&
            visibleSections.length > 1}
        >
          {#each visibleSections
            .slice()
            .sort((a, b) => Number(b.label === '市長與立委') - Number(a.label === '市長與立委')) as section}
            <section
              aria-label={section.label || '捐款名單'}
              class:leaders={section.label === '立委與首長' ||
                section.label === '市長與立委'}
            >
              {#if section.label}<h3>{section.label}</h3>{/if}
              <div class="roster" style:--highlight={config.highlight.color}>
                {#each section.candidates as item}
                  {@const records = item.donations.filter(
                    (row) => row.group === group?.value,
                  )}
                  {@const sum = records.reduce(
                    (sum, row) => sum + row.amount,
                    0,
                  )}
                  <Tooltip variant="light">
                    {#snippet children()}
                      <button
                        type="button"
                        class="card"
                        class:on={sum > 0 &&
                          records.some((row) => row.highlighted)}
                        class:nonmember={sum > 0 &&
                          !records.some((row) => row.highlighted)}
                        class:off={sum === 0}
                        aria-label={`${item.label}，${item.descriptions.join('、')}，${numberFormat.format(sum / 10000)} 萬元`}
                      >
                        <strong>{item.label}</strong>
                        <span class="description"
                          >{item.details.join(' · ') ||
                            item.descriptions.join(' · ')}</span
                        >
                        <span class="amount"
                          >{#if sum > 0}{@render amount(sum)}{:else}—{/if}</span
                        >
                      </button>
                    {/snippet}
                    {#snippet content()}
                      <div class="popup">
                        <div class="popup-header">
                          <strong>{item.label}</strong>
                          <p>{item.descriptions.join('、')}</p>
                        </div>
                        <div class="popup-body">
                          {#if records.length}{@render details(
                              records.slice(0, 10),
                            )}
                            {#if records.length > 10}<p>
                                另有 {records.length - 10} 筆明細。
                              </p>{/if}
                          {:else}<p>沒有收到所選企業的捐款。</p>{/if}
                        </div>
                      </div>
                    {/snippet}
                  </Tooltip>
                {/each}
              </div>
            </section>
          {/each}
        </div>
      </div>
      {#if !visibleSections.length}<p class="empty" role="status">
          此範圍沒有符合卡片篩選條件的名單。
        </p>{/if}
    {:else}
      <p class="empty" role="status">此範圍沒有捐款資料。</p>
    {/if}
  </Shell>
{:else}
  <Shell error={chart.error ?? graphic.error} loading={graphic.loading} empty />
{/if}

<style>
  button {
    font: inherit;
    cursor: pointer;
  }
  button:focus-visible {
    outline: 2px solid var(--brand-main);
    outline-offset: 3px;
  }
  .filters {
    display: flex;
    width: 100%;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 6px;
    overflow: hidden;
    background: var(--neutral-white);
  }
  .filters button {
    flex: 1;
    padding: 7px 16px;
    border: 0;
    background: transparent;
    font-size: 14px;
    transition: all 0.25s;
  }
  .filters button:hover {
    background: var(--neutral-gray-50);
  }
  .filters button.active {
    background: var(--highlight);
    color: var(--neutral-white);
  }
  .selectors {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
  }
  .selectors :global(.selector button.active) {
    border-color: var(--highlight);
    background: var(--highlight);
  }
  .selectors :global(.selector button.active .count) {
    background: var(--chart-mint-1);
    color: var(--highlight);
  }
  .selectors :global(.selector button:focus-visible) {
    outline-color: var(--highlight);
  }
  .chart-group {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .bars {
    min-width: 0;
    padding: 15px 17px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 8px;
    background: var(--neutral-white);
  }
  .bar-heading {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 10px;
    font-size: 15px;
  }
  .bar-heading > span {
    color: var(--neutral-gray-600);
    font-size: 13px;
  }
  .stack {
    display: flex;
    height: 30px;
    overflow: hidden;
    border-radius: 4px;
  }
  .key,
  .other {
    display: flex;
    align-items: center;
    min-width: 0;
    overflow: hidden;
    transition: width 0.3s;
    font-size: 13px;
  }
  .key {
    justify-content: flex-end;
    background: var(--highlight);
    color: var(--neutral-white);
  }
  .key span,
  .other span {
    padding: 0 8px;
    color: inherit;
    white-space: nowrap;
  }
  .other {
    background: var(--remainder);
  }
  .stack-labels {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 6px;
    font-size: 13px;
  }
  .key-label {
    color: var(--highlight);
  }
  .bar-description {
    margin-top: 10px;
    color: var(--neutral-gray-600);
    font-size: 12px;
    white-space: pre-line;
  }
  .breakdown-label {
    padding: 0;
    border: 0;
    background: transparent;
    font-size: inherit;
    color: var(--neutral-gray-600);
    text-align: right;
  }
  .roster-sections {
    display: grid;
    gap: 14px;
  }
  .roster-sections.split {
    display: flex;
    gap: 0;
  }
  .roster-sections.split section {
    flex: 1;
    min-width: 0;
  }
  .roster-sections.split section:first-child {
    flex: 0 1 auto;
    padding-right: 12px;
  }
  .roster-sections.split section + section {
    padding-left: 12px;
    border-left: 1px solid var(--neutral-gray-200);
  }
  .roster-sections.split section:first-child .roster {
    grid-template-columns: 1fr;
  }
  .roster-sections.split section.leaders .roster {
    grid-template-rows: repeat(3, minmax(85px, auto));
    grid-auto-columns: minmax(118px, 1fr);
    grid-auto-flow: column;
  }
  .roster-sections.compact.split {
    display: grid;
    grid-template-columns: minmax(0, 2fr) minmax(0, 5fr);
    align-items: start;
  }
  .roster-sections.compact.split section .roster {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
  .roster-sections.compact.split section.leaders .roster {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    grid-template-rows: none;
    grid-auto-flow: row;
  }
  .roster-sections.compact .card {
    box-sizing: border-box;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .roster-sections.compact .description {
    min-width: 0;
  }
  h3 {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--neutral-gray-600);
  }
  .roster {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
    gap: 7px;
  }
  .card {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    min-height: 85px;
    padding: 7px 11px 10px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 6px;
    background: var(--neutral-white);
    text-align: left;
    transition: all 0.2s;
  }
  .card strong {
    font-size: 16px;
    line-height: 21px;
    color: inherit;
    font-weight: 500;
  }
  .description {
    margin-top: 2px;
    min-width: 108px;
    font-size: 11px;
    line-height: 16.5px;
    color: var(--neutral-gray-600);
    font-weight: 500;
  }
  .amount {
    margin-top: auto;
    padding-top: 0;
    font-size: 14px;
    font-variant-numeric: tabular-nums;
    color: inherit;
  }
  .card.on {
    color: var(--neutral-white);
  }
  .card.on {
    background: var(--highlight);
    border-color: var(--highlight);
  }
  .card.on .description {
    color: var(--chart-mint-1);
  }
  .card.off {
    opacity: 0.5;
  }
  .card.nonmember {
    background: var(--neutral-gray-200);
    border-color: var(--neutral-gray-300);
  }
  .card.nonmember {
    color: var(--neutral-gray-700);
  }
  .card.nonmember .description {
    color: var(--neutral-gray-600);
  }
  .detail-table {
    border-collapse: collapse;
    font-size: 12px;
    line-height: 19.2px;
  }
  .detail-table th,
  .detail-table td {
    padding: 0;
    text-align: left;
    vertical-align: top;
  }
  .detail-table th {
    border-bottom: 1px solid var(--neutral-gray-200);
    color: var(--neutral-gray-600);
    font-weight: 700;
    padding-bottom: 4px;
  }
  .detail-table th:first-child,
  .detail-table td:first-child {
    min-width: 60px;
    padding-right: 10px;
  }
  .detail-table th:first-child {
    white-space: nowrap;
  }
  .detail-table th + th,
  .detail-table td + td {
    padding-left: 10px;
    border-left: 1px solid var(--neutral-gray-200);
  }
  .detail-table th:nth-child(2),
  .detail-table td:nth-child(2) {
    min-width: 54px;
    padding-right: 10px;
  }
  .detail-table th:nth-child(3),
  .detail-table td:nth-child(3) {
    min-width: 48px;
    padding-right: 8px;
  }
  .detail-table td.number {
    text-align: right;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
  .popup-header {
    padding: 10px 12px 7px;
    border-bottom: 1px solid var(--neutral-gray-200);
  }
  .popup-header strong {
    display: block;
    font-size: 16px;
    line-height: 20.8px;
  }
  .popup-header p {
    margin: 1px 0 0;
    color: var(--neutral-gray-600);
    font-size: 13px;
    line-height: 20.8px;
  }
  .popup-body {
    padding: 7px 12px 10px;
  }
  .popup-body p {
    margin: 0;
    font-size: 13px;
    line-height: 20.8px;
  }
  .breakdown-body {
    display: grid;
    gap: 2px;
  }
  .breakdown-row {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px;
    font-size: 13px;
    line-height: 20.8px;
  }
  .breakdown-row b {
    padding-left: 10px;
    border-left: 1px solid var(--neutral-gray-200);
    font-weight: 400;
    font-variant-numeric: tabular-nums;
  }
  p {
    margin: 4px 0 0;
  }
  .empty {
    font-size: 14px;
  }
  @media (max-width: 940px) {
    .roster-sections.compact.split {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .roster-sections.compact.split section:first-child {
      padding-right: 0;
    }
    .roster-sections.compact.split section + section {
      padding: 14px 0 0;
      border-top: 1px solid var(--neutral-gray-200);
      border-left: 0;
    }
    .roster-sections.compact.split section .roster {
      grid-template-columns: repeat(auto-fill, minmax(118px, 1fr));
    }
  }
  @media (max-width: 600px) {
    .roster-sections.compact.split {
      grid-template-columns: minmax(0, 1fr);
      gap: 14px;
    }
    .roster-sections.compact.split section:first-child {
      padding-right: 0;
    }
    .roster-sections.compact.split section .roster {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
    .roster-sections.split {
      display: grid;
      gap: 14px;
    }
    .roster-sections.split section:first-child {
      flex-basis: auto;
    }
    .roster-sections.split section + section {
      padding: 14px 0 0;
      border-top: 1px solid var(--neutral-gray-200);
      border-left: 0;
    }
    .roster {
      grid-template-columns: repeat(auto-fill, minmax(96px, 1fr));
    }
    .roster-sections.split section.leaders .roster {
      grid-auto-columns: minmax(96px, 1fr);
    }
  }
</style>
