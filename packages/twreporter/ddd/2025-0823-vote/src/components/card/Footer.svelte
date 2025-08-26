<script lang="ts">
  let { footnotes }: { footnotes: string[] } = $props()
</script>

<div class="card-footer">
  <div class="footnote-wrapper">
    {#each footnotes as footnote}
      <p class="footnote">{footnote}</p>
    {/each}
  </div>

  <img
    src="https://projects.twreporter.org/twreporter/ddd/2025-0823-vote/assets/logo-black.png"
    class="logo"
    alt="報導者 The Reporter"
  />
</div>

<style>
  .card-footer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
    width: 100%;
    padding: 10px 0 0 0;
  }
  .footnote-wrapper {
    display: flex;
    flex-direction: column;
    gap: 2.5px;
  }
  .footnote {
    font-size: 14px;
    display: inline-flex;
    flex-direction: column;
    flex-grow: 1;
    letter-spacing: 0.3px;
    font-weight: 350;
    color: #9c9c9c;
  }

  .logo {
    width: 29px;
    height: 31px;
  }
</style>
