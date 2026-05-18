<script lang="ts">
  import { useConvexClient } from 'convex-svelte'
  import { toast } from 'svelte-sonner'
  import { api } from '~convex/api'
  import { navigate } from '../../../router'
  import Button from '../ui/Button.svelte'

  const convex = useConvexClient()

  let graphName = $state('')
  let graphDescription = $state('')
  let isCreatingGraph = $state(false)
</script>

<form
  class="create-graph-form"
  onsubmit={async (event) => {
    event.preventDefault()

    const name = graphName.trim()
    const description = graphDescription.trim()

    if (!name) {
      toast.error('請輸入節點圖名稱')
      return
    }

    isCreatingGraph = true

    try {
      const graphId = await convex.mutation(api.graphs.createGraph, {
        name,
        description: description || undefined,
      })

      graphName = ''
      graphDescription = ''
      toast.success('已新增節點圖')
      navigate('/graphs/:graphId', { params: { graphId } })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '無法新增節點圖')
    } finally {
      isCreatingGraph = false
    }
  }}
>
  <div class="form-header">
    <h2>新增節點圖</h2>
    <p>節點圖記錄完整的網絡，在節點圖中可以再選取集合成為設計用圖表</p>
  </div>

  <label>
    <span>名稱</span>
    <input
      bind:value={graphName}
      type="text"
      name="name"
      autocomplete="off"
      placeholder="例如：陳明文家族"
      disabled={isCreatingGraph}
    />
  </label>

  <label>
    <span>描述</span>
    <textarea
      bind:value={graphDescription}
      name="description"
      rows="4"
      placeholder="補充說明"
      disabled={isCreatingGraph}
    ></textarea>
  </label>

  <Button
    label={isCreatingGraph ? '新增中' : '新增節點圖'}
    variant="filled"
    type="submit"
    disabled={isCreatingGraph || !graphName.trim()}
  />
</form>

<style>
  .create-graph-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
    font-family: 'Noto Sans TC', sans-serif;
  }

  .form-header {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .form-header h2 {
    margin: 0;
    font-size: var(--text-l);
    font-weight: 700;
    line-height: 1.2;
    font-family: 'Noto Serif TC';
  }

  .form-header p {
    margin: 0;
    color: var(--neutral-gray-500);
    font-size: var(--text-s);
    line-height: 1.5;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 8px;
    color: var(--neutral-gray-700);
    font-size: var(--text-s);
    font-weight: 500;
  }

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--neutral-gray-300);
    border-radius: 4px;
    padding: 10px 12px;
    background: var(--neutral-white);
    color: var(--neutral-gray-800);
    font: inherit;
    line-height: 1.5;
  }

  textarea {
    resize: vertical;
  }

  input:focus,
  textarea:focus {
    outline: 2px solid var(--supportive-heavy);
    outline-offset: 2px;
  }

  input:disabled,
  textarea:disabled {
    opacity: 0.65;
  }
</style>
