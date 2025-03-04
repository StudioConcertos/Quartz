<template>
  <dialog ref="modal">
    <div v-if="!props.isMinimal">
      <h4>{{ props.title }}:</h4>
      <div class="h-8"></div>
    </div>
    <slot />
  </dialog>
</template>

<style scoped lang="postcss">
dialog {
  @apply absolute top-1/2 left-1/2 px-8 py-12;
  @apply translate-x-[-50%] translate-y-[-50%];
  @apply border-2 border-dark-200 border-rd;
  @apply bg-dark-900 text-light-200 select-none;

  &::backdrop {
    @apply bg-dark-900/60;
  }
}

h4 {
  @apply text-xl text-center;
}
</style>

<script setup lang="ts">
const props = defineProps<{
  title: string;
  isMinimal?: boolean;
}>();

const modal = ref<HTMLDialogElement>();

defineExpose({
  open: () => modal.value?.showModal(),
  close: () => modal.value?.close(),
});
</script>
