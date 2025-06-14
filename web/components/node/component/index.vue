<template>
  <div :class="{ 'opacity-100!': isOpen }" class="component" tabindex="0">
    <header @click="toggleComponent">
      <h4>
        <div class="icon" :class="icon"></div>
        {{ props.name.toUpperCase() }}
      </h4>
      <div
        :class="isOpen ? 'i-carbon-caret-down' : 'i-carbon-caret-right'"
        class="arrow"
      ></div>
    </header>
    <div v-if="isOpen" class="fields">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.component {
  @apply w-full bg-dark-900;
  @apply border-solid border-0 border-b-2 border-dark-200;
  @apply opacity-60 hover:opacity-100;
  @apply transition-opacity duration-150;

  header {
    @apply flex items-center justify-between p-6 cursor-pointer;

    h4 {
      @apply font-300 opacity-80;
      @apply flex items-center gap-2;

      .icon {
        @apply text-xl mt-0.5;
      }
    }

    .arrow {
      @apply text-2xl opacity-80;
    }
  }

  .fields {
    @apply px-6 pb-6;

    &:deep(.field) {
      @apply flex;

      &:not(:last-child) {
        @apply mb-6;
      }

      label {
        @apply text-sm w-1/3;
      }

      > *:not(label) {
        @apply p-0 flex-1;
      }
    }
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  name: string;
}>();

const isOpen = ref(false);

const icon = computed(() => {
  switch (props.name) {
    case "base":
      return "i-carbon-array";

    case "camera":
      return "i-carbon-camera";

    case "layout":
      return "i-carbon-template";

    case "model":
      return "i-carbon-model-alt";

    case "scene":
      return "i-carbon-web-services-container";

    case "transform":
      return "i-carbon-shapes";

    case "typography":
      return "i-carbon-text-font";
  }
});

function toggleComponent() {
  isOpen.value = !isOpen.value;
}
</script>
