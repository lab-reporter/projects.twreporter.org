<script>
  import Header from '@/lib/components/Header.svelte'
  import Loading from '@/lib/components/icons/Loading.svelte'
  import Panel from '@/lib/components/ui/Panel.svelte'
  import SidebarColorInput from '@/lib/components/ui/sidebar/SidebarColorInput.svelte'
  import TabContent from '@/lib/components/ui/tabs/TabContent.svelte'
  import TabList from '@/lib/components/ui/tabs/TabList.svelte'
  import { useConvexClient, useQuery } from 'convex-svelte'
  import { api } from '~convex/api'

  const tabs = {
    category: {
      value: 'category',
      label: '類別',
    },
  }

  const categories = useQuery(api.categories.getCategories, {})

  const convex = useConvexClient()
</script>

<Header />

<Panel variant="top"><h1>工具設定</h1></Panel>
<Panel variant="left">
  <TabList tabs={[{ ...tabs.category }]} />
</Panel>

<div class="content">
  <TabContent value={tabs.category.value}>
    <div class="categories">
      {#if categories.isLoading}
        <Loading />
      {:else if categories.data}
        {#each categories.data as category (category._id)}
          <SidebarColorInput
            label={category.label}
            bind:color={
              () => category.color,
              (newColor) =>
                convex.mutation(
                  api.categories.updateCategory,
                  { categoryId: category._id, patch: { color: newColor } },
                  {
                    optimisticUpdate: (store, args) => {
                      const query = store.getQuery(
                        api.categories.getCategories,
                        {},
                      )

                      if (!query) return

                      store.setQuery(
                        api.categories.getCategories,
                        {},
                        query.map((query) =>
                          query._id === category._id
                            ? { ...query, ...args.patch }
                            : query,
                        ),
                      )
                    },
                  },
                )
            }
            bind:value={
              () => category.label,
              (newLabel) =>
                convex.mutation(
                  api.categories.updateCategory,
                  { categoryId: category._id, patch: { label: newLabel } },
                  {
                    optimisticUpdate: (store, args) => {
                      const query = store.getQuery(
                        api.categories.getCategories,
                        {},
                      )

                      if (!query) return

                      store.setQuery(
                        api.categories.getCategories,
                        {},
                        query.map((query) =>
                          query._id === category._id
                            ? { ...query, ...args.patch }
                            : query,
                        ),
                      )
                    },
                  },
                )
            }
          />
        {/each}
      {/if}
    </div>
  </TabContent>
</div>

<style>
  h1 {
    font-size: var(--text-m);
  }

  .content {
    padding: 20px;
    overflow: scroll;
  }

  .categories {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
</style>
