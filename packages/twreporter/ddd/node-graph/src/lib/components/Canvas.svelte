<script lang="ts">
    import {
        Position,
        SvelteFlow,
        type NodeTypes,
        type EdgeTypes,
    } from '@xyflow/svelte'
    import { useQuery, useConvexClient } from 'convex-svelte'
    import { api } from '~convex/api'
    import type { Id } from '~convex/dataModel'
    import GraphEdge from './canvas/GraphEdge.svelte'
    import GraphNode from './canvas/GraphNode.svelte'
    import type { FlowEdge, FlowNode } from './canvas/types'
    import '@xyflow/svelte/dist/style.css'

    const { graphId }: { graphId: string } = $props()

    const convex = useConvexClient()
    const graphQuery = useQuery(api.graphs.getGraph, () => ({
        graphId: graphId as Id<'graphs'>,
    }))

    const nodeTypes = {
        'graph-node': GraphNode,
    } satisfies NodeTypes

    const edgeTypes = {
        'graph-edge': GraphEdge,
    } satisfies EdgeTypes

    const graphNodes = $derived.by<FlowNode[]>(() => {
        const graphData = graphQuery.data

        if (!graphData) return []

        return graphData.nodes.map((node) => ({
            id: node._id,
            type: 'graph-node',
            position: node.position,
            data: {
                label: node.label,
                categoryLabel: node.categoryLabel,
                categoryColor: node.categoryColor,
                note: node.note,
                infoSource: node.infoSource,
                expanded: node.expanded,
            },
            sourcePosition: Position.Right,
            targetPosition: Position.Left,
            draggable: true,
            selectable: false,
            focusable: false,
            dragHandle: '.graph-node',
        }))
    })

    const graphEdges = $derived.by<FlowEdge[]>(() => {
        const graphData = graphQuery.data

        if (!graphData) return []

        return graphData.edges.map((edge) => ({
            id: edge._id,
            type: 'graph-edge',
            source: edge.source,
            target: edge.target,
            data: {
                relationLabel: edge.label ?? '',
                sourceLabel: edge.sourceLabel,
                targetLabel: edge.targetLabel,
                note: edge.note,
                infoSource: edge.infoSource,
                directed: edge.directed,
            },
            label: edge.label,
            selectable: false,
            focusable: false,
        }))
    })

    let flowNodes = $state.raw<FlowNode[]>([])
    let flowEdges = $state.raw<FlowEdge[]>([])

    $effect(() => {
        flowNodes = graphNodes
        flowEdges = graphEdges
    })

    function updateLocalNode(
        nodeId: string,
        update: (node: FlowNode) => FlowNode,
    ) {
        flowNodes = flowNodes.map((node) =>
            node.id === nodeId ? update(node) : node,
        )
    }

    async function persistNodePositions(nodes: FlowNode[]) {
        await Promise.all(
            nodes.map((node) =>
                convex.mutation(api.graphs.updateNodePosition, {
                    nodeId: node.id as Id<'nodes'>,
                    position: node.position,
                }),
            ),
        )
    }

    function handleNodeClick(node: FlowNode) {
        const nextExpanded = !node.data.expanded

        updateLocalNode(node.id, (currentNode) => ({
            ...currentNode,
            data: {
                ...currentNode.data,
                expanded: nextExpanded,
            },
        }))

        void convex.mutation(api.graphs.setNodeExpanded, {
            nodeId: node.id as Id<'nodes'>,
            expanded: nextExpanded,
        })
    }
</script>

{#if graphQuery.error}
    <div class="canvas-shell message-state">
        <div class="message">
            無法載入圖譜資料：{graphQuery.error.message}
        </div>
    </div>
{:else if graphQuery.isLoading}
    <div class="canvas-shell message-state">
        <div class="message">載入圖譜資料中…</div>
    </div>
{:else if !graphQuery.data}
    <div class="canvas-shell message-state">
        <div class="message">找不到這張圖譜。</div>
    </div>
{:else}
    <div class="canvas-shell">
        <div class="canvas-surface">
            <SvelteFlow
                bind:nodes={flowNodes}
                bind:edges={flowEdges}
                {nodeTypes}
                {edgeTypes}
                fitView
                fitViewOptions={{ padding: 0.22 }}
                minZoom={0.4}
                maxZoom={1.75}
                nodeDragThreshold={4}
                elementsSelectable={false}
                selectionOnDrag={false}
                panOnDrag
                onnodeclick={({ node }) => {
                    handleNodeClick(node as FlowNode)
                }}
                onnodedragstop={({ nodes }) => {
                    void persistNodePositions(nodes as FlowNode[])
                }}
                proOptions={{ hideAttribution: true }}
            ></SvelteFlow>
        </div>
    </div>
{/if}

<style>
    .canvas-shell {
        min-width: 0;
        min-height: 0;
        background: transparent;
    }

    .canvas-shell.message-state {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .canvas-shell .message {
        padding: 16px 20px;
        border: 1px solid var(--neutral-gray-300);
        border-radius: 12px;
        background: rgba(255, 255, 255, 0.8);
        color: var(--neutral-gray-700);
        font-size: 14px;
    }

    .canvas-surface {
        min-width: 0;
        min-height: 0;
        height: 100%;
        padding: 0 14px 14px 0;
    }

    .canvas-surface :global(.svelte-flow) {
        border-top-right-radius: 18px;
        background: transparent;
    }

    .canvas-surface :global(.svelte-flow__renderer) {
        cursor: grab;
    }

    .canvas-surface :global(.svelte-flow__renderer:active) {
        cursor: grabbing;
    }

    .canvas-surface :global(.svelte-flow__viewport) {
        background: transparent;
    }

    .canvas-surface :global(.svelte-flow__attribution) {
        display: none;
    }
</style>
