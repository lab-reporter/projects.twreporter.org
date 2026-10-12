<script lang="ts">
  import type { ComponentProps } from '@lab-reporter/ddd-shared/components/types.ts'
  import Shell from '@lab-reporter/ddd-shared/components/shared/Shell.svelte'
  import ScrollFade from '@lab-reporter/ddd-shared/components/shared/ScrollFade.svelte'
  import Tooltip from '@lab-reporter/ddd-shared/components/shared/Tooltip.svelte'
  import ChipSelector from '@lab-reporter/ddd-shared/components/shared/ChipSelector.svelte'
  import { createGraphic } from '@lab-reporter/ddd-shared/utils/graphic-data.svelte.ts'
  import { seatingsConfigSchema } from '../lib/components/seatings/types.ts'
  import { buildSeatings } from '../lib/components/seatings/data.ts'

  const props: ComponentProps = $props()
  const graphic = createGraphic(
    'twreporter-seatings',
    seatingsConfigSchema,
    () => props,
  )
  const config = $derived(graphic.config)
  const chart = $derived.by(() => {
    if (!graphic.csv || !config) return { data: undefined, error: undefined }
    try {
      return { data: buildSeatings(graphic.csv, config), error: undefined }
    } catch (error) {
      return {
        data: undefined,
        error: error instanceof Error ? error.message : '資料格式錯誤。',
      }
    }
  })
  let selectedCategory: string | undefined = $state()
  const category = $derived(
    chart.data?.categories.find(
      (category) => category.value === selectedCategory,
    )?.value,
  )
</script>

{#if config && chart.data}
  <Shell
    bind:title={config.title}
    bind:subtitle={config.subtitle}
    bind:footnotes={config.footnotes}
    wide={config.wide}
    backdrop={config.backdrop}
    editable={graphic.editable}
    empty={!chart.data.rows.length}
    emptyMessage="資料中沒有席次。"
  >
    <ChipSelector
      options={chart.data.categories}
      value={category}
      label="類別圖例"
      variant="selector"
      onchange={(value) => {
        selectedCategory = category === value ? undefined : value
      }}
    />
    <div class="seating-sections">
      {#each chart.data.groups as group}
        <section aria-label={group.label}>
          <div class="section-heading">
            <h2>{group.label}</h2>
            <span
              >{group.count} 人{#if config.focusCategory}｜<strong
                  >{chart.data.categories.find(
                    (category) => category.value === config.focusCategory,
                  )?.label ?? config.focusCategory}
                  {group.focusCount} 席</strong
                >｜占 {group.focusPercent}%{/if}</span
            >
          </div>
          <ScrollFade>
            <div class="track" style:min-width={group.count * 26 + 'px'}>
              {#each group.sections as section}
                <div
                  class="category"
                  style:flex={section.seats.length}
                  class:dim={category && category !== section.category.value}
                >
                  <div
                    class="seats"
                    style:grid-template-columns={'repeat(' +
                      section.seats.length +
                      ', minmax(0, 1fr))'}
                  >
                    {#each section.seats as seat}
                      <Tooltip variant="light">
                        {#snippet children()}
                          <button
                            type="button"
                            class="seat"
                            style:background={section.category.color}
                            style:color={section.category.textColor}
                            aria-label={`${seat.label}，${seat.category}，${seat.group}${seat.description ? '，' + seat.description : ''}`}
                          >
                            <span>{seat.label}</span>
                          </button>
                        {/snippet}
                        {#snippet content()}
                          <div class="popup">
                            <div class="popup-header">
                              <strong>{seat.label}</strong>
                              {#if seat.description}<p>
                                  {seat.description}
                                </p>{/if}
                            </div>
                            <div class="popup-body">
                              <p class="popup-meta">
                                <span>{seat.category}</span>
                                <span
                                  >{chart.data?.rows
                                    .filter((row) => row.label === seat.label)
                                    .map((row) => row.group)
                                    .join('、')}</span
                                >
                              </p>
                            </div>
                          </div>
                        {/snippet}
                      </Tooltip>
                    {/each}
                  </div>
                  <div class="category-label" title={section.category.label}>
                    <b>{section.seats.length}</b>
                    {section.category.label}
                  </div>
                </div>
              {/each}
            </div>
          </ScrollFade>
        </section>
      {/each}
    </div>
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
  :global(.selector .swatch) {
    display: none;
  }
  .dim {
    opacity: 0.25;
    transition: opacity 0.2s;
  }
  .seating-sections {
    display: grid;
    gap: 14px;
  }
  .seating-sections section {
    min-width: 0;
  }
  .section-heading {
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 10px;
    margin-bottom: 6px;
  }
  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 700;
  }
  .section-heading > span {
    font-size: 13px;
    color: var(--neutral-gray-600);
  }
  .section-heading strong {
    color: var(--neutral-gray-800);
  }
  .track {
    display: flex;
    gap: 3px;
  }
  .category {
    min-width: 0;
  }
  .seats {
    display: grid;
    gap: 3px;
  }
  .seat {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 70px;
    padding: 0;
    border: 0;
    border-radius: 3px;
  }
  .seat span {
    writing-mode: vertical-rl;
    text-orientation: upright;
    letter-spacing: 2px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
    color: inherit;
  }
  .category-label {
    overflow: hidden;
    margin-top: 9px;
    padding-top: 4px;
    border-top: 2px solid var(--neutral-gray-300);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
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
  .popup-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .popup-meta span + span {
    padding-left: 8px;
    border-left: 1px solid var(--neutral-gray-200);
  }
  p {
    margin: 4px 0 0;
  }
  @media (max-width: 600px) {
    :global(.selector button) {
      padding: 6px 9px;
      gap: 4px;
    }
    .seat {
      height: 68px;
    }
    h2 {
      font-size: 18px;
    }
  }
</style>
