<script lang="ts">
  import type { ComponentPropsWithChildren } from '../types'
  import { fullScreenWrapperConfigSchema } from './types'
  import {
    createWrapperController,
    type WrapperController,
  } from './controller.svelte.ts'

  const {
    config: configJson,
    children,
    controller = createWrapperController(),
  }: ComponentPropsWithChildren & { controller?: WrapperController } = $props()

  const config = $derived(
    fullScreenWrapperConfigSchema.parse(JSON.parse(configJson)),
  )
</script>

<div class="wrapper" use:controller.attach>
  {#if !controller.scrollLock}
    <div class="splash-screen">
      {config.splashScreenText}
      <button onclick={controller.lock}>開始體驗</button>
    </div>
  {:else if controller.buttonVisible}
    <div class="footer">
      <button onclick={controller.release}>繼續閱讀</button>
    </div>
  {/if}
  {@render children()}
</div>

<style>
  button {
    width: fit-content;
    padding: 8px 16px;
    border-radius: 40px;
    font-size: 16px;
    line-height: 24px;
    color: #fff;
    background-color: #333;
  }

  .wrapper {
    box-sizing: border-box;
    width: 100vw;
    height: 100dvh;
    position: relative;
  }

  .footer {
    z-index: 1;
    bottom: 0;
    right: 0;
    width: 100%;
    padding: 10px 0;
    display: flex;
    align-items: center;
    justify-content: end;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1));
    position: absolute;

    button {
      background-color: transparent;
      border: 1px solid #fff;
    }
  }

  .splash-screen {
    z-index: 1;
    width: 100%;
    inset: 0;
    position: absolute;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.8);
  }
</style>
