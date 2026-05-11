<script lang="ts">
    import Layout from './lib/components/Layout.svelte'

    let inputHtml = $state()
</script>

<Layout>
    <h1>預覽頁面</h1>

    <textarea bind:value={inputHtml}></textarea>

    <div>
        {@html inputHtml}
    </div>
</Layout>
