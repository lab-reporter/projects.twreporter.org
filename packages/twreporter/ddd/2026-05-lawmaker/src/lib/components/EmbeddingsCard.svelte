<script lang="ts">
  import { slide } from 'svelte/transition'
  import SvgIcon from './SvgIcon.svelte'
  import type { Proposal } from '../constants/embeddings'

  let {
    card,
  }: {
    card: Proposal
  } = $props()

  let expandedDesc = $state(false)
  let expandedProposers = $state(false)

  const content = $derived(card.擇要.length > 0 ? card.擇要 : card.說明)
</script>

<div class="card-header">
  <div class="section council">{card.縣市}議案</div>
  <div class="section date">{card.日期}</div>
</div>
<div class="section main">
  <h2 class="card-title">{card.標題}</h2>
  <div class="section brief">
    <div class="section-content">
      {#if expandedDesc}
        {#each content as paragraph}
          <p>{paragraph}</p>
        {/each}
      {:else}
        <p>{(content[0] ?? '').slice(0, 25)}…</p>
      {/if}
    </div>
    <button
      class="toggle-btn"
      onclick={() => (expandedDesc = !expandedDesc)}
      aria-label={expandedDesc ? '收合說明' : '展開說明'}
    >
      <SvgIcon name="arrow" expanded={expandedDesc} />
    </button>
  </div>
</div>
<div class="section footer">
  <div class="section proposers">
    <div class="section-header">
      <span class="proposers-header">提案人</span>
      <button
        class="toggle-btn"
        style="color: var(--supportive-heavy);"
        onclick={() => (expandedProposers = !expandedProposers)}
        aria-label={expandedProposers ? '收合提案人' : '展開提案人'}
      >
        <SvgIcon name="cross" expanded={expandedProposers} />
      </button>
    </div>
    {#if expandedProposers}
      <hr transition:slide={{ duration: 200 }} />
      <div class="proposers-name" transition:slide={{ duration: 200 }}>
        {#each card.提案人 as name}
          <span>{name}</span>
        {/each}
      </div>
    {/if}
  </div>
  <div class="section count">
    <span class="proposer-count">{card.提案人.length}</span>
  </div>
</div>

<style>
  .section {
    font-size: var(--text-s);
    color: var(--neutral-gray-800);
    padding: 10px 20px;
    border: 1px solid var(--neutral-gray-200);
  }
  .card-header {
    display: grid;
    grid-template-columns: 1fr auto;
    align-items: stretch;
    background-color: var(--neutral-gray-50);
  }
  .council {
    font-weight: 700;
    border-radius: 4px 0 0 0;
    font-family: 'Roboto Slab', 'Noto Serif TC', serif;
    border-width: 1px 0 1px 1px;
  }
  .date {
    font-size: var(--text-s);
    color: var(--neutral-gray-500);
    border-radius: 0 4px 0 0;
  }

  .section.main {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px 20px 20px 20px;
    background-color: var(--neutral-gray-50);
    border-width: 0 1px 1px 1px;
  }
  .card-title {
    font-size: var(--text-xl);
    font-weight: 700;
    color: var(--neutral-gray-900);
    line-height: 1.5;
    font-family: 'Roboto Slab', 'Noto Serif TC', serif;
  }
  .section.brief {
    display: grid;
    grid-template-columns: 1fr auto;
    background-color: var(--neutral-gray-100);
    border-width: 0;
    border-radius: 4px;
    padding: 10px 18px;
    gap: 5px;
  }
  .section-content {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  .section-content p {
    font-size: var(--text-s);
    color: var(--neutral-gray-700);
    line-height: 1.7;
  }

  .section.footer {
    display: flex;
    align-items: center;
    gap: 0px;
    padding: 0;
    border-width: 0;
  }
  .section.proposers {
    display: flex;
    flex-direction: column;
    background-color: var(--neutral-gray-50);
    border-radius: 0 0 4px 4px;
    padding: 10px 20px;
    gap: 7px;
    border-width: 0 1px 1px 1px;
  }
  .section-header {
    display: flex;
    align-items: center;
    font-weight: 500;
    color: var(--supportive-heavy);
    gap: 5px;
  }
  hr {
    border: none;
    border-top: 1.5px solid var(--supportive-main);
    margin: 0;
  }
  div.proposers-name {
    display: flex;
    flex-wrap: wrap;
    gap: 0px 12px;
  }
  div.proposers-name span {
    font-size: var(--text-s);
    color: var(--supportive-main);
    line-height: 1.7;
  }
  .section.count {
    font-size: var(--text-xs);
    color: var(--supportive-heavy);
    background-color: var(--neutral-gray-50);
    border-radius: 0 0 4px 0;
    padding: 10px;
    align-self: start;
    border-width: 0 1px 1px 0;
  }
  .proposer-count {
    font-size: var(--text-xs);
  }

  .toggle-btn {
    margin-left: auto;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    opacity: 0.8;
    color: var(--neutral-gray-500);
  }
  .toggle-btn:hover {
    opacity: 1;
    color: var(--neutral-gray-700);
    transition: all 0.2s ease;
  }
</style>
