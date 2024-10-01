<template>
  <ul class="tree">
    <AtelierHierarchyTreeNode
      :name="`${nodes[0].name}` + ' ' + `${currentSlidesIndex + 1}`"
      isGroup
      :children="nodes.slice(1)"
      :reference="nodes[0].reference ?? ''"
    />
  </ul>
</template>

<style scoped lang="postcss">
.tree {
  /*
    By setting the max height to the half of the screen's,
    it prevents the tree to overflow,
    and also makes it responsive to different screen heights.

    (100vh / Number of elements inside the inspector)
  */
  @apply list-none h-full max-h-[50vh] overflow-y-auto;
}
</style>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

const { nodes, currentSlidesIndex } = storeToRefs(useDeckStore());

let nodesRC: RealtimeChannel;

const { refresh: refreshNodes } = await useAsyncData(
  async () => await useDeckStore().fetchAllNodes()
);

onMounted(() => {
  nodesRC = client
    .channel("public:nodes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "nodes" },
      () => refreshNodes()
    )
    .subscribe();
});

onUnmounted(() => {
  client.removeChannel(nodesRC);
});
</script>
