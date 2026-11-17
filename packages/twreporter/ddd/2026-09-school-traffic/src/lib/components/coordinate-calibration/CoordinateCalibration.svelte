<script lang="ts">
  import { onMount, untrack } from 'svelte'
  import mapImage from '../../../assets/map.jpg'
  import { CoordinateCalibration } from './calibration.svelte.ts'
  import CalibrationViewport from './CalibrationViewport.svelte'
  import SogScene from './SogScene.svelte'

  const {
    sogUrl = 'https://storage.googleapis.com/data-reporter-infographics/dev/2026-09-school-traffic/scenes/13-42k-cleaned/lod-meta.json',
  }: { sogUrl?: string } = $props()
  const editor = untrack(() => new CoordinateCalibration(sogUrl))
  const coordinateFields = ['x', 'z', 'u', 'v'] as const
  onMount(() => editor.restore())
  const worldBounds = $derived(
    editor.points.length
      ? {
          minX: Math.min(...editor.points.map((point) => point.x)) - 10,
          minY: Math.min(...editor.points.map((point) => point.z)) - 10,
          maxX: Math.max(...editor.points.map((point) => point.x)) + 10,
          maxY: Math.max(...editor.points.map((point) => point.z)) + 10,
        }
      : { minX: -175, minY: -125, maxX: 175, maxY: 125 },
  )
  const worldMarkers = $derived(
    editor.points.map((point, index) => ({
      x: point.x,
      y: point.z,
      label: point.landmark,
      index,
    })),
  )
  const imageMarkers = $derived(
    editor.points.map((point, index) => ({
      x: point.u,
      y: point.v,
      label: point.landmark,
      index,
    })),
  )
  const worldFocus = $derived(
    editor.focus
      ? { x: editor.focus.world.x, y: editor.focus.world.z }
      : undefined,
  )
  const imageFocus = $derived(
    editor.focus
      ? { x: editor.focus.image.u, y: editor.focus.image.v }
      : undefined,
  )
  const worldProbe = $derived(
    editor.selection.kind === 'pick-image'
      ? { x: editor.selection.world.x, y: editor.selection.world.z }
      : undefined,
  )
  const imageProbe = $derived(
    editor.correctedProbe
      ? { x: editor.correctedProbe.u, y: editor.correctedProbe.v }
      : undefined,
  )
  const mesh = $derived.by(() => {
    if (!editor.showMesh || editor.result.kind !== 'valid')
      return { world: [], image: [] }
    const map = editor.result.map
    return {
      world: map.sections.map(
        (section) =>
          `M${section.vertices.map((index) => `${map.vertices[index].x},${map.vertices[index].z}`).join('L')}Z`,
      ),
      image: map.sections.map(
        (section) =>
          `M${section.vertices.map((index) => `${map.vertices[index].u},${map.vertices[index].v}`).join('L')}Z`,
      ),
    }
  })
</script>

