<script lang="ts">
  const { label, code }: { label: string; code: string } = $props()

  let status = $state('')
</script>

<div class="embed-code">
  <p class="label">{label} <span role="status">{status}</span></p>
  <textarea readonly value={code}></textarea>
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
</div>

<style>
  .label {
    font-weight: bold;
  }

  .label > [role='status'] {
    font-weight: initial;
    font-size: 12px;
  }

  button {
    width: 100%;
    background-color: #f1f1f1;
    border: 1px solid #cdcdcd;
  }

  .embed-code {
    width: 300px;
    margin: 4px 10px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  textarea {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100px;
    border: 1px #cdcdcd solid;
    font-size: 12px;
    font-family: monospace;
    padding: 10px;
  }
</style>
