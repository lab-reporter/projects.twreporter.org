<script>
    import {membersIdentityByName} from '../assets/data-store.js';
    import Tooltip from './Tooltip.svelte';

    export let tableData = [
        {
            vitae: "dolorem",
            lectus: "ipsum",
            quisquam: "quia"
        },
        {
            vitae: "amet",
            lectus: "consectetur",
            quisquam: "adipisci"
        }
    ];
    export let style;
    const columns = tableData.length ? Object.keys(tableData[0]) : [];

    // table column width
    export let firstColumnWidth = 'var(--firstColumnWidth)'; // 可為數字(px)或字串(%, px, rem, ch等)
    function normalizeWidth(v) {
        if (v == null) return null;
        if (typeof v === 'number' && isFinite(v)) return `${v}px`;
        const s = String(v).trim();
        return s.length ? s : null;
    }

    $: firstColW = normalizeWidth(firstColumnWidth);
    $: otherColsW = firstColW && columns.length > 1
        ? `calc((100% - ${firstColW}) / ${columns.length - 1})`
        : null;

    function identityTooltipFor(name) {
        if (!name) return null;
        const match = $membersIdentityByName && $membersIdentityByName.get
            ? $membersIdentityByName.get(name)
            : null;
        if (!match) return null;
        const parts = [match.姓名, match.時任黨籍, match.時任委員會, match.時任黨團幹部].filter(Boolean);
        return parts.join('\n');
    }

    // Tooltip
    function identityInfoFor(cellText) {
        if (!cellText) return null;
        const parts = String(cellText)
            .split('\n')
            .map(s => s.trim())
            .filter(Boolean);

        const identities = [];
        for (const part of parts) {
            const match = $membersIdentityByName && $membersIdentityByName.get
                ? $membersIdentityByName.get(part)
                : null;
            if (match) {
                const committee = match.時任委員會 || '';
                const whip = match.時任黨團幹部 || '';
                identities.push({
                    name: match.姓名,
                    party: match.時任黨籍 || '',
                    committee,
                    whip,
                });
            }
        }
        if (!identities.length) return null;
        return {identities};
    }

    // Map of party to text color for cells
    const PARTY_COLOR_MAP = {
        '國民黨': 'var(--party-kmt-hl)',
        '民進黨': 'var(--party-dpp-hl)',
        '民眾黨': 'var(--party-tpp-hl)',
        '時代力量': 'var(--party-npp-hl)'
    };

    // Decide cell text color based on unique party found in the cell
    function getCellPartyColor(cellText) {
        const info = identityInfoFor(cellText);
        if (!info || !info.identities || info.identities.length === 0) return '';
        const parties = Array.from(new Set(info.identities.map(i => i.party).filter(Boolean)));
        if (parties.length !== 1) return '';
        return PARTY_COLOR_MAP[parties[0]] || '';
    }

    // Split a cell text into lines and attach color per name based on party
    function getCellParts(cellText) {
        const raw = cellText == null ? '' : String(cellText);
        const lines = raw.split('\n').map(s => s.trim()).filter(Boolean);
        const parts = lines.map((name, idx) => {
            const match = $membersIdentityByName && $membersIdentityByName.get
                ? $membersIdentityByName.get(name)
                : null;
            const party = match && match.時任黨籍 ? match.時任黨籍 : '';
            const color = party && PARTY_COLOR_MAP[party] ? PARTY_COLOR_MAP[party] : '';
            return {text: name, color, br: idx < lines.length - 1};
        });
        // If nothing matched or empty, fallback to raw text as a single part (no color)
        return parts.length ? parts : [{text: raw, color: ''}];
    }

    let tooltip = null; // { x, y, identities } or null
    function onEnter(e, info) {
        tooltip = info;
        updatePos(e);
    }

    function onMove(e) {
        if (tooltip) updatePos(e);
    }

    function onLeave() {
        tooltip = null;
    }

    function updatePos(e) {
        const offset = 12;
        const {clientX, clientY} = e;
        tooltip = tooltip && {...tooltip, x: clientX + offset, y: clientY + offset};
    }

    // Merging cell based on empty cell
    function isEmptyValue(val) {
        return val == null || String(val).trim() === '';
    }

    function getColspan(row, i) {
        const cur = row[columns[i]];
        if (isEmptyValue(cur)) return 1;
        const isLast = i === columns.length - 1;
        if (!isLast) {
            const nextVal = row[columns[i + 1]];
            if (isEmptyValue(nextVal)) return 2;
        }
        return 1;
    }

    function isSpannedByPrev(row, i) {
        if (i === 0) return false;
        return getColspan(row, i - 1) > 1;
    }
