<script lang="ts">
  import Chart, { type Plugin } from 'chart.js/auto'
  import annotationPlugin from 'chartjs-plugin-annotation'
  import ChartDataLabels from 'chartjs-plugin-datalabels'
  import { dataPath } from '../lib/constants/path'
  import { useChartData } from '../lib/fetchers/chart'
  import Content from './card/Content.svelte'

  // 單一候選人選區作為輸入
  let { area }: { area: string } = $props()

  // [Chart.js] 自定義插件，設定同圖表中不同寬度的長條圖
  const horizontalBarWidth: Plugin = {
    id: 'horizontalBarWidth',
    beforeDatasetsDraw(chart) {
      const barWidth = [35, 35, 20] // 設定長條圖寬度，由上至下依序設定
      const { data } = chart
      data.datasets.forEach((_, datasetIndex) => {
        const meta = chart.getDatasetMeta(datasetIndex)

        meta.data.forEach((_, index) => {
          chart.getDatasetMeta(datasetIndex).data[index].height =
            barWidth[index]
        })
      })
    },
  }

  Chart.register(annotationPlugin, ChartDataLabels, horizontalBarWidth)

  let chartCanvas: HTMLCanvasElement | null = $state(null)

  const chartQuery = useChartData(area)

  const cand = $derived($chartQuery.data)

  $effect(() => {
    if (!cand || !chartCanvas || !cand) return

    // 設定圖表資料
    const data = [
      { label: '同意罷免', value: Number(cand['同意票數']) },
      { label: ['不同意', '罷免'], value: Number(cand['不同意票數']) },
      { label: ['2024年', '當選投票數'], value: Number(cand['當選時得票數']) },
    ]
    const dataValues = data.map((d) => d.value)

    const maxX =
      Math.round(
        ((Math.max(...data.map((row) => row.value)) ?? 0) * 1.35) / 20000
      ) * 20000 // 設定 X 軸最大值為資料最大值的 1.3 倍，並四捨五入到最接近的萬位數

    new Chart(chartCanvas, {
      type: 'bar',
      data: {
        labels: data.map((row) => row.label),
        datasets: [
          {
            data: dataValues,
            backgroundColor: ['#A41F35', '#C49E70', '#CDCDCD'], // 設定長條圖顏色
          },
        ],
      },
      options: {
        events: [],
        animation: false,
        responsive: true,
        maintainAspectRatio: false,
        font: {
          family: 'Noto Sans TC',
          weight: 'bold',
        },
        borderColor: '#333',
        indexAxis: 'y',
        plugins: {
          datalabels: {
            display: true,
            color: '#808080',
            textStrokeColor: '#F1F1F1',
            textStrokeWidth: 2,
            font: { family: "'Roboto Slab', 'Noto Sans TC', sans-serif" },
            formatter: (value) => {
              const index = dataValues.indexOf(value)
              if (index === 0)
                return `${value.toLocaleString('zh-TW', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                })}票\n（${cand['同意催票率 (%)']}）`

              if (index === 1)
                return `${value.toLocaleString('zh-TW', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                })}票\n（${cand['不同意催票率 (%)']}）`

              if (index === 2)
                return `${value.toLocaleString('zh-TW', {
                  style: 'decimal',
                  minimumFractionDigits: 0,
                })}票`

              return ''
            },
            anchor: 'end',
            align: 'end',
          },
          annotation: {
            // 設定 25% 同意門檻虛線
            annotations: {
              line1: {
                type: 'line',
                xMin: cand['25% 同意門檻'],
                xMax: cand['25% 同意門檻'],
                borderColor: '#333',
                borderWidth: 1,
                borderDash: [4, 2],
              },
            },
          },
          legend: {
            display: false,
          },
        },
        scales: {
          y: {
            border: { display: false },
            grid: { display: false },
            ticks: {
              color: '#555',
              font: {
                family: "'Roboto Slab', 'Noto Sans TC', sans-serif",
                weight: 'normal',
              },
            },
          },
          x: {
            max: Math.round(maxX / 5 / 10000) * 10000 * 5, // 設定 X 軸最大值
            ticks: {
              font: {
                family: "'Roboto Slab', 'Noto Sans TC', sans-serif",
                weight: 'normal',
              },
              stepSize: Math.round(maxX / 5 / 10000) * 10000, // 設定 X 軸刻度間距
            },
          },
        },
      },
    })
  })
</script>

<Content>
  <div class="candidate">
    {#if cand?.['人工勾選通過'] === 'TRUE'}
      <img src={dataPath.imgStamp} class="stamp" alt="Stamp" />
    {/if}
    <div class="avatar">
      <img class="picture" src={cand?.['圖片']} alt={cand?.['姓名']} />
      <p class="name">
        <span class="party" style="background-color: #6D9BE0;"></span>{cand?.[
          '姓名'
        ]}
      </p>
      <span class="area">{cand?.['選區']}</span>
    </div>
    <div class="chart">
      <canvas
        bind:this={chartCanvas}
        id="chart-{area}"
        style:width="100%"
        style:height="100%"
      ></canvas>
    </div>
  </div>
</Content>

<style>
  .candidate {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 5px 15px;
    position: relative;
  }

  .avatar {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 120px;
  }

  .picture {
    width: 100px;
    height: 120px;
    border-radius: 5%;
    object-fit: cover;
    object-position: top;
    margin-bottom: 5px;
  }

  .party {
    display: inline-block;
    width: 13px;
    height: 13px;
    border-radius: 15%;
  }

  .name {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 15px;
    font-weight: 600;
    line-height: 1.2;
  }

  .area {
    font-size: 12px;
    font-weight: 600;
  }

  .chart {
    width: 415px;
    height: 170px;
    position: relative;
  }

  .stamp {
    position: absolute;
    top: 0;
    left: 0;
    width: 50px;
    transform: rotate(-10deg);
  }
</style>
