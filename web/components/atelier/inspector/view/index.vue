<template>
  <div class="tab" :class="props.name.toLowerCase()">
    <h3>
      {{ props.name }}
      <div class="actions">
        <Tooltip v-for="action in props.actions" :description="action.tooltip">
          <button @click="action.onClick">
            <div :class="action.icon"></div>
          </button>
        </Tooltip>
      </div>
    </h3>
    <div class="whitespace"></div>
    <slot />
  </div>
</template>

<style scoped lang="postcss">
.tab {
  @apply flex flex-col;

  h3 {
    @apply text-4 3xl:text-4.5;
    @apply flex justify-between items-center;

    .actions {
      @apply flex justify-between items-center;

      .tooltip {
        @apply flex mx-2;

        button {
          @apply text-4.5 3xl:text-5;
        }
      }

      .tooltip:first-of-type {
        @apply ml-0;
      }

      .tooltip:last-of-type {
        @apply mr-0;
      }
    }
  }
}
</style>

<script setup lang="ts">
const props = defineProps<{
  name: string;
  actions?: {
    icon: string;
    tooltip: string;
    onClick: () => void;
  }[];
}>();
</script>
