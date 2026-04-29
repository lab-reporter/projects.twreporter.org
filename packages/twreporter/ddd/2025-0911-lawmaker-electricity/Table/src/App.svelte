<script>
    import Header from './lib/Header.svelte';
    import Footer from './lib/Footer.svelte';
    import Table from './lib/Table.svelte';
    import {membersSpeech} from './assets/data-store.js';

    let term = 10;
    const searchParams = new URLSearchParams(window.location.search);
    const termParam = searchParams.get('term');
    if (termParam != null && termParam !== '') {
        const n = Number(termParam);
        if (!Number.isNaN(n)) term = n;
    }
    let tableStyle = $derived(term === 11 ? "eleventh" : "tenth");

    let title = $derived(term === 11 ? `2024年第11屆立委上任後，誰討論最多國家能源政策？` : `2020年第10屆立委上任後，誰討論最多國家能源政策？`);
    let subtitle;
    let footer = $derived(term === 11 ? [
        "註1：截至2025年9月初，立法院第3會期公報未完整公布，本表僅統計2020年至2024年第2會期結束",
        "註2：部分名次為一年來針對該議題發言次數僅5次以內，故未列出完整立委資料",
        "資料來源：立法院議事公報、報導者觀測站",
        "資料整理：簡毅慧  ｜  設計：江世民"
    ] : [
        "註：截至2025年9月初，立法院第3會期公報未完整公布，本表僅統計2020年至2024年第2會期結束",
        "資料來源：立法院議事公報、報導者觀測站",
        "資料整理：簡毅慧  ｜  設計：江世民"
    ]);

    let speech = $derived(membersSpeech(term));

    let bodyHeight = $state(window.document.body.clientHeight);
    $effect(() => {
        parent.postMessage({ bodyHeight, source: `twreporter-table-${term}` }, '*'); // 跟 iframe id 一樣
    });
</script>

<svelte:body bind:clientHeight={bodyHeight} />
<div class="container">
  <Header {title} {subtitle}/>
  <div class="chartContainer">
    <Table tableData={$speech} style={tableStyle}/>
  </div>
  <Footer {footer}/>
</div>