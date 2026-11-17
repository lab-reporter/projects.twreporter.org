<script module lang="ts">
  import EmbedCode from '@lab-reporter/ddd-shared/components/shared/EmbedCode.svelte'
  import Layout from '@lab-reporter/ddd-shared/components/shared/Layout.svelte'
  import '@lab-reporter/ddd-shared/components/full-screen-wrapper/FullScreenWrapper.wc.svelte'
  import './PlayerTrackMap.wc.svelte'
  import type { FullScreenWrapperConfig } from '@lab-reporter/ddd-shared/components/full-screen-wrapper/types.ts'
  import { defineMeta } from '@storybook/addon-svelte-csf'
  import {
    infoBoxesSchema,
    type PlayerTrack,
    type GetInfoBoxes,
    type GetTrack,
  } from '../lib/rpc.ts'
  import { coordinateLandmarks } from '../lib/constants/coordinate-map.ts'
  import PlayerTrackMap from './PlayerTrackMap.svelte'

  const start = coordinateLandmarks.find(
    (point) => point.landmark === 'PlayerStart',
  )

  const sampleTrack: PlayerTrack = coordinateLandmarks
    .filter(
      (point) =>
        (!start || point.u <= start.u) &&
        ![
          'Zebra_012',
          'Zebra_013',
          'Zebra_014',
          'Zebra_015',
          'Zebra_016',
        ].includes(point.landmark),
    )
    .sort((left, right) => right.u - left.u)
    .map((point, index) => ({
      segment: 1,
      t: index * 0.5,
      x: point.x,
      z: point.z,
      kind: index % 3 === 0 ? 'safe' : index % 3 === 1 ? 'shoulder' : 'road',
    }))

  const sampleInfoBoxes = infoBoxesSchema.parse([
    {
      id: '1a170e88-e9e5-44c4-b8ee-69ea64d6cb98',
      zoneId: 'traffic_light_05',
      x: -7.993036907548413,
      z: -2.621416768200515,
      infoName: '紅綠燈時長過短',
      infoContent:
        '行人號誌綠燈閃爍之剩餘秒數，不足夠讓在行穿線上的學童完整穿越馬路或抵達行人庇護島（以步伐0.8m/s計算）',
      inspectItemSequence: '第30項',
      laws: ['道路交通標誌標線號誌設置規則231條'],
    },
    {
      id: '12f28f90-6215-43dd-b71f-810b2d472471',
      zoneId: 'drain_cover_01',
      x: -42.6645623651344,
      z: 25.16783908125946,
      infoName: '水溝蓋孔距太大',
      infoContent:
        '人行道之排水孔蓋縫隙小於1.3公分，避免輪椅、推車或導盲杖陷入。',
      inspectItemSequence: '第42項',
      laws: ['市區道路及附屬工程設計規範圖6.4.1'],
    },
    {
      id: '4dfccbc2-f746-415c-8787-d6e6305ee87d',
      zoneId: 'pedestrian_path_01',
      x: -70.06958784523887,
      z: 52.14960864219721,
      infoName: '人行道',
      infoContent:
        '路幅未滿12公尺之道路，兩側具備連續且淨寬度大於0.9公尺(不含騎樓)的人行道，避免學童被迫走入車道與車爭道。\n',
      inspectItemSequence: '第36項',
      laws: ['市區道路及附屬工程設計規範6.1、6.2', '公路路線設計規範2.12'],
    },
  ])

  const getTrack: GetTrack = async () => sampleTrack
  const getInfoBoxes: GetInfoBoxes = async () => sampleInfoBoxes

  const { Story } = defineMeta({
    title: 'Components/PlayerTrackMap',
    component: PlayerTrackMap,
    args: { config: './player-track-map.json', getTrack, getInfoBoxes },
    argTypes: {
      config: { control: 'text' },
      getTrack: { control: false },
      getInfoBoxes: { control: false },
    },
  })
</script>

<Story name="Default">
  {#snippet template(args)}
    <Layout>
      <PlayerTrackMap {...args} />
    </Layout>
    <EmbedCode
      componentName="player-track-map"
      tagName="twreporter-player-track"
      src=""
      config={args.config ?? ''}
    />
  {/snippet}
</Story>

<Story name="PlayCanvas">
  {#snippet template(args)}
    <p class="spacer">內文內文內文</p>
    <twreporter-full-screen-wrapper
      src=""
      config={JSON.stringify({
        splashScreenText: '你即將進入3D體驗',
      } satisfies FullScreenWrapperConfig)}
    >
      <iframe
        src="https://playcanv.as/e/p/02007016/"
        title="上學路上"
        width="100%"
        height="100%"
      ></iframe>
    </twreporter-full-screen-wrapper>
    <p class="spacer">內文內文內文</p>
    <twreporter-player-track config={args.config ?? ''}
    ></twreporter-player-track>
    <p class="spacer">內文內文內文</p>
    <EmbedCode
      componentName="player-track-map"
      tagName="twreporter-player-track"
      src=""
      config={args.config ?? ''}
    />
  {/snippet}
</Story>

<style>
  .spacer {
    display: grid;
    place-items: center;
    height: 50vh;
    margin: 0;
  }
</style>
