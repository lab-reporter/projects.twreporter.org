<script>
    import { UserButton } from 'svelte-clerk/client'
    import { p } from '../../router'
</script>

<div class="header">
    <a href={p('/editor')}>
        <h1>陳明文政商網絡</h1>
    </a>
    <UserButton />
</div>

<style>
    a {
        display: contents;
    }

    .header {
        display: flex;
        gap: 10px;
        padding: 20px;
        align-items: center;
        justify-content: start;
    }

    h1 {
        font-family: 'Noto Serif TC';
        font-size: var(--text-l);
        font-weight: 700;
    }
</style>
