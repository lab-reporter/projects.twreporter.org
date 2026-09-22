<script lang="ts">
  let { code }: { code: string } = $props()
  let status = $state('')
</script>

<div class="embed-code">
  <textarea readonly aria-label="Embed code" value={code}></textarea>
  <button
    type="button"
    onclick={async () => {
      try {
        await navigator.clipboard.writeText(code)
        status = 'Copied!'
      } catch {
        status = 'Could not copy. Select and copy the code manually.'
      }
    }}>Copy</button
  >
  <span role="status">{status}</span>
</div>

<style>
  .embed-code {
    margin-top: 10px;
  }

  textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100px;
    margin-bottom: 8px;
    font-family: monospace;
  }
</style>
