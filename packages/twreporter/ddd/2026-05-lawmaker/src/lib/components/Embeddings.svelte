<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { flip } from 'svelte/animate'
  import EmbeddingsCard from './EmbeddingsCard.svelte'
  import type { Proposal } from '../constants/embeddings'

  let {
    data,
  }: {
    data: Proposal[]
  } = $props()

  let cards = $state<Proposal[]>([])
  let cycleTimer: ReturnType<typeof setInterval> | null = null
  let paused = $state(false)

  $effect(() => {
    if (cycleTimer) {
      clearInterval(cycleTimer)
      cycleTimer = null
    }

    cards = data
    if (data.length >= 2) cycleTimer = setInterval(cycle, 5000)

    return () => {
      if (cycleTimer) {
        clearInterval(cycleTimer)
        cycleTimer = null
      }
    }
  })

  function cycle() {
    if (paused) return
    const top = cards.shift()
    if (!top) return
    setTimeout(() => cards.push(top), 0)
  }
</script>

<div class="embeddings">
  <div class="card-stack">
    {#each cards as card, i (card)}
      <div
        class="card"
        style="--i: {i}; z-index: {cards.length - i}"
        animate:flip={{ duration: 400 }}
        in:fade={{ duration: 300, delay: 450 }}
        out:fly={{ x: 60, duration: 400 }}
      >
        <EmbeddingsCard {card} />
      </div>
    {/each}
  </div>
  <button class="pause-btn" onclick={() => (paused = !paused)}>
    {paused ? '▶ 繼續自動切換' : '⏸ 暫停自動切換'}
  </button>
</div>

<style>
  .embeddings {
    display: flex;
    flex-direction: column;
    gap: 15px;
    position: relative;
    min-height: 60px;
  }

  .card-stack {
    display: flex;
    flex-direction: column-reverse;
    min-height: 500px;
    justify-content: center;
  }
  .card + .card {
    margin-bottom: -220px;
    position: relative;
  }
  .card {
    display: flex;
    flex-direction: column;
    transform: translateX(calc(var(--i) * 20px));
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

  .card-stack:has(:global(.proposers-name)) + .pause-btn {
    margin-top: 0;
  }
</style>
