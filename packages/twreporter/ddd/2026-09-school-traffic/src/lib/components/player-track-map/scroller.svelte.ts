import type { PlayerTrackMapCard } from './types.ts'

export class PlayerTrackMapScroller {
  #cards: () => PlayerTrackMapCard[]

  progress = $state(0)
  #orderedCards = $derived.by(() =>
    [...this.#cards()].sort((left, right) => left.position - right.position),
  )
  #activeCard = $derived(
    this.#orderedCards.filter((card) => card.position <= this.progress).at(-1),
  )
  view = $derived<PlayerTrackMapCard['view']>(
    this.#activeCard?.view ?? 'before',
  )
  highlightedMarkerIds = $derived(this.#activeCard?.highlightMarkerIds ?? [])
  clipRoutes = $derived(this.#activeCard?.clipRoutes ?? true)

  constructor(cards: () => PlayerTrackMapCard[]) {
    this.#cards = cards
  }
}
