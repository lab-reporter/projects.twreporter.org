import { getContext, setContext } from 'svelte'
import { writable, type Writable } from 'svelte/store'

const KEY = Symbol('audio-element')

export function setAudioElementContext(): Writable<HTMLAudioElement | null> {
  const ref = writable<HTMLAudioElement | null>(null)
  setContext(KEY, ref)
  return ref
}

export function getAudioElementContext(): Writable<HTMLAudioElement | null> {
  return getContext<Writable<HTMLAudioElement | null>>(KEY)
}
