<template>
  <NodeComponent name="base">
    <NodeComponentFieldText
      name="reference"
      :disabled="isRoot"
      v-model:value="reference"
    />
  </NodeComponent>
</template>

<script setup lang="ts">
const { updateNode } = useDeckStore();
const { selectedNode } = storeToRefs(useDeckStore());

const isRoot = computed(() => selectedNode.value?.path === "root");

const reference = computed({
  get() {
    return selectedNode.value?.reference ?? "";
  },
  set(value) {
    if (isRoot.value) return;

    updateNode({
      ...selectedNode.value,
      reference: value,
    } as Tree);
  },
});
</script>
