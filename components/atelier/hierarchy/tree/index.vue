<template>
  <ul class="tree">
    <AtelierHierarchyTreeNode
      :key="tree.id"
      :name="`${tree.name}` + ' ' + `${currentSlidesIndex + 1}`"
      isGroup
      :children="tree.children"
      :reference="tree.reference ?? ''"
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

const { tree, currentSlidesIndex } = storeToRefs(useDeckStore());

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
