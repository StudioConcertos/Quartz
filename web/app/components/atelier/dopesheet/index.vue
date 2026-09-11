<template>
  <div class="dopesheet">
    <AtelierDopesheetTransport />
    <div
      v-if="rows.length"
      :style="{ '--dopesheet-progress': slideDuration ? time / slideDuration : 0 }"
      class="dopesheet-rows"
    >
      <div class="dopesheet-line" />
      <template v-for="row in rows" :key="row.node">
        <p class="dopesheet-node">{{ row.name }}</p>
        <AtelierDopesheetTrack
          v-for="(track, i) in row.tracks"
          :key="i"
          :track="track"
          :duration="slideDuration"
          @move="(from, to) => moveKey(row.node, track, from, to)"
        />
      </template>
    </div>
    <p v-else class="dopesheet-empty">{{ emptyMessage }}</p>
  </div>
</template>

<style scoped lang="postcss">
.dopesheet {
  @apply bg-dark-800 w-full;
  @apply border-solid border-0 border-t-2 border-dark-200;
}

.dopesheet-rows {
  @apply relative px-[2.5ch] pb-2 max-h-[20vh] overflow-y-auto;

  --dopesheet-label: 16ch;
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

.dopesheet-empty {
  @apply ui-text-5 opacity-40 px-[2.5ch] pb-2;
}
</style>

<script setup lang="ts">
const { currentComponents, animationVersion, currentTree, selectedNodeIds } =
  storeToRefs(useDeckStore());
const { updateComponent } = useDeckStore();
const { getStoredComponent } = useNodeComponents();
const { duration, time } = usePlayhead();

// A first key always lands at t=0, so a purely derived length would be 0 and
// the playhead could never leave the spot needed to place a second key.
const MIN_SPAN = 5000;

const slideDuration = computed(() => {
  animationVersion.value;

  // Raw, so iterating does not subscribe to every component on the slide.
  const animated = toRaw(currentComponents.value ?? []).filter(
    (component) =>
      component.type === "core.animation" && component.data.tracks?.length,
  );

  if (!animated.length) return 0;

  return Math.max(
    MIN_SPAN,
    animated.reduce(
      (longest, component) =>
        Math.max(longest, tracksDuration(component.data.tracks)),
      0,
    ),
  );
});

watchEffect(() => (duration.value = slideDuration.value));

const rows = computed(() => {
  animationVersion.value;

  const tree = currentTree.value;
  const named = tree ? flattenTree(tree) : [];

  const selection = selectedNodeIds.value;

  return toRaw(currentComponents.value ?? [])
    .filter(
      (component) =>
        component.type === "core.animation" &&
        component.data.tracks?.length &&
        (!selection.length || selection.includes(component.node)),
    )
    .map((component) => ({
      node: component.node,
      name: named.find((n) => n.id === component.node)?.name ?? "Node",
      tracks: component.data.tracks as Track[],
    }));
});

const emptyMessage = computed(() =>
  selectedNodeIds.value.length
    ? "No animation on the selection."
    : "No animation on this slide.",
);

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
</script>