</script>

<table class={style} style:table-layout={firstColW ? 'fixed' : undefined}>
  <colgroup>
    {#each columns as col, idx}
      <col style:width={idx === 0 ? firstColW : otherColsW}/>
    {/each}
  </colgroup>
  <thead>
  <tr>
    {#each columns as col}
      <th>{col}</th>
    {/each}
  </tr>
  </thead>
  <tbody>
  {#each tableData as row}
    <tr>
      {#each columns as col, i}
        {#if isSpannedByPrev(row, i)}
        {:else}
          <td
              colspan={getColspan(row, i)}
              on:mouseenter={(e) => onEnter(e, identityInfoFor(row[col]))}
              on:mousemove={onMove}
              on:mouseleave={onLeave}
          >
            {#each getCellParts(row[col]) as part, idx}
              <span>{part.text}</span>
              <div class="party-dot" style:background-color={part.color}></div>
              {#if part.br}<br>{/if}
            {/each}
          </td>
        {/if}
      {/each}
    </tr>
  {/each}
  </tbody>
</table>

{#if tooltip}
  <Tooltip
      x={tooltip.x}
      y={tooltip.y}
      identities={tooltip.identities}
  />
{/if}

<style>
  table, th, td {
    border-collapse: collapse;
  }

  td {
    white-space: pre-line;
  }

  table {
    border: 1px solid #ccc;
    background-color: #eee;
    width: 100%;
    text-align: center;
    border-collapse: collapse;
  }

  table td, table th {
    border: 1px solid #bbb;
    padding: 3px 2px;
  }

  table tbody td {
    font-size: var(--fs-m);
    color: #505050;
    font-weight: 450;
  }

  table tbody td:first-child {
    font-weight: 650;
  }

  table tr:nth-child(even) {
    background: #ddd;
  }

  table thead {
    background: #333;
  }

  table thead th {
    font-size: var(--fs-m);
    font-weight: 500;
    color: #FFFFFF;
    text-align: center;
    border-left: 1px solid #f1f1f1;
  }

  table thead th:first-child {
    border-left: none;
  }

  table.tenth {
    --firstColumnWidth: 190px;
    @media (min-width: 481px) and (max-width: 580px) {
      --firstColumnWidth: 125px;
    }
    @media (max-width: 480px) {
      --firstColumnWidth: 95px;
    }
  }
  table.tenth tbody td {
    padding: 13.2px 0;
    @media (min-width: 481px) and (max-width: 580px) {
      padding: 8px 5px;
    }
    @media (max-width: 480px) {
      font-size: var(--fs-s);
      padding: 10px 0;
    }
  }
  table.tenth thead th {
    padding: 10px 0;
    @media (min-width: 481px) and (max-width: 580px) {
      padding: 5px 5px;
    }
    @media (max-width: 480px) {
      font-size: var(--fs-s);
      padding: 5px 0;
    }
  }

  table.eleventh {
    --firstColumnWidth: 190px;
    @media (min-width: 481px) and (max-width: 580px) {
      --firstColumnWidth: 125px;
    }
    @media (max-width: 480px) {
      --firstColumnWidth: 95px;
    }
  }
  table.eleventh tbody td {
    padding: 3.8px 5px;
    @media (min-width: 481px) and (max-width: 580px) {
      padding: 5px 2px;
    }
    @media (max-width: 480px) {
      font-size: var(--fs-s);
      padding: 5px 5px;
    }
  }
  table.eleventh thead th {
    padding: 3px 0;
    @media (min-width: 481px) and (max-width: 580px) {
      padding: 5px 5px;
    }
    @media (max-width: 480px) {
      font-size: var(--fs-s);
      padding: 5px 0;
    }
  }

  .party-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
    vertical-align: top;
    margin-top: 5px;
    margin-left: -1px;
    margin-right: -8px;
  }
</style>