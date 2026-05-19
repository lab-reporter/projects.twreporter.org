<script lang="ts">
  import { slide, fade, fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
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

  type Card = Proposal & { _key: number }

  type State = { loading: boolean; error: boolean }

  let loadState = $state<State>({ loading: true, error: false })
  let cards = $state<Card[]>([])
  let expandedDesc = $state<Record<number, boolean>>({})
  let expandedProposers = $state<Record<number, boolean>>({})
  let cycleTimer: ReturnType<typeof setInterval> | null = null
  let paused = $state(false)

  $effect(() => {
    loadState = { loading: true, error: false }
    cards = []
    if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null }

    fetch(`${src}?v=1`)
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then((data: Proposal[]) => {
        loadState = { loading: false, error: false }
        cards = data.map((p, i) => ({ ...p, _key: i }))
        expandedDesc = Object.fromEntries(data.map((_, i) => [i, false]))
        expandedProposers = Object.fromEntries(data.map((_, i) => [i, false]))
        if (cards.length >= 2) cycleTimer = setInterval(cycle, 5000)
      })
      .catch(() => {
        loadState = { loading: false, error: true }
      })

    return () => {
      if (cycleTimer) { clearInterval(cycleTimer); cycleTimer = null }
    }
  })

  function cycle() {
    if (paused) return
    const top = cards.shift()
    if (!top) return
    setTimeout(() => cards.push(top), 0)
  }

  function toggleDesc(key: number) {
    expandedDesc[key] = !expandedDesc[key]
  }

  function toggleProposers(key: number) {
    expandedProposers[key] = !expandedProposers[key]
  }

  function getContent(card: Card): string[] {
    if (card.擇要.length > 0) return card.擇要
    return card.說明
  }
</script>

<div class="embeddings">
  {#if loadState.loading}
    <img
      src="https://www.twreporter.org/images/spinner-logo.gif"
      alt="Loading..."
      class="loading-spinner"
    />
  {:else if loadState.error}
    <p class="error">資料載入失敗</p>
  {:else}
    <div class="card-stack">
      {#each cards as card, i (card._key)}
        <div
          class="card"
          style="--i: {i}; z-index: {cards.length - i}"
          animate:flip={{ duration: 400 }}
          in:fade={{ duration: 300, delay: 450 }}
          out:fly={{ x: 60, duration: 400 }}
        >
          <div class="card-header">
            <div class="section council">{card.縣市}議案</div>
            <div class="section date">{card.日期}</div>
          </div>
          <div class="section main">
            <h2 class="card-title">{card.標題}</h2>
            <div class="section brief">
              <div class="section-content">
                {#if expandedDesc[card._key]}
                  {#each getContent(card) as paragraph}
                    <p>{paragraph}</p>
                  {/each}
                {:else}
                  <p>{(getContent(card)[0] ?? '').slice(0, 25)}…</p>
                {/if}
              </div>
              <button
                class="toggle-btn"
                onclick={() => toggleDesc(card._key)}
                aria-label={expandedDesc[card._key] ? '收合說明' : '展開說明'}
              >
                <SvgIcon name="arrow" expanded={expandedDesc[card._key]} />
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
                  onclick={() => toggleProposers(card._key)}
                  aria-label={expandedProposers[card._key]
                    ? '收合提案人'
                    : '展開提案人'}
                >
                  <SvgIcon name="cross" expanded={expandedProposers[card._key]} />
                </button>
              </div>
              {#if expandedProposers[card._key]}
                <hr transition:slide={{ duration: 200 }} />
                <div
                  class="proposers-name"
                  transition:slide={{ duration: 200 }}
                >
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
        </div>
      {/each}
    </div>
    <button
      class="pause-btn"
      style={Object.values(expandedProposers).some(Boolean) ? 'margin-top: 0' : ''}
      onclick={() => (paused = !paused)}
    >
      {paused ? '▶ 繼續自動切換' : '⏸ 暫停自動切換'}
    </button>
  {/if}
</div>

<style>
  .embeddings {
    display: flex;
    flex-direction: column;
    gap: 15px;
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

  .card-stack {
    display: flex;
    flex-direction: column-reverse;
  }
  .card + .card {
    margin-bottom: -200px;
    position: relative;
  }
  .card {
    display: flex;
    flex-direction: column;
    transform: translateX(calc(var(--i) * 20px));
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
    background-color: var(--neutral-gray-50);
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
  }
  .proposer-count {
    font-size: var(--text-xs);
  }

  .pause-btn {
    align-self: flex-end;
    font-size: var(--text-xs);
    color: var(--neutral-gray-500);
    cursor: pointer;
    padding: 4px 8px;
    border: 1px solid var(--neutral-gray-200);
    border-radius: 4px;
    margin-top: -40px;
    z-index: 10;
  }
  .pause-btn:hover {
    color: var(--neutral-gray-700);
    border-color: var(--neutral-gray-400);
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
