<script lang="ts">
  type Props = {
    message: string
  }

  let { message }: Props = $props()
</script>

<p class="empty-state">{message}</p>

<style>
  .empty-state {
    margin: 0;
    padding: 14px 12px;
    border-radius: 4px;
    background: var(--neutral-gray-100);
    color: var(--neutral-gray-600);
    font-size: 14px;
    line-height: 1.4;
  }
</style>
