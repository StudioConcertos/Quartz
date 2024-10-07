<template>
  <div v-if="useDeckStore().selectedNode" class="view" @contextmenu.prevent>
    <NodeComponentBase />
    <NodeComponentTransform :data="{}" />
    <NodeComponentText :data="{}" />
  </div>
  <div v-else class="placeholder" @contextmenu.prevent>
    <div class="i-carbon-error"></div>
    <p>No node selected</p>
  </div>
</template>

<style scoped lang="postcss">
.view,
.placeholder {
  @apply w-full h-full;
  @apply border-rd border-0;
  @apply bg-dark-800 text-light-200;
}

.placeholder {
  @apply flex flex-col justify-center items-center text-4;

  [class*="i-"] {
    @apply text-10 mb-6;
  }
}
</style>
