<script lang="ts">
  import { get } from "svelte/store"
  import { slide } from 'svelte/transition'
  import SvgIcon from './SvgIcon.svelte'

  let {
    src,
  }: {
    src: string
  } = $props()

  type Proposal = {
    縣市: string
    日期: string
    標題: string
    擇要: string[]
    說明: string[]
    提案人: string[]
  }

  type State = { loading: boolean; error: boolean; data: Proposal[] }

  let state = $state<State>({ loading: true, error: false, data: [] })
  let expandedDesc = $state<Record<number, boolean>>({})
  let expandedProposers = $state<Record<number, boolean>>({})

  $effect(() => {
    state = { loading: true, error: false, data: [] }

    fetch(`${src}?v=1`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data: Proposal[]) => {
        state = { loading: false, error: false, data }
        expandedDesc = Object.fromEntries(data.map((_, i) => [i, false]))
        expandedProposers = Object.fromEntries(data.map((_, i) => [i, false]))
      })
      .catch(() => {
        state = { loading: false, error: true, data: [] }
      })
  })

  function toggleDesc(i: number) {
    expandedDesc[i] = !expandedDesc[i]
  }

  function toggleProposers(i: number) {
    expandedProposers[i] = !expandedProposers[i]
  }

  function getContent(proposal: Proposal): string[] {
    if (proposal.擇要.length > 0) return proposal.擇要
    return proposal.說明
  }
</script>

<div class="embeddings">
  {#if state.loading}
    <img
      src="https://www.twreporter.org/images/spinner-logo.gif"
      alt="Loading..."
      class="loading-spinner"
    />
  {:else if state.error}
    <p class="error">資料載入失敗</p>
  {:else}
    {#each state.data as proposal, i}
      <div class="card">
        <div class="card-header">
          <div class="section council">{proposal.縣市}議案</div>
          <div class="section date">{proposal.日期}</div>
        </div>

        <div class="section main">
          <h2 class="card-title">{proposal.標題}</h2>
          <div class="section brief">
            <div class="section-content">
              {#if expandedDesc[i]}
                {#each getContent(proposal) as paragraph}
                  <p>{paragraph}</p>
                {/each}
              {:else}
                <p>{(getContent(proposal)[0] ?? '').slice(0, 25)}…</p>
              {/if}
            </div>
            <button
              class="toggle-btn"
              onclick={() => toggleDesc(i)}
              aria-label={expandedDesc[i] ? '收合說明' : '展開說明'}
            >
              <SvgIcon name="arrow" expanded={expandedDesc[i]} />
            </button>
          </div>
        </div>

        <div class="section footer">
          <div class="section proposers">
            <div class="section-header">
              <span class="proposers">提案人</span>
              <button
                class="toggle-btn"
                style="color: var(--supportive-main)"
                onclick={() => toggleProposers(i)}
                aria-label={expandedProposers[i] ? '收合提案人' : '展開提案人'}
              >
                <SvgIcon name="cross" expanded={expandedProposers[i]} />
              </button>
            </div>
            {#if expandedProposers[i]}
              <hr transition:slide={{ duration: 200 }} />
              <div class="proposers" transition:slide={{ duration: 200 }}>
                {#each proposal.提案人 as name}
                  <span>{name}</span>
                {/each}
              </div>
            {/if}
          </div>
          <div class="section count">
            <span class="proposer-count">{proposal.提案人.length}</span>
          </div>
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .embeddings {
    display: flex;
    flex-direction: column;
    gap: 16px;
    position: relative;
    min-height: 60px;
  }

  .loading-spinner {
    --size: 60px;
    display: block;
    margin: auto;
    width: var(--size);
    height: var(--size);
  }

  .error {
    color: var(--neutral-gray-500);
    font-size: var(--text-s);
    text-align: center;
    padding: 20px 0;
  }

  .card {
    display: flex;
    flex-direction: column;
  }
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
  div.proposers {
    display: flex;
    flex-wrap: wrap;
    gap: 0px 12px;
  }
  div.proposers span {
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
