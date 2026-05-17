<script lang="ts">
  import MaterialSymbols from '../../icons/MaterialSymbols.svelte'
  import { layerSliderState } from './state.svelte'
  import type { LayerSliderSteps } from './types'

  let { steps }: { steps: LayerSliderSteps } = $props()

  let open = $state(true)
</script>

<div class="card" style:gap={!open ? '5px' : undefined}>
  <span class="title">聚焦層數</span>
  {#if open}
    <div class="dots">
      {#each steps as step, index (`${step.name}-${index}`)}
        <button
          class="dot-box"
          onclick={() => (layerSliderState.activeStep = step)}
        >
          <div
            class={[
              'dot',
              { active: layerSliderState.activeStep?.name === step.name },
            ]}
          ></div>
          {#if layerSliderState.activeStep?.name === step.name}
            <div class="step-info-box">
              <p class="step-title">{step.name}</p>
              {#if step.description}
                <p class="step-description">{step.description}</p>
              {/if}
            </div>
          {/if}
        </button>
      {/each}
    </div>
  {/if}
  <button onclick={() => (open = !open)}>
    <div style:display="contents" style:color="var(--neutral-white)">
      <MaterialSymbols
        name={open ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
        size={16}
        style="background-color: var(--chart-gray-5); border-radius: 4px;"
      />
    </div>
  </button>
</div>

<style>
  .card {
    background-color: var(--neutral-offwhite);
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
  }

  .title {
    writing-mode: vertical-lr;
    text-align: center;
    line-height: 1.1;
    letter-spacing: 0.6px;
  }

  .dots {
    background-color: var(--neutral-gray-300);
    width: 2px;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 30px;
  }

  .dot-box {
    position: relative;
  }

  .dot {
    background-color: var(--neutral-gray-300);
    border-radius: 50%;
    width: 10px;
    height: 10px;
  }

  .dot.active {
    background-color: var(--brand-heavy);
  }

  .step-info-box {
    position: absolute;
    top: -50%;
    right: 0;
    width: fit-content;
    display: flex;
    flex-direction: column;
    align-items: end;
    justify-content: center;
    margin-right: 17.5px;
    gap: 5px;
  }

  .step-info-box > p {
    white-space: nowrap;
    line-height: 1.1;
    letter-spacing: 0.6px;
  }

  .step-title {
    font-size: 14px;
  }

  .step-description {
    font-size: 12px;
    color: var(--neutral-gray-600);
  }
</style>
