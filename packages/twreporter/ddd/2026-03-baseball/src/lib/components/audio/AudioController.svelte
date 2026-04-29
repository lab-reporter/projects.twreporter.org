<script lang="ts">
    import type { Snippet } from "svelte";
    import { getAudioContext } from "svelte-audio-player";
    import { setAudioElementContext } from "../../contexts/audio-element";
    const { children }: { children: Snippet } = $props();

    const { paused } = getAudioContext();
    const audioElementRef = setAudioElementContext();
</script>

<div
    {@attach (el) => {
        const audioEl = el.parentElement?.querySelector(':scope > audio');
        if (audioEl instanceof HTMLAudioElement) {
            audioEl.preload = 'auto';
            audioElementRef.set(audioEl);
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        paused.set(true);
                    }
                });
            },
            {
                root: null,
            },
        );

        observer.observe(el);

        return () => {
            observer.disconnect();
        };
    }}
>
    {@render children()}
</div>