<main>
  <header>
    <h1>Coordinate calibration</h1>
    <p>
      Match ground landmarks in the SOG and drone image. Drag empty space to
      pan; scroll to zoom. Add at least three pairs, spread across both sides of
      the road. Hover over the SOG to preview its mapped position in red.
    </p>
    <form
      onsubmit={(event) => {
        event.preventDefault()
        editor.sogUrl = editor.sogUrlInput
        editor.save()
      }}
    >
      <label for="sog-url">Streamed SOG URL</label>
      <input id="sog-url" type="url" required bind:value={editor.sogUrlInput} />
      <button type="submit">Load SOG</button>
    </form>
  </header>

  <div class="toolbar">
    <button
      type="button"
      onclick={() => {
        editor.selection = { kind: 'pick-world' }
      }}>Add reference</button
    >
    <button
      type="button"
      onclick={() => {
        editor.selection = { kind: 'inspect' }
      }}>Inspect</button
    >
    <button
      type="button"
      disabled={!editor.history.length}
      onclick={() => editor.undo()}>Undo</button
    >
    <label
      ><input type="checkbox" bind:checked={editor.showMesh} /> Show mesh</label
    >
    <span class="grow"></span>
    <label class="file"
      >Import map<input
        type="file"
        accept=".json,application/json"
        onchange={(event) => {
          const file = event.currentTarget.files?.[0]
          if (file) void editor.importMap(file)
          event.currentTarget.value = ''
        }}
      /></label
    >
    <button
      type="button"
      disabled={!editor.points.length}
      onclick={() => editor.reset()}>Clear all points</button
    >
    <button
      class="primary"
      type="button"
      disabled={editor.result.kind !== 'valid'}
      onclick={() => editor.exportMap()}>Export coordinate-map.json</button
    >
  </div>

  <p class="instruction" role="status">
    {#if editor.selection.kind === 'pick-world'}1. Click a ground landmark in
      the SOG view.
    {:else if editor.selection.kind === 'pick-image'}2. Click the same landmark
      in the drone image. The new pair will be added.
    {:else if editor.selection.kind === 'point'}Editing reference {editor
        .selection.index + 1}. Click in either view to replace that side of the
      pair. Choose Inspect when finished.
    {:else}Select a numbered reference to correct it, or add a new pair. Drafts
      save in this browser automatically.{/if}
  </p>
  {#if editor.message}<p class="message" role="status">{editor.message}</p>{/if}
  {#if editor.result.kind === 'incomplete'}<p class="message">
      Add at least three reference pairs that enclose an area to preview and
      export the mapping.
    </p>{/if}
  {#if editor.result.kind === 'invalid'}<p class="error" role="alert">
      {editor.result.error}
    </p>{/if}

  <div class="views">
    <CalibrationViewport
      label="SOG · world X / Z"
      rotation={-145}
      bounds={worldBounds}
      markers={worldMarkers}
      selected={editor.selectedIndex}
      triangles={mesh.world}
      focus={worldFocus}
      focusSpan={35}
      probe={worldProbe}
      onpick={({ x, y }) => editor.pickWorld({ x, z: y })}
      onselect={(index) => editor.select(index)}
      onhover={(point) => {
        editor.probe = point ? { x: point.x, z: point.y } : undefined
      }}
    >
      {#snippet background(view)}
        {#key editor.sogUrl}<SogScene url={editor.sogUrl} {view} />{/key}
      {/snippet}
    </CalibrationViewport>
    <CalibrationViewport
      label={`Drone · ${editor.width} × ${editor.height} map units`}
      bounds={{
        minX: 0,
        minY: 0,
        maxX: editor.width,
        maxY: editor.height,
      }}
      image={mapImage}
      markers={imageMarkers}
      selected={editor.selectedIndex}
      triangles={mesh.image}
      focus={imageFocus}
      focusSpan={160}
      probe={imageProbe}
      onpick={({ x, y }) => editor.pickImage({ u: x, v: y })}
      onselect={(index) => editor.select(index)}
    />
  </div>

  <h2>{editor.points.length} reference points</h2>
  <p>
    Define matching pairs along both sides of the road. Select a number to edit,
    or use Focus to zoom both views to that pair. Use the visible ground, such
    as a crosswalk corner, rather than a roof.
  </p>
  <div class="table-scroll">
    <table>
      <thead
        ><tr
          ><th>Point</th><th>Name</th><th>World X</th><th>World Z</th><th
            >Image U</th
          ><th>Image V</th><th>Actions</th></tr
        ></thead
      >
      <tbody>
        {#each editor.points as point, index (index)}
          <tr class:selected={editor.selectedIndex === index}>
            <td
              ><button
                type="button"
                aria-pressed={editor.selectedIndex === index}
                onclick={() => editor.select(index)}>{index + 1}</button
              ></td
            >
            <td
              ><input
                aria-label={`Reference ${index + 1} name`}
                value={point.landmark}
                onchange={(event) =>
                  editor.update(index, { landmark: event.currentTarget.value })}
              /></td
            >
            {#each coordinateFields as field}
              <td
                ><input
                  type="number"
                  step="any"
                  aria-label={`Reference ${index + 1} ${field}`}
                  value={point[field]}
                  onchange={(event) => {
                    const value = event.currentTarget.valueAsNumber
                    if (Number.isFinite(value))
                      editor.update(index, { [field]: value })
                  }}
                /></td
              >
            {/each}
            <td class="actions"
              ><button type="button" onclick={() => editor.focusPoint(index)}
                >Focus</button
              ><button
                type="button"
                aria-label={`Delete reference ${index + 1}`}
                onclick={() => editor.remove(index)}>Delete</button
              ></td
            >
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
  <p class="footnote">
    Export replaces <code>src/lib/constants/coordinate-map.json</code>. It
    includes all reference points and the calculated triangles. The SOG uses the
    game's transform: scale 10, rotation Z 180°, offset Y −3.25. This tool is
    available in Storybook only.
  </p>
</main>

<style>
  main {
    box-sizing: border-box;
    padding: 24px;
    color: #182126;
    background: #f6f7f8;
    font:
      14px/1.5 system-ui,
      sans-serif;
  }
  h1 {
    margin: 0 0 8px;
    font-size: 24px;
  }
  h2 {
    margin-bottom: 6px;
    font-size: 18px;
  }
  p {
    margin: 8px 0 16px;
  }
  form,
  .toolbar,
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  form {
    margin-bottom: 16px;
  }
  form input {
    flex: 1;
  }
  input,
  button,
  .file {
    box-sizing: border-box;
    padding: 7px 10px;
    border: 1px solid #b9c3ca;
    border-radius: 4px;
    background: white;
    color: inherit;
    font: inherit;
  }
  input[type='checkbox'] {
    margin: 0 4px 0 0;
  }
  button,
  .file {
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.45;
    cursor: default;
  }
  .primary {
    background: #175f95;
    border-color: #175f95;
    color: white;
  }
  .toolbar {
    flex-wrap: wrap;
  }
  .grow {
    flex: 1;
  }
  .file {
    position: relative;
    overflow: hidden;
  }
  .file input {
    position: absolute;
    inset: 0;
    width: 100%;
    opacity: 0;
    cursor: pointer;
  }
  .instruction {
    padding: 10px 12px;
    border-left: 3px solid #175f95;
    background: #e8f1f7;
  }
  .error {
    padding: 10px;
    background: #ffe3e3;
    color: #8c1717;
  }
  .message {
    color: #3d5d37;
  }
  .views {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .table-scroll {
    max-height: 320px;
    overflow: auto;
    border: 1px solid #ccd2d6;
    background: white;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    position: sticky;
    top: 0;
    background: #e8ecef;
    text-align: left;
  }
  th,
  td {
    padding: 6px;
    border-bottom: 1px solid #e3e7ea;
  }
  td input {
    width: 100%;
    min-width: 85px;
  }
  td:nth-child(2) input {
    min-width: 180px;
  }
  .selected {
    background: #fff1d3;
  }
  .footnote {
    color: #52616a;
  }
  @media (max-width: 800px) {
    .views {
      grid-template-columns: 1fr;
    }
    main {
      padding: 12px;
    }
    form {
      flex-wrap: wrap;
    }
  }
</style>
