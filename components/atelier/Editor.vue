<template>
  <div class="editor border-r">
    <template v-if="activeTab === 0">
      <AtelierHierarchy />
      <div class="whitespace"></div>
      <AtelierProperties />
    </template>

    <template v-if="activeTab === 1">
      <AtelierAssets />
    </template>
  </div>
</template>

<style scoped lang="postcss">
.editor {
  @apply bg-dark-700 w-[30vw] p-[2.5ch];
  @apply flex flex-col;

  /*
    The bottom padding offsets back the hidden overflow on the Y axis,
    which prevents the last element not being scrollable.
  */
  .hierarchy,
  .properties {
    @apply flex-1 overflow-y-hidden pb-10;
  }
}
</style>

<script setup lang="ts">
const { activeTab } = storeToRefs(useAtelierStore());
</script>
