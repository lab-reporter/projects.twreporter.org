<script lang="ts">
  import type { projectPosition } from '../../constants/coordinate-map.ts'
  import { mapHeight, mapWidth } from '../../constants/coordinate-map.ts'
  import type { InfoBox } from '../../rpc.ts'

  const {
    info,
    pixel,
    selected = false,
    highlighted = false,
    edit = false,
    infoBoxId,
    onselect,
  }: {
    info: InfoBox
    pixel: ReturnType<typeof projectPosition>
    selected?: boolean
    highlighted?: boolean
    edit?: boolean
    infoBoxId: string
    onselect: () => void
  } = $props()
</script>

<button
  type="button"
  class="marker"
  class:selected
  class:highlighted
  style:left={`${(pixel.u / mapWidth) * 100}%`}
  style:top={`${(pixel.v / mapHeight) * 100}%`}
  aria-label={`${info.infoName} ${info.inspectItemSequence}`.trim()}
  aria-haspopup="dialog"
  aria-expanded={selected}
  aria-controls={selected ? infoBoxId : undefined}
  onclick={onselect}
>
  <span class="marker-content" aria-hidden="true">
    <span class="pin"></span>
    {#if edit}
      <span class="marker-id">{info.zoneId}</span>
    {/if}
  </span>
</button>

<style>
  .marker {
    position: absolute;
    transform: translate(-50%, -50%);
    display: grid;
    place-items: center;
    width: 44px;
    height: 48px;
    border: 0;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  .marker-content {
    position: relative;
    display: grid;
    place-items: center;
    transform: rotate(180deg) translateY(-50%);
  }

  .pin {
    --pin-color: var(--map-accent);
    position: relative;
    width: 25px;
    height: 27px;
  }

  .pin::before {
    content: '';
    position: absolute;
    box-sizing: border-box;
    left: 50%;
    bottom: 4px;
    width: 18px;
    height: 18px;
    border: 2px solid var(--pin-color);
    border-radius: 50% 50% 0;
    background: var(--map-panel);
    transform: translateX(-50%) rotate(45deg);
    box-shadow:
      0 0 0 2px var(--map-panel),
      0 2px 4px rgb(31 36 32 / 20%);
  }

  .selected .pin {
    width: 44px;
    height: 48px;
  }

  .selected .pin::before {
    bottom: 6px;
    width: 32px;
    height: 32px;
  }

  .highlighted .pin {
    --pin-color: var(--map-danger);
  }

  .highlighted .pin::before {
    background: var(--map-danger);
  }

  .marker:focus-visible {
    outline: 2px solid var(--map-accent);
    border-radius: 5px;
  }

  .marker.highlighted:focus-visible {
    outline-color: var(--map-danger);
  }

  .marker.selected {
    anchor-name: --selected-marker;
  }

  .marker-id {
    position: absolute;
    top: 50%;
    left: calc(100% + 8px);
    transform: translateY(-50%);
    width: max-content;
    padding: 3px 6px;
    border-radius: 2px;
    background: var(--map-panel);
    color: var(--map-text);
    font: 12px monospace;
    user-select: text;
  }

  @media (max-width: 767px) {
    .marker-content {
      transform: rotate(90deg) translateY(-50%);
    }
  }
</style>
