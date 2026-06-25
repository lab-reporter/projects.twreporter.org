<script lang="ts">
  const searchParams = new URLSearchParams(window.location.search)
  const editMode = searchParams.has('edit')
  const docId = searchParams.get('doc')
</script>

<main>
  <twreporter-3d-terrain edit={editMode} doc-id={docId ?? undefined}
  ></twreporter-3d-terrain>
</main>
