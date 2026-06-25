<script lang="ts">
  import type { Card } from '../lib/content'

  let { card }: { card: Card } = $props()
</script>

<div
  class="card"
  id={card.name}
  class:fullscreen={card.style === 'fullscreen'}
  class:right={card.style === 'right'}
>
  <div class="content" class:fullscreen={card.style === 'fullscreen'}>
    <h2>{card.title}</h2>
    {#if card.video}
      <video src={card.video} autoplay muted loop style="width:100%;height:auto"
      ></video>
    {:else if card.audio}
      <audio src={card.audio} controls style="width:300px"></audio>
    {:else if card.embed}
      {@html card.embed}
    {:else if card.photo}
      <!-- TODO: Replace alt caption -->
      <img src={card.photo} style="width:100%;height:auto" alt="圖說" />
    {/if}
    {#if card.contents}
      <p style="white-space: pre-line">{card.contents}</p>
    {/if}
  </div>
</div>

<style>
  .card {
    width: 100vw;
    min-height: 50vh;
    display: flex;
    align-items: start;
    justify-content: start;
    padding-bottom: 50vh;
  }

  .card.fullscreen {
    align-items: center;
    justify-content: center;
  }

  .card .content {
    max-width: 400px;
    background: rgba(0, 0, 0, 0.6);
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 0 20px;
  }

  .card .content.fullscreen {
    max-width: 100%;
    min-height: 150vh;
    background: var(--tr-background);
    margin: 0;
    align-items: center;
    justify-content: center;
  }

  .card.right {
    justify-content: end;
  }

  .card .content * {
    color: white;
  }

  .card .content.fullscreen * {
    color: var(--tr-text);
    font-size: 1.125rem;
  }

  .card .content h2 {
    font-size: 1.5rem;
    font-weight: bold;
  }
</style>
