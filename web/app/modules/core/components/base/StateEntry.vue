<template>
  <NodeComponentListEntry
    :index="props.index"
    :name="props.name"
    :active="props.active"
    :preview="preview"
  >
    <NodeComponentRow name="name">
      <NodeComponentRowFieldText
        lazy
        :value="props.name"
        :maxlength="32"
        @update:value="(v: string) => emit('rename', v.trim())"
      />
    </NodeComponentRow>
    <NodeComponentRow name="key">
      <UIButton variant="ghost" class="state-entry-key" @click="emit('key')">
        {{ props.keyed ? "remove at playhead" : "key at playhead" }}
      </UIButton>
    </NodeComponentRow>
    <NodeComponentRow name="easing">
      <NodeComponentRowFieldSelect
        :options="EASING_OPTIONS"
        :value="props.state.easing"
        @update:value="(easing: string) => emit('patch', { easing })"
      />
    </NodeComponentRow>
  </NodeComponentListEntry>
</template>

<style scoped lang="postcss">
.state-entry-key {
  @apply -ml-3;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  index: number;
  name: string;
  state: Record<string, any>;
  active?: boolean;
  keyed?: boolean;
}>();

const emit = defineEmits<{
  rename: [value: string];
  patch: [changes: Record<string, any>];
  key: [];
}>();

const preview = computed(() => props.state.easing ?? DEFAULT_STATE_EASING);
</script>
