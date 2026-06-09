<script lang="ts">
  let {
    name,
    expanded = false,
  }: {
    name: 'arrow' | 'cross'
    expanded?: boolean
  } = $props()
</script>

{#if name === 'arrow'}
  <svg
    class="arrow"
    class:expanded
    width="7"
    height="5"
    viewBox="0 0 7 5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0.5 0.5L3.5 4.5L6.5 0.5" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke"/>
  </svg>
{:else if name === 'cross'}
  <svg
    class="cross"
    class:expanded
    width="7"
    height="7"
    viewBox="0 0 7 7"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line class="horizontal" x1="0.5" y1="3.5" x2="6.5" y2="3.5" stroke="currentColor" stroke-linecap="round"/>
    <line class="vertical" x1="3.5" y1="0.5" x2="3.5" y2="6.5" stroke="currentColor" stroke-linecap="round"/>
  </svg>
{/if}

<style>
  svg.arrow {
    transform: scale(1.25);
  }
  svg.arrow path {
    d: path("M0.5 0.5L3.5 4.5L6.5 0.5");
    transition: d 0.5s ease;
  }
  svg.arrow.expanded path {
    d: path("M0.5 3.5L3.5 3.5L6.5 3.5");
  }

  svg.cross {
    transform: scale(1.25);
  }
  svg.cross .vertical,
  svg.cross .horizontal {
    transform-box: fill-box;
    transform-origin: center;
    transition: transform 0.3s ease;
  }
  svg.cross.expanded .vertical {
    transform: rotate(90deg);
  }
  svg.cross.expanded .horizontal {
    transform: rotate(0deg);
  }
</style>
