import type { Readable } from 'svelte/store'
import { get } from 'svelte/store'

/**
 * Reads audio currentTime on every animation frame for smooth PlayerHead movement.
 *
 * Reads directly from the HTMLAudioElement for true 60fps updates, bypassing
 * Svelte's bind:currentTime store which has a gap after play starts (its internal
 * rAF loop stops while paused and only restarts on the next timeupdate ~250ms later).
 */
export function useAnimationFrameTime(
  currentTime: Readable<number>,
  paused: Readable<boolean>,
  audioElement: Readable<HTMLAudioElement | null>,
) {
  let smoothTime = $state(get(currentTime))
  let rafId: number | null = null
  let isPaused = $state(get(paused))
  let audioEl: HTMLAudioElement | null = get(audioElement)

  const unsubPaused = paused.subscribe((v) => (isPaused = v))
  const unsubAudioEl = audioElement.subscribe((v) => (audioEl = v))

  function tick() {
    // Read directly from the audio element for true 60fps updates.
    // Falls back to the store value if the element isn't available yet.
    smoothTime = audioEl?.currentTime ?? get(currentTime)
    rafId = requestAnimationFrame(tick)
  }

  $effect(() => {
    if (!isPaused) {
      rafId = requestAnimationFrame(tick)
    } else {
      if (rafId != null) cancelAnimationFrame(rafId)
      rafId = null
      smoothTime = get(currentTime)
    }
    return () => {
      if (rafId != null) cancelAnimationFrame(rafId)
    }
  })

  // Sync when paused (e.g. seek while paused)
  const unsubTime = currentTime.subscribe((v) => {
    if (isPaused) smoothTime = v
  })

  return {
    get currentTime() {
      return smoothTime
    },
    destroy() {
      unsubPaused()
      unsubTime()
      unsubAudioEl()
      if (rafId != null) cancelAnimationFrame(rafId)
    },
  }
}
