<script>
    import { onMount, onDestroy } from 'svelte';
    export let x = 0;
    export let y = 0;
    // identities: Array<{ name: string, party: string, committee?: string, whip?: string }>
    export let identities = [];

    // 依黨籍回傳對應的 root CSS 變數顏色
    const PARTY_VAR_MAP = {
      '國民黨': 'var(--party-kmt-hl)',
      '民進黨': 'var(--party-dpp-hl)',
      '民眾黨': 'var(--party-tpp-hl)',
      '時代力量': 'var(--party-npp-hl)',
    };
    function partyColor(party) {
      return PARTY_VAR_MAP[party] || '';
    }

    let containerWidth = 0;
    let resizeObserver;

    function updateContainerWidth() {
      const el = document.querySelector('.container');
      if (el) {
        containerWidth = el.clientWidth;
      } else {
        containerWidth = window.innerWidth || 0;
      }
    }

    onMount(() => {
      updateContainerWidth();
      const el = document.querySelector('.container');
      if (window.ResizeObserver) {
        resizeObserver = new ResizeObserver(() => updateContainerWidth());
        if (el) resizeObserver.observe(el);
      }
      window.addEventListener('resize', updateContainerWidth);
    });

    onDestroy(() => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener('resize', updateContainerWidth);
    });

    $: translateX = x > containerWidth / 1.75 ? '-100%' : '0%';
    $: translateY = y > containerWidth * (5/4) / 1.75 ? '-100%' : '0%';
    $: leftX = x > containerWidth / 1.75 ? x - 20 : x;
    $: TopY = y > containerWidth * (5/4) / 1.75 ? y - 20 : y;
</script>

<div
    class="tooltip"
    style="position: fixed;
           top: {TopY}px; left: {leftX}px;
           transform: translate({translateX}, {translateY});"
    role="tooltip"
>
  {#if identities && identities.length === 1}
    <div class="tooltip-title">
      <div class="tooltip-name" style:color={partyColor(identities[0].party)}>{identities[0].name}</div>
      {#if identities[0].party}
        <div class="tooltip-party" style:color={partyColor(identities[0].party)}>{identities[0].party}</div>
      {/if}
    </div>
    <div class="tooltip-meta">
      {#if identities[0].committee}
        <div style="font-weight: 600">時任委員會</div>
        <div>{identities[0].committee}</div>
      {/if}
      {#if identities[0].whip}
        <div style="margin-top: 4px; font-weight: 550">時任黨團幹部：{identities[0].whip}</div>
      {/if}
    </div>
  {:else if identities && identities.length > 1}
    {#each identities as it, i (it.name)}
      <div class="tooltip-item">
        <div class="tooltip-title">
          <div class="tooltip-name"style:color={partyColor(it.party)}>{it.name}</div>
          <div class="tooltip-party" style:color={partyColor(it.party)}>{it.party}</div>
        </div>
        <div class="tooltip-meta">
          {#if it.committee}
            <div style="font-weight: 600">時任委員會</div>
            <div>{it.committee}</div>
          {/if}
          {#if it.whip}
            <div style="margin-top: 4px; font-weight: 550">時任黨團幹部：{it.whip}</div>
          {/if}
        </div>
      </div>
    {/each}
  {/if}
</div>

<style>
  .tooltip {
    background: #FFFFFFBB;
    color: white;
    padding: 8px 10px;
    border-radius: 6px;
    box-shadow: 0 6px 20px rgba(0,0,0,0.3);
    pointer-events: none;
    min-width: 150px;
    max-width: 320px;
    z-index: 1000;
    backdrop-filter: blur(8px);
  }
  .tooltip-title {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: space-between;
  }
  .tooltip-name {
    font-size: var(--fs-m);
    font-weight: 500;
    margin-bottom: 4px;
    color: #444;
  }
  .tooltip-party {
    font-size: var(--fs-xs);
    opacity: 0.9;
    font-weight: 500;
  }
  .tooltip-meta {
    font-size: var(--fs-s);
    color: #666;
    opacity: 0.9;
    line-height: 1.3;
    white-space: pre-line;
  }
  .tooltip-item + .tooltip-item {
    margin-top: 8px;
    border-top: 1px solid rgba(0,0,0,0.2);
    padding-top: 8px;
  }
</style>
