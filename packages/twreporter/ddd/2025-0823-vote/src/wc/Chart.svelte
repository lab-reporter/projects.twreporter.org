<script lang="ts">
  import Base from '../components/Base.svelte'
  import Candidate from '../components/Candidate.svelte'
  import Footer from '../components/card/Footer.svelte'
  import Header from '../components/card/Header.svelte'
  import Title from '../components/card/Title.svelte'
  import { useChartFootnotes } from '../lib/fetchers/footnotes'

  const footnotesQuery = useChartFootnotes()

  const footnotes = $derived(
    $footnotesQuery.data?.['Chart']['Text'].split('\n') ?? []
  )

  // Web Components 輸入的資料
  let {
    cands,
    pageIndex,
    totalPage,
    title,
  }: { cands: string; pageIndex?: number; totalPage?: number; title: string } =
    $props()

  const candidates = cands.split(',').map((area) => area.trim())

  let isLoading = $derived($footnotesQuery.isLoading)
</script>

<Base
  title={`${title}${pageIndex && totalPage ? `（${pageIndex}-${totalPage}）` : ''}`}
  bind:loading={isLoading}
>
  <Header>
    <div class="header-content">
      <Title>{title}</Title>
      <div class="header-right">
        {#if pageIndex && totalPage}
          <p>第 {pageIndex} 頁 / 共 {totalPage} 頁</p>
        {/if}
        <div class={`legend ${title.length > 14 ? 'overflow' : ''}`}>
          <span>---------</span> <span>25%門檻</span>
        </div>
      </div>
    </div></Header
  >
  {#each candidates as area}
    <Candidate {area} />
  {/each}
  <Footer {footnotes}></Footer></Base
>

<style>
  .header-content {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .header-right {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: end;
    font-size: 12px;
    gap: 5px;
  }

  .header-right p {
    color: #cdcdcd;
  }

  .header-right .legend {
    background-color: #f1f1f1;
    border-radius: 2px;
    padding: 2px 5px;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
  }

  .legend.overflow {
    flex-direction: column;
    align-items: end;
    justify-content: center;
    gap: 0;
  }
</style>
