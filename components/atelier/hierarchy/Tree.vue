<template>
  <ul class="tree">
    <Node
      v-if="!isEmptyTree(currentTree)"
      :id="currentTree.id"
      data-path="root"
      data-type="group"
      :node="currentTree"
    />
    <div v-else>Loading...</div>
  </ul>
</template>

<style scoped lang="postcss">
.tree {
  /*
    By setting the max height to the half of the screen's,
    it prevents the tree to overflow,
    and also makes it responsive to different screen heights.

    (100vh / Amount of views inside the inspector)
  */
  @apply list-none h-full max-h-[50vh] overflow-y-auto;
}
</style>

<script setup lang="ts">
import { RealtimeChannel } from "@supabase/supabase-js";

const client = useSupabaseClient<Database>();

const { currentTree } = storeToRefs(useDeckStore());

let nodesRC: RealtimeChannel;

onMounted(() => {
  nodesRC = client
    .channel("public:nodes")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "nodes" },
      () => useDeckStore().fetchAllNodes()
    )
    .subscribe();
});

onUnmounted(() => {
  client.removeChannel(nodesRC);
});
</script>
