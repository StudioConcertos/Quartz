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
        <AtelierDopesheetStateLane
          v-if="row.stateKeys.length"
          :keys="row.stateKeys"
          :duration="duration"
          @move="(from, to) => moveStateKey(row.node, from, to)"
          @remove="(t) => removeStateKey(row.node, t)"
        />
        <AtelierDopesheetTrack
          v-for="(track, i) in row.tracks"
          :key="i"
          :track="track"
          :duration="duration"
          @move="(from, to) => moveKey(row.node, track, from, to)"
          @remove="(t) => removeTrackKey(row.node, track, t)"
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
const { updateComponent, patchAnimation } = useDeckStore();
const { getStoredComponent } = useNodeComponents();
const { duration, time, canPlay } = usePlayhead();

const rows = computed(() => {
  const tree = currentTree.value;
  const named = tree ? flattenTree(tree) : [];

  const selection = selectedNodeIds.value;

  return animatedComponents.value
    .filter(
      (component) =>
        (!selection.length || selection.includes(component.node)) &&
        !isNodeLocked(named.find((n) => n.id === component.node)),
    )
    .map((component) => ({
      node: component.node,
      name: named.find((n) => n.id === component.node)?.name ?? "Node",
      tracks: (component.data.tracks ?? []) as Track[],
      stateKeys: (component.data.stateKeys ?? []) as StateKey[],
    }));
});

function removeTrackKey(node: string, track: Track, t: number) {
  patchAnimation(node, (data) => ({
    tracks: removeKey(data.tracks, track.type, track.path, t),
  }));
}

function removeStateKey(node: string, t: number) {
  patchAnimation(node, (data) => ({
    stateKeys: (data.stateKeys ?? []).filter((k: StateKey) => k.t !== t),
  }));
}

function moveKey(node: string, track: Track, from: number, to: number) {
  if (from === to) return;

  const anim = getStoredComponent(node, "core.animation");
  const key = track.keys.find((k) => k.t === from);

  if (!anim || !key) return;

  const without = anim.data.tracks.map((t: Track) =>
    t.type === track.type && t.path.join(".") === track.path.join(".")
      ? { ...t, keys: t.keys.filter((k: TrackKey) => k.t !== from) }
      : t,
  );

  updateComponent({
    ...anim,
    data: {
      ...anim.data,
      tracks: upsertKey(without, track.type, track.path, to, key.value),
    },
  });
}

function moveStateKey(node: string, from: number, to: number) {
  if (from === to) return;

  const anim = getStoredComponent(node, "core.animation");
  const key = (anim?.data.stateKeys ?? []).find((k: StateKey) => k.t === from);

  if (!anim || !key) return;

  updateComponent({
    ...anim,
    data: {
      ...anim.data,
      stateKeys: upsertStateKey(
        anim.data.stateKeys.filter((k: StateKey) => k.t !== from),
        to,
        key.name,
      ),
    },
  });
}
</script>
