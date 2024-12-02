<template>
  <NodeComponent name="base">
    <div class="field">
      <label>reference</label>
      <input
        v-model.lazy="reference"
        :class="{
          'cursor-not-allowed opacity-60': isRoot,
        }"
        class="w-50!"
        type="text"
        maxlength="20"
        :disabled="isRoot"
      />
    </div>
  </NodeComponent>
</template>

<script setup lang="ts">
const { updateNode } = useDeckStore();
const { selectedNode } = storeToRefs(useDeckStore());

const isRoot = computed(() => selectedNode.value?.path === "root");

const reference = computed({
  get() {
    return selectedNode.value?.reference;
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
