<template>
  <div class="row">
    <label>{{ name }}</label>
    <div class="fields">
      <span v-if="source" class="row-bound-source">{{ source }}</span>
      <slot v-else :value="value" :update="update" />
    </div>
    <button
      v-if="keyPaths.length"
      type="button"
      class="row-key"
      :class="{ 'row-key-active': keyedHere, 'row-key-tracked': anyTracked }"
      :title="keyedHere ? 'Remove this key' : 'Key this field'"
      @click="keyPaths.forEach(keyedHere ? unkey : key)"
    />
    <NodeComponentRowBind v-if="path && kind" :path="path" :kind="kind" />
  </div>
</template>

<style scoped lang="postcss">
.row-bound-source {
  @apply flex-1 w-0 truncate text-accent;
}

.row-key {
  @apply w-2.5 h-2.5 ml-2 p-0 rotate-45 shrink-0 self-center;
  @apply bg-transparent border-solid border-1 border-light-200/60;
  @apply opacity-60 cursor-pointer transition-opacity;

  &:hover {
    @apply opacity-100;
  }

  &.row-key-tracked {
    @apply border-accent opacity-100;
  }

  &.row-key-active {
    @apply bg-accent border-accent opacity-100;
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  path?: string;
  paths?: string[];
  kind?: VariableKind;
  override?: { value: any; update: (next: unknown) => void };
}>();

const { components, source } = useBoundSource(() => props.path);
const { field, set, key, unkey, keyed, tracked } = useMergedFields(components);

const segments = computed(() => props.path?.split(".") ?? []);

const keyPaths = computed<string[][]>(() =>
  props.paths?.length
    ? props.paths.map((p) => p.split("."))
    : props.path
      ? [props.path.split(".")]
      : [],
);

const keyedHere = computed(() => keyPaths.value.every((p) => keyed(p)));

const anyTracked = computed(() => keyPaths.value.some((p) => tracked(p)));

const value = computed(() => {
  if (props.override) return props.override.value;

  return props.path ? field(segments.value) : undefined;
});

function update(next: unknown) {
  if (props.override) return props.override.update(next);

  set(segments.value, next);
}
</script>
