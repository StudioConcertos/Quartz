<template>
  <div v-if="canPlay" class="dopesheet">
    <AtelierDopesheetTransport />
    <div
      v-if="rows.length"
      :style="{ '--dopesheet-progress': duration ? time / duration : 0 }"
      class="dopesheet-rows"
    >
      <div class="dopesheet-line" />
      <template v-for="row in rows" :key="row.node">
        <p class="dopesheet-node">{{ row.name }}</p>
        <AtelierDopesheetLane
          v-if="row.stateKeys.length"
          state
          label="state"
          :keys="row.stateKeys"
          :duration="duration"
          @move="(from, to) => onMoveState(row.node, from, to)"
          @remove="(t) => onRemoveState(row.node, t)"
        />
        <AtelierDopesheetLane
          v-for="(track, i) in row.tracks"
          :key="i"
          :label="track.path.join('.')"
          :keys="track.keys"
          :duration="duration"
          @move="(from, to) => onMoveKey(row.node, track, from, to)"
          @remove="(t) => onRemoveKey(row.node, track, t)"
        />
      </template>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.dopesheet {
  @apply bg-dark-800 w-full;
  @apply border-solid border-0 border-t-2 border-dark-200;

  /* Line up by the transport's scrub and every lane */
  --dopesheet-label: 16ch;
}

.dopesheet-rows {
  @apply relative px-[2.5ch] pb-2 max-h-[20vh] overflow-y-auto;
}

.dopesheet-node {
  @apply ui-text-5 opacity-40 mt-2;
}

.dopesheet-line {
  @apply absolute top-0 bottom-0 w-px bg-accent pointer-events-none;

  left: calc(
    2.5ch + var(--dopesheet-label) + 0.75rem + var(--dopesheet-progress) *
      (100% - 5ch - var(--dopesheet-label) - 0.75rem)
  );
}
</style>

<script setup lang="ts">
const { animatedComponents, currentTree, selectedNodeIds } =
  storeToRefs(useDeckStore());
const { patchAnimation } = useDeckStore();
const { duration, time, canPlay } = usePlayhead();

const rows = computed(() => {
  const tree = currentTree.value;
  const named = new Map(
    (tree ? flattenTree(tree) : []).map((node) => [node.id, node]),
  );

  const selection = selectedNodeIds.value;

  return animatedComponents.value
    .filter(
      (component) =>
        (!selection.length || selection.includes(component.node)) &&
        !isNodeLocked(named.get(component.node)),
    )
    .map((component) => ({
      node: component.node,
      name: named.get(component.node)?.name ?? "Node",
      tracks: (component.data.tracks ?? []) as Track[],
      stateKeys: (component.data.stateKeys ?? []) as StateKey[],
    }));
});

function onRemoveKey(node: string, track: Track, t: number) {
  patchAnimation(node, (data) => ({
    tracks: removeKey(data.tracks, track.type, track.path, t),
  }));
}

function onRemoveState(node: string, t: number) {
  patchAnimation(node, (data) => ({
    stateKeys: (data.stateKeys ?? []).filter((k: StateKey) => k.t !== t),
  }));
}

function onMoveKey(node: string, track: Track, from: number, to: number) {
  patchAnimation(node, (data) => ({
    tracks: moveTrackKey(data.tracks, track.type, track.path, from, to),
  }));
}

function onMoveState(node: string, from: number, to: number) {
  patchAnimation(node, (data) => ({
    stateKeys: moveStateKey(data.stateKeys, from, to),
  }));
}
</script>
