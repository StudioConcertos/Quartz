<template>
  <NodeComponent
    name="animation"
    :icon="props.icon"
    :components="props.components"
  >
    <NodeComponentRow name="keys">
      <p class="animation-summary">{{ summary }}</p>
    </NodeComponentRow>
  </NodeComponent>
</template>

<style scoped lang="postcss">
.animation-summary {
  @apply m-0 opacity-60;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  components: ComponentModel[];
  nodes: Tree[];
  icon: string;
}>();

const component = computed(() =>
  props.components.length === 1 ? props.components[0] : undefined,
);

const summary = computed(() => {
  const data = component.value?.data;

  if (!data) return "Select one node.";

  const fields = data.tracks?.length ?? 0;
  const states = data.stateKeys?.length ?? 0;

  return `${fields} keyed field${fields === 1 ? "" : "s"}, ${states} state key${states === 1 ? "" : "s"}`;
});
</script>
